import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import { interviewsProcessing } from "@/inngest/functions";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [interviewsProcessing],
});
