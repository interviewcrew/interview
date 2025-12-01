// import from the libraries
import { db } from "@/db";
import { coaches, interviews, user } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from "@/constants";
import {
  createInterviewSchema,
  updateInterviewSchema,
} from "@/modules/interviews/schemas";
import { streamVideo } from "@/lib/stream-video";
import { generateAvatarUri } from "@/lib/avatar";
import {
  InterviewStatus,
  StreamTranscriptItem,
} from "@/modules/interviews/types";

// import from the packages
import z from "zod";
import {
  count,
  desc,
  eq,
  getTableColumns,
  ilike,
  and,
  sql,
  inArray,
} from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import JSONL from "jsonl-parse-stringify";
import { streamChat } from "@/lib/stream-chat";

export const interviewsRouter = createTRPCRouter({
  generateToken: protectedProcedure.mutation(async ({ ctx }) => {
    await streamVideo.upsertUsers([
      {
        id: ctx.auth.user.id,
        name: ctx.auth.user.name,
        role: "user",
        image:
          ctx.auth.user.image ??
          generateAvatarUri({ seed: ctx.auth.user.id, variant: "initials" }),
      },
    ]);

    const validityInSeconds = 3600;
    const issuedAt = Math.floor(Date.now() / 1000);
    const expirationTime = issuedAt + validityInSeconds;

    const token = streamVideo.generateUserToken({
      user_id: ctx.auth.user.id,
      exp: expirationTime,
      validity_in_seconds: validityInSeconds,
    });

    return token;
  }),
  generateChatToken: protectedProcedure.mutation(async ({ ctx }) => {
    const token = streamChat.createToken(ctx.auth.user.id);
    await streamChat.upsertUser({
      id: ctx.auth.user.id,
      role: "admin",
    });

    return token;
  }),
  getMany: protectedProcedure
    .input(
      z.object({
        page: z.number().default(DEFAULT_PAGE),
        pageSize: z
          .number()
          .min(1)
          .max(MAX_PAGE_SIZE)
          .default(DEFAULT_PAGE_SIZE),
        search: z.string().nullish(),
        coachId: z.string().nullish(),
        status: z.enum(Object.values(InterviewStatus)).nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, pageSize, search, coachId, status } = input;
      const userId = ctx.auth.user.id;

      const data = await db
        .select({
          ...getTableColumns(interviews),
          coach: coaches,
          duration: sql<
            number | null
          >`extract(epoch from interviews.ended_at - interviews.started_at)`.as(
            "duration"
          ),
        })
        .from(interviews)
        .innerJoin(coaches, eq(interviews.coachId, coaches.id))
        .where(
          and(
            eq(interviews.userId, userId),
            search ? ilike(interviews.title, `%${search}%`) : undefined,
            coachId ? eq(interviews.coachId, coachId) : undefined,
            status ? eq(interviews.status, status) : undefined
          )
        )
        .orderBy(desc(interviews.createdAt), desc(interviews.id))
        .offset(
          (page ? page - 1 : DEFAULT_PAGE - 1) *
            (pageSize ? pageSize : DEFAULT_PAGE_SIZE)
        )
        .limit(pageSize ? pageSize : DEFAULT_PAGE_SIZE);

      const [total] = await db
        .select({ count: count() })
        .from(interviews)
        .innerJoin(coaches, eq(interviews.coachId, coaches.id))
        .where(
          and(
            eq(interviews.userId, userId),
            search ? ilike(interviews.title, `%${search}%`) : undefined,
            coachId ? eq(interviews.coachId, coachId) : undefined,
            status ? eq(interviews.status, status) : undefined
          )
        );

      const totalPages = Math.ceil(
        total.count / (pageSize ?? DEFAULT_PAGE_SIZE)
      );

      return {
        items: data,
        totalPages,
        totalItems: total.count,
      };
    }),
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const userId = ctx.auth.user.id;

      const [interview] = await db
        .select({
          ...getTableColumns(interviews),
          coach: coaches,
          duration: sql<
            number | null
          >`extract(epoch from interviews.ended_at - interviews.started_at)`.as(
            "duration"
          ),
        })
        .from(interviews)
        .innerJoin(coaches, eq(interviews.coachId, coaches.id))
        .where(and(eq(interviews.id, input.id), eq(interviews.userId, userId)))
        .limit(1);

      if (!interview) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Interview not found",
        });
      }

      return interview;
    }),
  create: protectedProcedure
    .input(createInterviewSchema)
    .mutation(async ({ input, ctx }) => {
      const [createdInterview] = await db
        .insert(interviews)
        .values({
          ...input,
          userId: ctx.auth.user.id,
        })
        .returning();

      // TODO: Create Stream Call, Upsert Stream Users
      const call = streamVideo.video.call("default", createdInterview.id);
      await call.create({
        data: {
          created_by_id: ctx.auth.user.id,
          custom: {
            interview_id: createdInterview.id,
            interview_title: createdInterview.title,
          },
          settings_override: {
            transcription: {
              language: "en",
              mode: "auto-on",
              closed_caption_mode: "auto-on",
            },
            recording: {
              mode: "auto-on",
              quality: "1080p",
            },
          },
        },
      });

      const [existingCoach] = await db
        .select()
        .from(coaches)
        .where(eq(coaches.id, input.coachId))
        .limit(1);

      if (!existingCoach) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Coach not found",
        });
      }

      await streamVideo.upsertUsers([
        {
          id: existingCoach.id,
          name: existingCoach.name,
          role: "user",
          image: generateAvatarUri({
            seed: existingCoach.name,
            variant: "botttsNeutral",
          }),
        },
      ]);

      return createdInterview;
    }),
  update: protectedProcedure
    .input(updateInterviewSchema)
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.auth.user.id;

      const [interview] = await db
        .update(interviews)
        .set(input)
        .where(and(eq(interviews.id, input.id), eq(interviews.userId, userId)))
        .returning();

      if (!interview) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Interview not found",
        });
      }

      return interview;
    }),
  remove: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.auth.user.id;

      const [interview] = await db
        .delete(interviews)
        .where(and(eq(interviews.id, input.id), eq(interviews.userId, userId)))
        .returning();

      if (!interview) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Interview not found",
        });
      }

      return interview;
    }),
  getTranscript: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const [interview] = await db
        .select()
        .from(interviews)
        .where(
          and(
            eq(interviews.id, input.id),
            eq(interviews.userId, ctx.auth.user.id)
          )
        )
        .limit(1);

      if (!interview) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Interview not found",
        });
      }

      if (interview.transcript) {
        return interview.transcript as (StreamTranscriptItem & {
          user: {
            name: string;
            image: string | null;
          };
        })[];
      }

      if (!interview.transcriptUrl) {
        return [];
      }

      const transcript = await fetch(interview.transcriptUrl)
        .then((result) => result.text())
        .then((text) => JSONL.parse<StreamTranscriptItem>(text))
        .catch(() => []);

      const speakerIds = [
        ...new Set(transcript.map((item) => item.speaker_id)),
      ];

      const userSpeakers = await db
        .select()
        .from(user)
        .where(inArray(user.id, speakerIds))
        .then((users) =>
          users.map((user) => ({
            ...user,
            image:
              user.image ??
              generateAvatarUri({ seed: user.id, variant: "initials" }),
          }))
        );

      const coachSpeakers = await db
        .select()
        .from(coaches)
        .where(inArray(coaches.id, speakerIds))
        .then((coaches) =>
          coaches.map((coach) => ({
            ...coach,
            image: generateAvatarUri({
              seed: coach.id,
              variant: "botttsNeutral",
            }),
          }))
        );

      const allSpeakers = [...userSpeakers, ...coachSpeakers];

      const transcriptWithSpeakers = transcript.map((item) => {
        const speaker = allSpeakers.find(
          (speaker) => speaker.id === item.speaker_id
        );

        if (!speaker) {
          return {
            ...item,
            user: {
              name: "Unknown",
              image: generateAvatarUri({
                seed: "unknown",
                variant: "initials",
              }),
            },
          };
        }

        return {
          ...item,
          user: {
            name: speaker.name,
            image: speaker.image,
          },
        };
      });

      await db
        .update(interviews)
        .set({ transcript: transcriptWithSpeakers })
        .where(eq(interviews.id, input.id));

      return transcriptWithSpeakers;
    }),
});
