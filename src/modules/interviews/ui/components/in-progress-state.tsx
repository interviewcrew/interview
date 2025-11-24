// import from the framework
import Link from "next/link";

// import from the packages
import { VideoIcon } from "lucide-react";

// import from the components
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";

interface InProgressStateProps {
  interviewId: string;
}

export const InProgressState = ({ interviewId }: InProgressStateProps) => {
  return (
    <div className="bg-white rounded-lg px-4 py-5 flex flex-col gap-y-8 items-center justify-center">
      <EmptyState
        title="Interview is in progress"
        description="The interview will end once all participants have left. You can join the interview by clicking the button below."
        image="/upcoming.svg"
      />
      <div className="flex flex-col-reverse lg:flex-row lg:justify-center items-center gap-2 w-full">
        <Button asChild className="w-full lg:w-auto">
          <Link href={`/dashboard/calls/${interviewId}/`}>
            <VideoIcon />
            Join Interview
          </Link>
        </Button>
      </div>
    </div>
  );
};
