// import from the packages
import { inferRouterOutputs } from "@trpc/server";

// import from the libraries
import type { AppRouter } from "@/trpc/routers/_app";

export type InterviewGetMany = inferRouterOutputs<AppRouter>["interviews"]["getMany"]["items"];
export type InterviewGetById = inferRouterOutputs<AppRouter>["interviews"]["getById"];
export enum InterviewStatus {
    UPCOMING = "upcoming",
    IN_PROGRESS = "in-progress",
    COMPLETED = "completed",
    PROCESSING = "processing",
    CANCELLED = "cancelled",
}
