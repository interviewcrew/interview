// import from the libraries
import { createTRPCRouter, adminProcedure } from "@/trpc/init";
import { db } from "@/db";
import { user, interviews, coaches } from "@/db/schema";

// import from the packages
import { z } from "zod";
import { count, desc, eq, sql } from "drizzle-orm";

export const adminRouter = createTRPCRouter({
  getStats: adminProcedure.query(async () => {
    const [userCount] = await db.select({ count: count() }).from(user);
    const [interviewCount] = await db.select({ count: count() }).from(interviews);
    const [coachCount] = await db.select({ count: count() }).from(coaches);

    return {
      users: userCount.count,
      interviews: interviewCount.count,
      coaches: coachCount.count,
    };
  }),

  getGrowthStats: adminProcedure
    .input(
      z.object({
        interval: z.enum(["day", "week", "month"]).default("week"),
      })
    )
    .query(async ({ input }) => {
      const { interval } = input;

      // Helper to get chart data
      const getChartData = async (table: typeof user | typeof interviews | typeof coaches) => {
        const data = await db
          .select({
            date: sql`date_trunc(${interval}, ${table.createdAt})`.mapWith(
              (value: string) => value
            ),
            count: count(),
          })
          .from(table)
          .groupBy(sql`date_trunc(${interval}, ${table.createdAt})`)
          .orderBy(sql`date_trunc(${interval}, ${table.createdAt})`);

        return data.map((item) => ({
          date: item.date as string,
          count: item.count,
        }));
      };

      const [usersChart, interviewsChart, coachesChart] = await Promise.all([
        getChartData(user),
        getChartData(interviews),
        getChartData(coaches),
      ]);

      return {
        users: usersChart,
        interviews: interviewsChart,
        coaches: coachesChart,
      };
    }),

  getUsers: adminProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(10),
      })
    )
    .query(async ({ input }) => {
      const { page, limit } = input;
      const offset = (page - 1) * limit;

      const [total] = await db.select({ count: count() }).from(user);

      const users = await db
        .select()
        .from(user)
        .orderBy(desc(user.createdAt))
        .limit(limit)
        .offset(offset);

      return {
        items: users,
        total: total.count,
        totalPages: Math.ceil(total.count / limit),
      };
    }),

  getInterviews: adminProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(10),
      })
    )
    .query(async ({ input }) => {
      const { page, limit } = input;
      const offset = (page - 1) * limit;

      const [total] = await db.select({ count: count() }).from(interviews);

      const items = await db
        .select({
          id: interviews.id,
          title: interviews.title,
          status: interviews.status,
          createdAt: interviews.createdAt,
          startedAt: interviews.startedAt,
          recordingUrl: interviews.recordingUrl,
          summary: interviews.summary,
          endedAt: interviews.endedAt,
          userName: user.name,
          coachName: coaches.name,
        })
        .from(interviews)
        .leftJoin(user, eq(interviews.userId, user.id))
        .leftJoin(coaches, eq(interviews.coachId, coaches.id))
        .orderBy(desc(interviews.createdAt))
        .limit(limit)
        .offset(offset);

      return {
        items,
        total: total.count,
        totalPages: Math.ceil(total.count / limit),
      };
    }),
});
