// import from the packages
import { inferRouterOutputs } from "@trpc/server";

// import from the libraries
import type { AppRouter } from "@/trpc/routers/_app";

export type CoachGetMany = inferRouterOutputs<AppRouter>["coaches"]["getMany"]["items"];
export type CoachGetById = inferRouterOutputs<AppRouter>["coaches"]["getById"];
