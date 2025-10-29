// import from the libraries
import { db } from "@/db";
import { agents } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { createAgentSchema } from "@/modules/agents/schemas";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from "@/constants";

// import from the packages
import z from "zod";
import { count, desc, eq, getTableColumns, ilike, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const agentsRouter = createTRPCRouter({
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
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, pageSize, search } = input ?? {};

      const data = await db
        .select({
          ...getTableColumns(agents),
          meetingCount: sql<number>`5`.as("meeting_count"),
        })
        .from(agents)
        .where(search ? ilike(agents.name, `%${search}%`) : undefined)
        .orderBy(desc(agents.createdAt), desc(agents.id))
        .offset(
          (page ? page - 1 : DEFAULT_PAGE - 1) *
            (pageSize ? pageSize : DEFAULT_PAGE_SIZE)
        )
        .limit(pageSize ? pageSize : DEFAULT_PAGE_SIZE);

      const [total] = await db
        .select({ count: count() })
        .from(agents)
        .where(search ? ilike(agents.name, `%${search}%`) : undefined);

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
    .query(async ({ input }) => {
      const [agent] = await db
        .select({
          ...getTableColumns(agents),
          meetingCount: sql<number>`5`.as("meeting_count"),
        })
        .from(agents)
        .where(eq(agents.id, input.id))
        .limit(1);

      if (!agent) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Agent not found" });
      }

      return agent;
    }),
  create: protectedProcedure
    .input(createAgentSchema)
    .mutation(async ({ input }) => {
      const { name, instructions } = input;

      const [createdAgent] = await db
        .insert(agents)
        .values({
          name,
          instructions,
        })
        .returning();

      return createdAgent;
    }),
});
