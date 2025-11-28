// import from the packages
import { z } from "zod";

export const createInterviewSchema = z.object({
    title: z.string().min(1, { message: "Title is required" }),
    coachId: z.string().min(1, { message: "Coach ID is required" }),
});

export const updateInterviewSchema = createInterviewSchema.extend({
    id: z.string().min(1, { message: "ID is required" }),
});
