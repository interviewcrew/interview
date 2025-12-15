// Imports from libraries
import { createTRPCRouter } from '@/trpc/init';
import { coachesRouter } from '@/modules/coaches/server/procedures';
import { interviewsRouter } from '@/modules/interviews/server/procedures';
import { adminRouter } from '@/modules/admin/server/procedures';
import { postsRouter } from '@/modules/blog/server/procedures';

export const appRouter = createTRPCRouter({
  coaches: coachesRouter,
  interviews: interviewsRouter,
  admin: adminRouter,
  posts: postsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;