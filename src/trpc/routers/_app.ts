// Imports from libraries
import { createTRPCRouter } from '@/trpc/init';
import { coachesRouter } from '@/modules/coaches/server/procedures';

export const appRouter = createTRPCRouter({
  coaches: coachesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;