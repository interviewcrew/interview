// import from the framework
import Link from "next/link";

// import from the components
import { Button } from "@/components/ui/button";

export const CallEnded = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-radial from-sidebar-accent to-sidebar">
      <div className="py-4 px-8 flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-y-6 bg-background rounded-lg shadow-sm p-10">
          <div className="flex flex-col gap-y-2 text-center">
            <h6 className="text-lg font-medium">You have ended the call</h6>
            <p className="text-sm">Summary will appear in a few minutes</p>
          </div>
          <Button asChild>
            <Link href="/dashboard/interviews">Back to Interviews</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
