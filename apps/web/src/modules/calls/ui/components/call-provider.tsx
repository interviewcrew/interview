"use client";

// import from the packages
import { LoaderIcon } from "lucide-react";

// import from the libraries
import { authClient } from "@/lib/auth-client";
import { generateAvatarUri } from "@/lib/avatar";
import { InterviewGetById } from "@/modules/interviews/types";

// import from the components
import { CallConnect } from "@/modules/calls/ui/call-connect";

interface CallProviderProps {
  interview: InterviewGetById;
}

export const CallProvider = ({ interview }: CallProviderProps) => {
  const { data, isPending } = authClient.useSession();

  if (!data || isPending) {
    return (
      <div className="flex h-screen items-center justify-center bg-radial from-sidebar-accent to-sidebar">
        <LoaderIcon className="size-6 animate-spin text-white" />
      </div>
    );
  }

  return (
    <CallConnect
      interview={interview}
      userId={data.user.id}
      userName={data.user.name}
      userImage={
        data.user.image ??
        generateAvatarUri({ seed: data.user.name, variant: "initials" })
      }
    />
  );
};
