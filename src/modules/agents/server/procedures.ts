// import from the libraries
import { db } from "@/db";
import { agents } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { createAgentSchema } from "@/modules/agents/schemas";

// import from the packages
import z from "zod";
import { eq, getTableColumns, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const agentsRouter = createTRPCRouter({
  getMany: protectedProcedure.query(async () => {
    return await db.select().from(agents);
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
