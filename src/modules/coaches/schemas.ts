// import from the packages
import { z } from "zod";

export const createCoachSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    instructions: z.string().min(1, { message: "Instructions are required" }),
});
