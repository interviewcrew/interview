// import from the packages
import { inngest } from "@/inngest/client";
import { createAgent, openai, TextMessage } from "@inngest/agent-kit";
import { eq, inArray } from "drizzle-orm";
import JSONL from "jsonl-parse-stringify";

// import from the libraries
import { db } from "@/db";
import { coaches, interviews, user } from "@/db/schema";
import { InterviewStatus, StreamTranscriptItem } from "@/modules/interviews/types";

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
