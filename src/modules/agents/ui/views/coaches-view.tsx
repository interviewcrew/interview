"use client";

// import from packages
import { useSuspenseQuery } from "@tanstack/react-query";

// import from libraries
import { useTRPC } from "@/trpc/client";
import { useCoachFilters } from "@/modules/agents/hooks/use-coach-filters";

// import from the components
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";

// import from the components
import { DataTable } from "@/modules/agents/ui/components/data-table";
import { columns } from "@/modules/agents/ui/components/columns";
import { EmptyState } from "@/components/empty-state";
import { DataPagination } from "@/modules/agents/ui/components/data-pagination";

export const CoachesView = () => {
  const [filters, setFilters] = useCoachFilters();

  const trpc = useTRPC();
  const {
    data: { items, totalPages },
  } = useSuspenseQuery(trpc.agents.getMany.queryOptions({ ...filters }));

  return (
    <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
      <DataTable columns={columns} data={items} />
      <DataPagination
        page={filters.page}
        totalPages={totalPages}
        onPageChange={(page) => setFilters({ page })}
      />
      {items.length === 0 && (
        <EmptyState
          title="Create your first coach"
          description="Create a coach to join your meetings. Each coach will follow your instructions and can interact with participants during the call."
        />
      )}
    </div>
  );
};

export const CoachesViewLoading = () => {
  return (
    <LoadingState
      title="Loading agents..."
      description="Please wait while we load the agents."
    />
  );
};

export const CoachesViewError = () => {
  return (
    <ErrorState
      title="Failed to load agents..."
      description="Please try again later."
    />
  );
};
