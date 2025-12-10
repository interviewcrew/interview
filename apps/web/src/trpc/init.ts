// Imports from framework
import { cache } from 'react';
import { headers } from 'next/headers';

// Imports from libraries
import { initTRPC, TRPCError } from '@trpc/server';
import { auth } from '@/lib/auth';

export const createTRPCContext = cache(async () => {
    /**
     * @see https://trpc.io/docs/server/context
     */
    return { userId: "user_123"}
})

// Avoid exporting the entire t-object
// since it's not very descriptive
// For instance, the user of a t variable
// is common in i18n libraries.
const t = initTRPC.create({
    /**
     * @see https://trpc.io/docs/server/data-transformer
     */
    // transformer: superjson,
});

// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
export const protectedProcedure = baseProcedure.use(async ({ ctx, next }) => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (!session) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Unauthorized" });
    }

    return next({ ctx: { ...ctx, auth: session } });
});

export const adminProcedure = protectedProcedure.use(async ({ ctx, next }) => {
    const { user } = ctx.auth;

    if (!user.email.endsWith("@interviewcrew.io") || !user.emailVerified) {
        throw new TRPCError({ code: "FORBIDDEN", message: "You are not authorized to view this page" });
    }

    return next({ ctx });
});
