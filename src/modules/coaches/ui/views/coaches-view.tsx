"use client";

// import from the framework
import { useRouter } from "next/navigation";

// import from packages
import { useSuspenseQuery } from "@tanstack/react-query";

// import from libraries
import { useTRPC } from "@/trpc/client";
import { useCoachFilters } from "@/modules/coaches/hooks/use-coach-filters";

// import from the components
import { DataTable } from "@/components/data-table";
import { columns } from "@/modules/coaches/ui/components/columns";
import { EmptyState } from "@/components/empty-state";
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";
import { DataPagination } from "@/components/ui/data-pagination";

export const CoachesView = () => {
  const router = useRouter();
  const [filters, setFilters] = useCoachFilters();

  const trpc = useTRPC();
  const {
    data: { items, totalPages },
  } = useSuspenseQuery(trpc.coaches.getMany.queryOptions({ ...filters }));

  return (
    <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
      <DataTable
        columns={columns}
        data={items}
        onRowClick={(row) => router.push(`/coaches/${row.id}`)}
      />
      <DataPagination
        page={filters.page}
        totalPages={totalPages}
        onPageChange={(page) => setFilters({ page })}
      />
      {items.length === 0 && (
        <EmptyState
          title="Create your first coach"
          description="Create a coach to conduct your interviews. Each coach will follow your instructions and can interact with participants during the call."
        />
      )}
    </div>
  );
};

export const CoachesViewLoading = () => {
  return (
    <LoadingState
      title="Loading coaches..."
      description="Please wait while we load the coaches."
    />
  );
};

export const CoachesViewError = () => {
  return (
    <ErrorState
      title="Failed to load coaches..."
      description="Please try again later."
    />
  );
};
