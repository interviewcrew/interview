// import from the libraries
import { db } from "@/db";
import { coaches, interviews } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from "@/constants";
import {
  createInterviewSchema,
  updateInterviewSchema,
} from "@/modules/interviews/schemas";
import { streamVideo } from "@/lib/stream-video";
import { generateAvatarUri } from "@/lib/avatar";

// import from the packages
import z from "zod";
import { count, desc, eq, getTableColumns, ilike, and, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { InterviewStatus } from "@/modules/interviews/types";

export const interviewsRouter = createTRPCRouter({
  generateToken: protectedProcedure.mutation(async ({ ctx }) => {
    await streamVideo.upsertUsers([
      {
        id: ctx.auth.user.id,
        name: ctx.auth.user.name,
        role: "admin",
        image:
          ctx.auth.user.image ??
          generateAvatarUri({ seed: ctx.auth.user.id, variant: "initials" }),
      },
    ]);

    const expirationTime = Math.floor(Date.now() / 1000) + 3600; // 1 hour
    const issuedAt = Math.floor(Date.now() / 1000);

    const token = streamVideo.generateUserToken({
      user_id: ctx.auth.user.id,
      exp: expirationTime,
      validity_in_seconds: issuedAt,
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
});
