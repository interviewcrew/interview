// import from the framework
import Link from "next/link";

// import from the packages
import { VideoIcon } from "lucide-react";

// import from the components
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";

interface UpcomingStateProps {
  interviewId: string;
}

export const UpcomingState = ({ interviewId }: UpcomingStateProps) => {
  return (
    <div className="bg-white rounded-lg px-4 py-5 flex flex-col gap-y-8 items-center justify-center">
      <EmptyState
        title="Upcoming Interview"
        description="Once you start the interview, you will be able to see the interview details here."
        image="/upcoming.svg"
      />
      <div className="flex flex-col-reverse lg:flex-row lg:justify-center items-center gap-2 w-full">
        <Button asChild className="w-full lg:w-auto">
          <Link href={`/calls/${interviewId}/`}>
            <VideoIcon />
            Start Interview
          </Link>
        </Button>
      </div>
    </div>
  );
};
