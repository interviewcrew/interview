"use client";

// import from packages
import { useSuspenseQuery } from "@tanstack/react-query";

// import from libraries
import { useTRPC } from "@/trpc/client";

// import from the components
import { ErrorState } from "@/components/error-state";
import { InterviewStatus } from "@/modules/interviews/types";
import { CallProvider } from "@/modules/calls/ui/components/call-provider";

interface CallViewProps {
  interviewId: string;
}

export const CallView = ({ interviewId }: CallViewProps) => {
  const trpc = useTRPC();
  const { data: interview } = useSuspenseQuery(
    trpc.interviews.getById.queryOptions({ id: interviewId })
  );

  if (interview?.status === InterviewStatus.COMPLETED) {
    return (
      <div className="flex h-screen items-center justify-center">
        <ErrorState
          title="Interview has ended"
          description="The interview has ended. You can no longer join the interview."
        />
      </div>
    );
  }

  return <CallProvider interview={interview}/>;
};
