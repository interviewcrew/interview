// import from the packages
import { serve } from "inngest/next";

// import from the libraries
import { inngest } from "@/inngest/client";
import { interviewsProcessing, handleChatReply } from "@/inngest/functions";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [interviewsProcessing, handleChatReply],
});
