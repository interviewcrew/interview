// import from the packages
import { inngest } from "@/inngest/client";
import { createAgent, openai, TextMessage } from "@inngest/agent-kit";
import { and, eq, inArray } from "drizzle-orm";
import JSONL from "jsonl-parse-stringify";
import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";

// import from the libraries
import { db } from "@/db";
import { coaches, interviews, user } from "@/db/schema";
import { InterviewStatus, StreamTranscriptItem } from "@/modules/interviews/types";
import { streamChat } from "@/lib/stream-chat";
import { generateAvatarUri } from "@/lib/avatar";

export const summarizer = createAgent({
  name: "summarizer",
  system: `
        You are an expert Technical Interview Coach. Your goal is to assess the candidate's performance in a mock interview.
        
        You will be provided with a transcript of the interview.

        Use the following markdown structure for your assessment:

        ### Executive Summary
        Provide a high-level overview of the candidate's performance. Include a rating (Strong Hire, Hire, Weak Hire, No Hire) and a brief justification.
        If the candidate was trying to sabotage the interview, say No Hire and explain that this is a mock interview and they didn't follow the instructions and take it seriously.

        ### Strengths
        - List key strengths demonstrated by the candidate.

        ### Areas for Improvement
        - List specific areas where the candidate can improve.

        ### Detailed Feedback
        Provide detailed feedback on specific responses or sections of the interview. Cite specific examples from the transcript.`.trim(),
  model: openai({ model: "gpt-5.1", apiKey: process.env.OPENAI_API_KEY }),
});

export const interviewsProcessing = inngest.createFunction(
  { id: "interviews/processing" },
  { event: "interviews/processing" },
  async ({ event, step }) => {
    const response = await step.run("fetch-transcript", async () => {
      return fetch(event.data.transcriptUrl).then((result) => result.text());
    });

    const transcript = await step.run("parse-transcript", async () => {
      return JSONL.parse<StreamTranscriptItem>(response);
    });

    const transcriptWithSpeakers = await step.run("add-speakers", async () => {
      const speakerIds = [
        ...new Set(transcript.map((item) => item.speaker_id)),
      ];

      const userSpeakers = await db
        .select()
        .from(user)
        .where(inArray(user.id, speakerIds))
        .then((users) => users.map((user) => ({ ...user })));

      const coachSpeakers = await db
        .select()
        .from(coaches)
        .where(inArray(coaches.id, speakerIds))
        .then((coaches) => coaches.map((coach) => ({ ...coach })));

      const allSpeakers = [...userSpeakers, ...coachSpeakers];
      return transcript.map((item) => {
        const speaker = allSpeakers.find(
          (speaker) => speaker.id === item.speaker_id
        );

        if (!speaker) {
          return {
            ...item,
            user: {
              name: "Unknown",
            },
          };
        }

        return {
          ...item,
          user: {
            name: speaker.name,
          },
        };
      });
    });

    const { output } = await summarizer.run(
      "Summarize the following transcript: " +
        JSON.stringify(transcriptWithSpeakers)
    );

    await step.run("save-summary", async () => {
      await db
        .update(interviews)
        .set({
          summary: (output[0] as TextMessage).content as string,
          status: InterviewStatus.COMPLETED,
        })
        .where(eq(interviews.id, event.data.interviewId));
    });
  }
);

export const handleChatReply = inngest.createFunction(
  { id: "chat/reply", throttle: { limit: 1, period: "5s", key: "event.data.channelId" } },
  { event: "chat/message.created" },
  async ({ event, step }) => {
    const { userId, channelId, text } = event.data;

    const interview = await step.run("fetch-interview", async () => {
      const [interview] = await db
        .select()
        .from(interviews)
        .where(
          and(
            eq(interviews.id, channelId),
            eq(interviews.status, InterviewStatus.COMPLETED)
          )
        );
      return interview;
    });

    if (!interview) {
      return { error: "Interview not found" };
    }

    const coach = await step.run("fetch-coach", async () => {
      const [coach] = await db
        .select()
        .from(coaches)
        .where(eq(coaches.id, interview.coachId));
      return coach;
    });

    if (!coach) {
      return { error: "Coach not found" };
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

      const responseText = await step.run("generate-response", async () => {
        const channel = streamChat.channel("messaging", channelId);
        
        const { messages } = await channel.query({
            messages: { limit: 5, id_lt: event.data.messageId } 
        });
        
        const previousMessages = messages
          .filter((message) => message.text && message.text.trim() !== "")
          .map<ChatCompletionMessageParam>((message) => ({
            role: message.user?.id === coach.id ? "assistant" : "user",
            content: message.text || "",
          }));

        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) throw new Error("OpenAI API key not configured");

        const openai = new OpenAI({ apiKey });

        const response = await openai.chat.completions.create({
          model: "gpt-5.1",
          messages: [
            { role: "system", content: systemPrompt },
            ...previousMessages,
            { role: "user", content: text },
          ],
        });

        return response.choices[0].message.content;
      });

      if (!responseText) {
        return { error: "Failed to generate response" };
      }

      await step.run("send-response", async () => {
        const avatarUrl = generateAvatarUri({
          seed: coach.id,
          variant: "botttsNeutral",
        });

        await streamChat.upsertUser({
          id: coach.id,
          name: coach.name,
          image: avatarUrl,
        });

        const channel = streamChat.channel("messaging", channelId);
        await channel.sendMessage({
          text: responseText,
          user: {
            id: coach.id,
            name: coach.name,
            image: avatarUrl,
          },
        });
      });
    }
  }
);
