import { z } from "zod";

export const createPostSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  slug: z.string().min(1, { message: "Slug is required" }),
  excerpt: z.string().optional(),
  content: z.string().min(1, { message: "Content is required" }),
  coverImage: z.string().optional(),
  author: z.string().min(1, { message: "Author is required" }),
  category: z.string().optional(),
  tags: z.array(z.string()).default([]),
  status: z.enum(["draft", "published"]).default("draft"),
});

export const updatePostSchema = z.object({
  id: z.string().min(1, { message: "ID is required" }),
  title: z.string().min(1, { message: "Title is required" }).optional(),
  slug: z.string().min(1, { message: "Slug is required" }).optional(),
  excerpt: z.string().optional(),
  content: z.string().min(1, { message: "Content is required" }).optional(),
  coverImage: z.string().optional(),
  author: z.string().min(1, { message: "Author is required" }).optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  status: z.enum(["draft", "published"]).optional(),
});

