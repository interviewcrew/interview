// Imports from packages
import { z } from 'zod';

// Imports from libraries
import { baseProcedure, createTRPCRouter } from '@/trpc/init';

export const appRouter = createTRPCRouter({
  hello: baseProcedure
    .input(
      z.object({
        text: z.string(),
      }),
    )
    .query((opts) => {
      return {
        greeting: `Hello ${opts.input.text}`,
      };
    }),
});

// export type definition of API
export type AppRouter = typeof appRouter;