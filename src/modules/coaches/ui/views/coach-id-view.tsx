"use client";

// import from the packages
import { useSuspenseQuery } from "@tanstack/react-query";
import { VideoIcon } from "lucide-react";

// import from the libraries
import { useTRPC } from "@/trpc/client";

// import from the components
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { CoachIdViewHeader } from "@/modules/coaches/ui/components/coach-id-view-header";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { Badge } from "@/components/ui/badge";

interface CoachIdViewProps {
  coachId: string;
}

export const CoachIdView = ({ coachId }: CoachIdViewProps) => {
  const trpc = useTRPC();

  const { data: coach } = useSuspenseQuery(
    trpc.coaches.getById.queryOptions({ id: coachId })
  );

  return (
    <div className="flex-1 py-4 px-4 md:px-8 flex flex-col gap-y-4">
      <CoachIdViewHeader coach={coach} onEdit={() => {}} onRemove={() => {}} />
      <div className="bg-white rounded-lg border">
        <div className="px-4 py-5 gap-y-5 flex flex-col col-span-5">
          <div className="flex items-center gap-x-3">
            <GeneratedAvatar
              seed={coach.name}
              variant="botttsNeutral"
              className="size-10"
            />
            <h2 className="font-medium text-2xl">{coach.name}</h2>
          </div>
          <Badge
            variant="outline"
            className="flex items-center gap-x-2 [&>svg]:size-4"
          >
            <VideoIcon />
            {coach.meetingCount}{" "}
            {coach.meetingCount === 1 ? "meeting" : "meetings"}
          </Badge>
          <div className="flex flex-col gap-y-4">
            <p className="text-lg font-medium">Instructions</p>
            <p className="text-neutral-800">{coach.instructions}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const CoachIdViewLoading = () => {
  return (
    <LoadingState
      title="Loading coach..."
      description="Please wait while we load the coach."
    />
  );
};

export const CoachIdViewError = () => {
  return (
    <ErrorState
      title="Failed to load coach..."
      description="Please try again later."
    />
  );
};
