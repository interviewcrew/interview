"use client";

// import from the libraries
import { authClient } from "@/lib/auth-client";
import { InterviewGetById } from "@/modules/interviews/types";

// import from the components
import { LoadingState } from "@/components/loading-state";
import { ChatUI } from "@/modules/interviews/ui/components/chat-ui";

interface ChatProviderProps {
  interview: InterviewGetById;
}

export const ChatProvider = ({ interview }: ChatProviderProps) => {
  const { data, isPending } = authClient.useSession();

  if (!data || isPending) {
    return (
      <LoadingState
        title="Loading..."
        description="Please wait while we load the chat."
      />
    );
  }

  return (
    <ChatUI
      interview={interview}
      userId={data.user.id}
      userName={data.user.name}
      userImage={data.user.image ?? ""}
    />
  );
};
