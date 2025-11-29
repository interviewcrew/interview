// import from the packages
import { z } from "zod";

export const createCoachSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    systemPrompt: z.string().min(1, { message: "System prompt is required" }),
});

export const updateCoachSchema = createCoachSchema.extend({
    id: z.string().min(1, { message: "ID is required" }),
});
