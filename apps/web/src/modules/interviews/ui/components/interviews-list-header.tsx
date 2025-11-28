"use client";

// import from the framework
import { useState } from "react";

// import from the packages
import { PlusIcon, XCircleIcon } from "lucide-react";

// import from the components
import { Button } from "@/components/ui/button";
import { NewInterviewDialog } from "@/modules/interviews/ui/components/new-interview-dialog";
import { InterviewsSearchFilter } from "@/modules/interviews/ui/components/interviews-search-filter";
import { StatusFilter } from "@/modules/interviews/ui/components/status-filter";
import { CoachIdFilter } from "@/modules/interviews/ui/components/coach-id-filter";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

// import from the libraries
import { useInterviewsFilters } from "@/modules/interviews/hooks/use-interviews-filters";
import { DEFAULT_PAGE } from "@/constants";

export const InterviewsListHeader = () => {
  const [filters, setFilters] = useInterviewsFilters();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const isAnyFilterApplied =
    !!filters.search || !!filters.status || !!filters.coachId;

  const onClearFilters = () => {
    setFilters({ search: "", status: null, coachId: "", page: DEFAULT_PAGE });
  };

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
        <ScrollArea>
          <div className="flex items-center gap-x-2 p-1">
            <InterviewsSearchFilter />
            <StatusFilter />
            <CoachIdFilter />
            {isAnyFilterApplied && (
              <Button variant="outline" size="sm" onClick={onClearFilters}>
                <XCircleIcon />
                Clear Filters
              </Button>
            )}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </>
  );
};
