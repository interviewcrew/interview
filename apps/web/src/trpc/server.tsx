import { cache } from 'react';
import 'server-only';
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query';
import { createTRPCContext, createCallerFactory } from "@/trpc/init";
import { makeQueryClient } from "@/trpc/query-client";
import { appRouter } from "@/trpc/routers/_app";

export const getQueryClient = cache(makeQueryClient);

export const trpc = createTRPCOptionsProxy({
  ctx: createTRPCContext,
  router: appRouter,
  queryClient: getQueryClient,
});

const createCaller = createCallerFactory(appRouter);
export const caller = cache(() => createCaller({}));