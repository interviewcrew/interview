import { StreamClient, StreamCall } from "@stream-io/node-sdk";

export class StreamService {
  private static instance: StreamClient;

  public static get client(): StreamClient {
    if (!this.instance) {
      const apiKey = process.env.STREAM_API_KEY;
      const apiSecret = process.env.STREAM_API_SECRET;

      if (!apiKey || !apiSecret) {
        throw new Error("STREAM_API_KEY or STREAM_API_SECRET not set in environment");
      }

      this.instance = new StreamClient(apiKey, apiSecret);
    }
    return this.instance;
  }

  public static getCall(callId: string) {
    return this.client.video.call("default", callId);
  }

  public static connectOpenAi(
    call: StreamCall,
    openAiApiKey: string,
    agentUserId: string
  ) {
    return this.client.video.connectOpenAi({
      call,
      openAiApiKey,
      agentUserId,
      model: "gpt-4o-realtime-preview",
    });
  }
}

