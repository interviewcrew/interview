import { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/trpc/routers/_app";

export type PostStatus = "draft" | "published";

export type PostGetMany = inferRouterOutputs<AppRouter>["posts"]["getMany"]["items"];
export type PostGetById = inferRouterOutputs<AppRouter>["posts"]["getById"];
export type PostGetBySlug = inferRouterOutputs<AppRouter>["posts"]["getBySlug"];

