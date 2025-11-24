import { and, eq /*not*/ } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

import {
  //   CallEndedEvent,
  //   CallTranscriptionReadyEvent,
  //   CallRecordingReadyEvent,
  CallSessionParticipantLeftEvent,
  CallSessionStartedEvent,
} from "@stream-io/node-sdk";

import { db } from "@/db";
import { interviews, coaches } from "@/db/schema";
import { streamVideo } from "@/lib/stream-video";
import { InterviewStatus } from "@/modules/interviews/types";

function verifySignatureWithSDK(body: string, signature: string): boolean {
  return streamVideo.verifyWebhook(body, signature);
}

export async function POST(request: NextRequest) {
  const signature = request.headers.get("x-signature");
  const apiKey = request.headers.get("x-api-key");

  if (!signature || !apiKey) {
    return NextResponse.json(
      { error: "Missing signature or api key" },
      { status: 400 }
    );
  }

  const body = await request.text();

  if (!verifySignatureWithSDK(body, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
  }

  let payload: unknown;
  try {
    payload = JSON.parse(body) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const eventType = (payload as Record<string, unknown>)?.type;

  if (eventType === "call.session_started") {
    const event = payload as CallSessionStartedEvent;
    const interviewId = event.call.custom?.interview_id;

    if (!interviewId) {
      return NextResponse.json(
        { error: "Interview ID not found" },
        { status: 400 }
      );
    }

    const [interview] = await db
      .select()
      .from(interviews)
      .where(
        and(
          eq(interviews.id, interviewId),
          eq(interviews.status, InterviewStatus.UPCOMING)
        )
      );

    if (!interview) {
      return NextResponse.json(
        { error: "Interview not found" },
        { status: 404 }
      );
    }

    await db
      .update(interviews)
      .set({
        status: InterviewStatus.IN_PROGRESS,
        startedAt: new Date(),
      })
      .where(eq(interviews.id, interviewId));

    const [coach] = await db
      .select()
      .from(coaches)
      .where(eq(coaches.id, interview.coachId));

    if (!coach) {
      return NextResponse.json({ error: "Coach not found" }, { status: 404 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key not found" },
        { status: 500 }
      );
    }

    const call = streamVideo.video.call("default", interviewId);
    const realtimeClient = await streamVideo.video.connectOpenAi({
      call,
      openAiApiKey: process.env.OPENAI_API_KEY,
      agentUserId: coach.id,
      model: "gpt-4o-realtime-preview",
    });

    await realtimeClient.updateSession({
      instructions: coach.instructions,
      turn_detection: {
        type: "server_vad",
      },
    });

    console.log("OpenAI bot connected", realtimeClient);
  } else if (eventType === "call.session_participant_left") {
    const event = payload as CallSessionParticipantLeftEvent;
    const interviewId = event.call_cid.split(":")[1]; // call_cid is formatted as "type:id"

    if (!interviewId) {
      return NextResponse.json(
        { error: "Interview ID not found" },
        { status: 400 }
      );
    }

    const call = streamVideo.video.call("default", interviewId);
    await call.end();
  }

  return NextResponse.json({ message: "Webhook received" }, { status: 200 });
}
