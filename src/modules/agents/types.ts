// import from the packages
import { inferRouterOutputs } from "@trpc/server";

// import from the libraries
import type { AppRouter } from "@/trpc/routers/_app";

export type AgentGetById = inferRouterOutputs<AppRouter>["agents"]["getById"];
