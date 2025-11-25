// import from the framework
import { NextRequest, NextResponse } from "next/server";

// import from the packages
import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { and, eq } from "drizzle-orm";
import {
  MessageNewEvent,
  CallEndedEvent,
  CallTranscriptionReadyEvent,
  CallRecordingReadyEvent,
  CallSessionParticipantLeftEvent,
  CallSessionStartedEvent,
} from "@stream-io/node-sdk";
import { streamVideo } from "@/lib/stream-video";

// import from the libraries
import { db } from "@/db";
import { interviews, coaches } from "@/db/schema";
import { InterviewStatus } from "@/modules/interviews/types";
import { inngest } from "@/inngest/client";
import { generateAvatarUri } from "@/lib/avatar";
import { streamChat } from "@/lib/stream-chat";

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

    await db
      .update(interviews)
      .set({
        status: InterviewStatus.IN_PROGRESS,
        startedAt: new Date(),
      })
      .where(eq(interviews.id, interviewId));
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
  } else if (eventType === "call.session_ended") {
    const event = payload as CallEndedEvent;
    const interviewId = event.call.custom?.interview_id;

    if (!interviewId) {
      return NextResponse.json(
        { error: "Interview ID not found" },
        { status: 400 }
      );
    }

    await db
      .update(interviews)
      .set({
        status: InterviewStatus.PROCESSING,
        endedAt: new Date(),
      })
      .where(
        and(
          eq(interviews.id, interviewId),
          eq(interviews.status, InterviewStatus.IN_PROGRESS)
        )
      );
  } else if (eventType === "call.transcription_ready") {
    const event = payload as CallTranscriptionReadyEvent;
    const interviewId = event.call_cid.split(":")[1]; // call_cid is formatted as "type:id"

    if (!interviewId) {
      return NextResponse.json(
        { error: "Interview ID not found" },
        { status: 400 }
      );
    }

    const [updatedInterview] = await db
      .update(interviews)
      .set({
        transcriptUrl: event.call_transcription.url,
      })
      .where(eq(interviews.id, interviewId))
      .returning();

    if (!updatedInterview) {
      return NextResponse.json(
        { error: "Interview not found" },
        { status: 404 }
      );
    }

    await inngest.send({
      name: "interviews/processing",
      data: {
        interviewId,
        transcriptUrl: event.call_transcription.url,
      },
    });
  } else if (eventType === "call.recording_ready") {
    const event = payload as CallRecordingReadyEvent;
    const interviewId = event.call_cid.split(":")[1]; // call_cid is formatted as "type:id"

    if (!interviewId) {
      return NextResponse.json(
        { error: "Interview ID not found" },
        { status: 400 }
      );
    }

    const [updatedInterview] = await db
      .update(interviews)
      .set({
        recordingUrl: event.call_recording.url,
      })
      .where(eq(interviews.id, interviewId))
      .returning();

    if (!updatedInterview) {
      return NextResponse.json(
        { error: "Interview not found" },
        { status: 404 }
      );
    }
  } else if (eventType === "message.new") {
    const event = payload as MessageNewEvent;

    const userId = event.user?.id;
    const channelId = event.channel_id;
    const text = event.message?.text;

    if (!userId || !channelId || !text) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const [interview] = await db
      .select()
      .from(interviews)
      .where(
        and(
          eq(interviews.id, channelId),
          eq(interviews.status, InterviewStatus.COMPLETED)
        )
      );

    if (!interview) {
      return NextResponse.json(
        { error: "Interview not found" },
        { status: 404 }
      );
    }

    const [coach] = await db
      .select()
      .from(coaches)
      .where(eq(coaches.id, interview.coachId));

    if (!coach) {
      return NextResponse.json({ error: "Coach not found" }, { status: 404 });
    }

    if (userId !== coach.id) {
      const instructions = `
              You are an AI assistant helping the user revisit a recently completed meeting.
              Below is a summary of the meeting, generated from the transcript:
              
              ${interview.summary}
              
              The following are your original instructions from the live meeting assistant. Please continue to follow these behavioral guidelines as you assist the user:
              
              ${coach.instructions}
              
              The user may ask questions about the meeting, request clarifications, or ask for follow-up actions.
              Always base your responses on the meeting summary above.
              
              You also have access to the recent conversation history between you and the user. Use the context of previous messages to provide relevant, coherent, and helpful responses. If the user's question refers to something discussed earlier, make sure to take that into account and maintain continuity in the conversation.
              
              If the summary does not contain enough information to answer a question, politely let the user know.
              
              Be concise, helpful, and focus on providing accurate information from the meeting and the ongoing conversation.
            `;

      const channel = streamChat.channel("messaging", channelId);
      await channel.watch();

      const previousMessages = channel.state.messages
        .slice(-5)
        .filter((message) => message.text && message.text.trim() !== "")
        .map<ChatCompletionMessageParam>((message) => ({
          role: message.user?.id === coach.id ? "assistant" : "user",
          content: message.text || "",
        }));

      const apiKey = process.env.OPENAI_API_KEY;

      if (!apiKey) {
        return NextResponse.json(
          { error: "OpenAI API key not configured" },
          { status: 500 }
        );
      }

      const openai = new OpenAI({ apiKey });

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: instructions },
          ...previousMessages,
          { role: "user", content: text },
        ],
      });

      const responseText = response.choices[0].message.content;

      if (!responseText) {
        return NextResponse.json(
          { error: "Failed to generate response" },
          { status: 500 }
        );
      }

      const avatarUrl = generateAvatarUri({
        seed: coach.id,
        variant: "botttsNeutral",
      });

      streamChat.upsertUser({
        id: coach.id,
        name: coach.name,
        image: avatarUrl,
      });

      channel.sendMessage({
        text: responseText,
        user: {
          id: coach.id,
          name: coach.name,
          image: avatarUrl,
        },
      });
    }
  }
  return NextResponse.json({ message: "Webhook received" }, { status: 200 });
}
