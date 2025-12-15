import { db } from "@/db";
import { posts } from "@/db/schema";
import { createTRPCRouter, protectedProcedure, baseProcedure } from "@/trpc/init";
import { createPostSchema, updatePostSchema } from "@/modules/blog/schemas";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from "@/constants";
import z from "zod";
import { count, desc, eq, ilike, and, isNotNull, or } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const postsRouter = createTRPCRouter({
  getMany: protectedProcedure
    .input(
      z.object({
        page: z.number().default(DEFAULT_PAGE),
        pageSize: z.number().min(1).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
        search: z.string().nullish(),
        status: z.enum(["all", "draft", "published"]).default("all").nullish(),
      })
    )
    .query(async ({ input }) => {
      const { page, pageSize, search, status } = input;

      const whereCondition = and(
        search
          ? or(ilike(posts.title, `%${search}%`), ilike(posts.slug, `%${search}%`))
          : undefined,
        status && status !== "all" ? eq(posts.status, status) : undefined
      );

      const data = await db
        .select()
        .from(posts)
        .where(whereCondition)
        .orderBy(desc(posts.createdAt), desc(posts.id))
        .offset((page - 1) * pageSize)
        .limit(pageSize);

      const [total] = await db.select({ count: count() }).from(posts).where(whereCondition);

      return {
        items: data,
        totalPages: Math.ceil(total.count / pageSize),
        totalItems: total.count,
      };
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const [post] = await db.select().from(posts).where(eq(posts.id, input.id)).limit(1);

      if (!post) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Post not found" });
      }

      return post;
    }),

  getBySlug: baseProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const [post] = await db
        .select()
        .from(posts)
        .where(and(eq(posts.slug, input.slug), eq(posts.status, "published")))
        .limit(1);

      if (!post) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Post not found" });
      }

      return post;
    }),

  getPublished: baseProcedure
    .input(
      z.object({
        page: z.number().default(DEFAULT_PAGE),
        pageSize: z.number().min(1).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
      })
    )
    .query(async ({ input }) => {
      const { page, pageSize } = input;

      const whereCondition = and(
        eq(posts.status, "published"),
        isNotNull(posts.publishedAt)
      );

      const data = await db
        .select()
        .from(posts)
        .where(whereCondition)
        .orderBy(desc(posts.publishedAt), desc(posts.id))
        .offset((page - 1) * pageSize)
        .limit(pageSize);

      const [total] = await db.select({ count: count() }).from(posts).where(whereCondition);

      return {
        items: data,
        totalPages: Math.ceil(total.count / pageSize),
        totalItems: total.count,
      };
    }),

  getAllSlugs: baseProcedure.query(async () => {
    const data = await db
      .select({ slug: posts.slug })
      .from(posts)
      .where(eq(posts.status, "published"));

    return data.map((p) => p.slug);
  }),

  create: protectedProcedure.input(createPostSchema).mutation(async ({ input }) => {
    const existingPost = await db
      .select({ id: posts.id })
      .from(posts)
      .where(eq(posts.slug, input.slug))
      .limit(1);

    if (existingPost.length > 0) {
      throw new TRPCError({
        code: "CONFLICT",
        message: "A post with this slug already exists",
      });
    }

    const [createdPost] = await db
      .insert(posts)
      .values({
        ...input,
        publishedAt: input.status === "published" ? new Date() : null,
      })
      .returning();

    return createdPost;
  }),

  update: protectedProcedure.input(updatePostSchema).mutation(async ({ input }) => {
    const [existingPost] = await db
      .select()
      .from(posts)
      .where(eq(posts.id, input.id))
      .limit(1);

    if (!existingPost) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Post not found" });
    }

    if (input.slug && input.slug !== existingPost.slug) {
      const slugConflict = await db
        .select({ id: posts.id })
        .from(posts)
        .where(eq(posts.slug, input.slug))
        .limit(1);

      if (slugConflict.length > 0) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "A post with this slug already exists",
        });
      }
    }

    const publishedAt =
      input.status === "published" && existingPost.status !== "published"
        ? new Date()
        : existingPost.publishedAt;

    const [updatedPost] = await db
      .update(posts)
      .set({ ...input, publishedAt })
      .where(eq(posts.id, input.id))
      .returning();

    return updatedPost;
  }),

  remove: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const [deletedPost] = await db
        .delete(posts)
        .where(eq(posts.id, input.id))
        .returning();

      if (!deletedPost) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Post not found" });
      }

      return deletedPost;
    }),
});

