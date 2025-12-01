// import from the packages
import { z } from "zod";

// import from the shared schemas
import { InterviewInstructionsSchema } from "@interview/shared";

export const createCoachSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    systemPrompt: z.string().min(1, { message: "System prompt is required" }),
});

export const updateCoachSchema = z.object({
    id: z.string().min(1, { message: "ID is required" }),
    name: z.string().min(1, { message: "Name is required" }).optional(),
    systemPrompt: z.string().min(1, { message: "System prompt is required" }).optional(),
    interviewInstructions: InterviewInstructionsSchema.optional(),
});
