"server-only";

// import from the packages
import { StreamClient } from "@stream-io/node-sdk";

export const streamVideo = new StreamClient(
  process.env.STREAM_API_KEY as string,
  process.env.STREAM_API_SECRET as string
);
