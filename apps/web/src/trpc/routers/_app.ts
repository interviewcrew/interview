// Imports from libraries
import { createTRPCRouter } from '@/trpc/init';
import { coachesRouter } from '@/modules/coaches/server/procedures';
import { interviewsRouter } from '@/modules/interviews/server/procedures';
import { adminRouter } from '@/modules/admin/server/procedures';

export const appRouter = createTRPCRouter({
  coaches: coachesRouter,
  interviews: interviewsRouter,
  admin: adminRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;