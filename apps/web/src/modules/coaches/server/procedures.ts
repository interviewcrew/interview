// import from the libraries
import { db } from "@/db";
import { coaches, interviews } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import {
  createCoachSchema,
  updateCoachSchema,
} from "@/modules/coaches/schemas";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from "@/constants";

// import from the packages
import z from "zod";
import {
  count,
  desc,
  eq,
  getTableColumns,
  ilike,
  and,
  isNull,
  or,
} from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const coachesRouter = createTRPCRouter({
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
        scope: z.enum(["all", "user", "official"]).default("all").nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, pageSize, search, scope } = input;
      const userId = ctx.auth.user.id;
      const safeScope = scope || "all";

      const whereCondition = and(
        search ? ilike(coaches.name, `%${search}%`) : undefined,
        safeScope === "all"
          ? or(eq(coaches.userId, userId), isNull(coaches.userId))
          : safeScope === "user"
          ? eq(coaches.userId, userId)
          : isNull(coaches.userId)
      );

      const data = await db
        .select({
          ...getTableColumns(coaches),
          interviewCount: db.$count(interviews, eq(interviews.coachId, coaches.id)),
          isOfficial: isNull(coaches.userId),
        })
        .from(coaches)
        .where(whereCondition)
        .orderBy(desc(coaches.createdAt), desc(coaches.id))
        .offset(
          (page ? page - 1 : DEFAULT_PAGE - 1) *
            (pageSize ? pageSize : DEFAULT_PAGE_SIZE)
        )
        .limit(pageSize ? pageSize : DEFAULT_PAGE_SIZE);

      const [total] = await db
        .select({ count: count() })
        .from(coaches)
        .where(whereCondition);

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

      const [coach] = await db
        .select({
          ...getTableColumns(coaches),
          interviewCount: db.$count(interviews, eq(interviews.coachId, coaches.id)),
          isOfficial: isNull(coaches.userId),
        })
        .from(coaches)
        .where(
          and(
            eq(coaches.id, input.id),
            or(eq(coaches.userId, userId), isNull(coaches.userId))
          )
        )
        .limit(1);

      if (!coach) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Coach not found" });
      }

      return coach;
    }),
  create: protectedProcedure
    .input(createCoachSchema)
    .mutation(async ({ input, ctx }) => {
      const [createdCoach] = await db
        .insert(coaches)
        .values({
          ...input,
          userId: ctx.auth.user.id,
        })
        .returning();

      return createdCoach;
    }),
  remove: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.auth.user.id;

      const [coach] = await db
        .select(getTableColumns(coaches))
        .from(coaches)
        .where(eq(coaches.id, input.id))
        .limit(1);

      if (!coach) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Coach not found" });
      }

      if (coach.userId === null) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You cannot remove an official coach",
        });
      }

      const [deletedCoach] = await db
        .delete(coaches)
        .where(and(eq(coaches.id, input.id), eq(coaches.userId, userId)))
        .returning();

      return deletedCoach;
    }),
  update: protectedProcedure
    .input(updateCoachSchema)
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.auth.user.id;

      const [coach] = await db
        .select(getTableColumns(coaches))
        .from(coaches)
        .where(eq(coaches.id, input.id))
        .limit(1);

      if (!coach) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Coach not found" });
      }

      if (coach.userId === null) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You cannot update an official coach",
        });
      }

      const [updatedCoach] = await db
        .update(coaches)
        .set(input)
        .where(and(eq(coaches.id, input.id), eq(coaches.userId, userId)))
        .returning();

      return updatedCoach;
    }),
});
