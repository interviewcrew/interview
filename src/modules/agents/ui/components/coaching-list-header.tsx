"use client";

// import from the framework
import { useState } from "react";

// import from the packages
import { PlusIcon } from "lucide-react";

// import from the components
import { Button } from "@/components/ui/button";
import { NewCoachDialog } from "@/modules/agents/ui/components/new-coach-dialog";

export const CoachingListHeader = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <NewCoachDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
      <div className="py-4 px-4 md:px-8 flex flex-col gap-y-4">
        <div className="flex items-center justify-between">
          <h5 className="text-xl font-medium">Coaches</h5>
          <Button onClick={() => setIsDialogOpen(true)}>
            <PlusIcon className="size-4" />
            New Coach
          </Button>
        </div>
      </div>
    </>
  );
};
