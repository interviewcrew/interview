"server-only";

// import from the packages
import { StreamClient } from "@stream-io/node-sdk";

export const streamVideo = new StreamClient(
  process.env.NEXT_PUBLIC_STREAM_VIDEO_API_KEY as string,
  process.env.STREAM_VIDEO_SECRET_KEY as string
);
