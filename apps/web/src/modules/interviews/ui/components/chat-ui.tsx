// import from the framework
import { useState, useEffect } from "react";

// import from packages
import {
  useCreateChatClient,
  Chat,
  Channel,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";
import { useMutation } from "@tanstack/react-query";
import type { Channel as StreamChannel } from "stream-chat";

// import from the libraries
import { useTRPC } from "@/trpc/client";
import { LoadingState } from "@/components/loading-state";
import { InterviewGetById } from "@/modules/interviews/types";

import "stream-chat-react/dist/css/v2/index.css";

interface ChatUIProps {
  interview: InterviewGetById;
  userId: string;
  userName: string;
  userImage: string | undefined;
}

export const ChatUI = ({
  interview,
  userId,
  userName,
  userImage,
}: ChatUIProps) => {
  const trpc = useTRPC();
  const { mutateAsync: generateChatToken } = useMutation(
    trpc.interviews.generateChatToken.mutationOptions()
  );

  const [channel, setChannel] = useState<StreamChannel>();
  const client = useCreateChatClient({
    apiKey: process.env.STREAM_API_KEY!,
    tokenOrProvider: generateChatToken,
    userData: {
      id: userId,
      name: userName,
      image: userImage,
    },
  });

  useEffect(() => {
    if (!client) return;

    const _channel = client.channel("messaging", interview.id, {
      members: [userId, interview.coachId],
    });

    // Watch the channel to ensure it's initialized and we receive events
    _channel.watch().then(() => {
      setChannel(_channel);
    });

    // Clean up listener when component unmounts or dependencies change
    return () => {
      _channel.stopWatching();
    };
  }, [client, interview.id, userId, interview.coachId]);

  if (!client) {
    return (
      <LoadingState
        title="Loading..."
        description="Please wait while we load the chat."
      />
    );
  }

  return (
    <div className="bg-white rounded-lg border overflow-hidden">
      <Chat client={client}>
        <Channel channel={channel}>
          <Window>
            <div className="flex-1 overflow-y-auto max-h-[calc(100vh-23rem)] border-b">
                <MessageList />
            </div>
            <MessageInput />
          </Window>
          <Thread />
        </Channel>
      </Chat>
    </div>
  );
};
