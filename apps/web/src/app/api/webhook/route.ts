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
import { DEFAULT_INTERVIEW_INSTRUCTIONS, InterviewInstructionsSchema } from "@interview/shared";

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
    console.log("Webhook: processing call.session_started", payload);
    const event = payload as CallSessionStartedEvent;
    const interviewId = event.call.custom?.interview_id;

    if (!interviewId) {
      console.error("Webhook: Interview ID not found in custom data");
      return NextResponse.json(
        { error: "Interview ID not found" },
        { status: 400 }
      );
    }

    console.log("Webhook: Fetching interview", interviewId);
    const [interview] = await db
      .select()
      .from(interviews)
      .where(eq(interviews.id, interviewId));

    if (!interview) {
      console.error("Webhook: Interview not found", interviewId);
      return NextResponse.json(
        { error: "Interview not found" },
        { status: 404 }
      );
    }

    console.log("Webhook: Interview found", interview.id, interview.status);
    if (interview.status !== InterviewStatus.UPCOMING) {
        console.error("Webhook: Interview already started or completed", interview.id, interview.status);
        return NextResponse.json(
            { message: "Interview already started" },
            { status: 200 }
        );
    }

    console.log("Webhook: Updating interview status to IN_PROGRESS", interview.id);
    // Update status to IN_PROGRESS immediately to prevent race conditions
    const [updatedInterview] = await db
      .update(interviews)
      .set({
        status: InterviewStatus.IN_PROGRESS,
        startedAt: new Date(),
      })
      .where(
        and(
          eq(interviews.id, interviewId),
          eq(interviews.status, InterviewStatus.UPCOMING)
        )
      )
      .returning();

    if (!updatedInterview) {
      console.error("Webhook: Failed to update interview status (race condition)", interview.id);
      return NextResponse.json(
        { message: "Interview already started" },
        { status: 200 }
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

    try {
      // Check if agent is already connected (idempotency)
      const call = streamVideo.video.call("default", interviewId);
      const { members } = await call.queryMembers();
      const hasAgent = members.some(
        (member) => member.user_id === coach.id
      );

      if (hasAgent) {
        console.error("Agent already in call for interview:", interviewId);
        return NextResponse.json(
          { message: "Agent already connected" },
          { status: 200 }
        );
      }

      // Prepare data for Agent Service
      const interviewInstructionsData = coach.interviewInstructions;
      const parsedInterviewInstructions = InterviewInstructionsSchema.safeParse(interviewInstructionsData);
      const interviewInstructions = parsedInterviewInstructions.success
        ? parsedInterviewInstructions.data
        : DEFAULT_INTERVIEW_INSTRUCTIONS;

      const agentPayload = {
        interviewId,
        coachId: coach.id,
        systemPrompt: coach.systemPrompt,
        interviewInstructions,
        openaiApiKey: process.env.OPENAI_API_KEY,
        voice: coach.voice,
      };

      const agentServiceUrl = process.env.AGENT_SERVICE_URL || "http://agent:8000";
      console.log(`Webhook: Delegating to Agent Service at ${agentServiceUrl}`);

      const response = await fetch(`${agentServiceUrl}/start-agent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-agent-secret": process.env.AGENT_SECRET || "secret",
        },
        body: JSON.stringify(agentPayload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Agent service responded with ${response.status}: ${errorText}`);
      }

      console.log("Webhook: Agent started successfully");

    } catch (error) {
      console.error("Error delegating to agent service:", error);

      // Revert status so we can try again
      await db
        .update(interviews)
        .set({
          status: InterviewStatus.UPCOMING,
          startedAt: null,
        })
        .where(eq(interviews.id, interviewId));

      return NextResponse.json(
        { error: "Failed to start agent" },
        { status: 500 }
      );
    }
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

    try {
      const agentServiceUrl =
        process.env.AGENT_SERVICE_URL || "http://agent:8000";
      console.log(
        `Webhook: Stopping agent at ${agentServiceUrl} for interview ${interviewId}`
      );

      await fetch(`${agentServiceUrl}/stop-agent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-agent-secret": process.env.AGENT_SECRET || "secret",
        },
        body: JSON.stringify({ interviewId }),
      });
    } catch (error) {
      console.error("Webhook: Failed to stop agent", error);
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
      const systemPrompt = `
              You are an AI assistant helping the user revisit a recently completed interview.
              
              Here is the context of the interview:
              - Summary: ${interview.summary}
              - Original System Prompt: ${coach.systemPrompt}
              - Interview Instructions: 
              \`\`\`JSON
              ${JSON.stringify(coach.interviewInstructions)}
              \`\`\`
              - Transcription:
              \`\`\`JSON
              ${JSON.stringify(interview.transcript)}
              \`\`\`

              Your goal is to help the candidate learn from their interview. 
              
              Guidelines:
              1. Use the summary to understand the key points and feedback already generated.
              2. Adhere to the persona defined in the Original System Prompt.
              3. Reference the Interview Instructions to understand the structure and goals of the interview phases.
              4. Provide constructive, specific feedback based on the transcript (which the user might reference).
              5. If the user asks about "good answers", offer guidance based on best practices for the specific question types (e.g., STAR method for behavioral questions, architectural patterns for system design).
              
              The user may ask questions about the meeting, request clarifications, or ask for follow-up actions.
              Always base your responses on the context provided above.
              
              You also have access to the recent conversation history between you and the user. Use the context of previous messages to provide relevant, coherent, and helpful responses. If the user's question refers to something discussed earlier, make sure to take that into account and maintain continuity in the conversation.
              
              If the provided context does not contain enough information to answer a question, politely let the user know.
              
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
        model: "gpt-5.1",
        messages: [
          { role: "system", content: systemPrompt },
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
