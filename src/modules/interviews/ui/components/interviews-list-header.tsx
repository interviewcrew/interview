"use client";

// import from the framework
import { useState } from "react";

// import from the packages
import { PlusIcon } from "lucide-react";

// import from the components
import { Button } from "@/components/ui/button";
import { NewInterviewDialog } from "@/modules/interviews/ui/components/new-interview-dialog";

export const InterviewsListHeader = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <NewInterviewDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
      <div className="py-4 px-4 md:px-8 flex flex-col gap-y-4">
        <div className="flex items-center justify-between">
          <h5 className="text-xl font-medium">My Interviews</h5>
          <Button onClick={() => setIsDialogOpen(true)}>
            <PlusIcon className="size-4" />
            New Interview
          </Button>
        </div>
        <div className="flex items-center gap-x-2 p-1">TODO: Add filters</div>
      </div>
    </>
  );
};
