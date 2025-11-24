"use client";

// import from the framework
import { useState } from "react";

// import from the packages
import { PlusIcon, XCircleIcon } from "lucide-react";

// import from the libraries
import { DEFAULT_PAGE } from "@/constants";
import { CoachesSearchFilter } from "@/modules/coaches/ui/components/coaches-search-filter";

// import from the components
import { Button } from "@/components/ui/button";
import { NewCoachDialog } from "@/modules/coaches/ui/components/new-coach-dialog";
import { useCoachFilters } from "@/modules/coaches/hooks/use-coach-filters";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export const CoachesListHeader = () => {
  const [filters, setFilters] = useCoachFilters();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const isAnyFilterApplied =
    filters.search !== "" || filters.page !== DEFAULT_PAGE;

  const onClearFilters = () => {
    setFilters({ search: "", page: DEFAULT_PAGE });
  };

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
        <ScrollArea>
          <div className="flex items-center gap-x-2 p-1">
            <CoachesSearchFilter />
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
