import "server-only";

import { StreamChat } from "stream-chat";

export const streamChat = StreamChat.getInstance(
  process.env.STREAM_API_KEY!,
  process.env.STREAM_API_SECRET!
);
