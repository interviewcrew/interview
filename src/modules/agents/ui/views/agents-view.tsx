"use client";

// import from packages
import { useSuspenseQuery } from "@tanstack/react-query";

// import from libraries
import { useTRPC } from "@/trpc/client";

// import from the components
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";

// import from the components
import { DataTable } from "@/modules/agents/ui/components/data-table";
import { columns } from "@/modules/agents/ui/components/columns";
import { EmptyState } from "@/components/empty-state";

export const AgentsView = () => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.agents.getMany.queryOptions());

  return (
    <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
      <DataTable columns={columns} data={data} />
      {data.length === 0 && (
      <EmptyState
        title="Create your first coach"
          description="Create a coach to join your meetings. Each coach will follow your instructions and can interact with participants during the call."
        />
      )}
    </div>
  );
};

export const AgentsViewLoading = () => {
  return (
    <LoadingState
      title="Loading agents..."
      description="Please wait while we load the agents."
    />
  );
};

export const AgentsViewError = () => {
  return (
    <ErrorState
      title="Failed to load agents..."
      description="Please try again later."
    />
  );
};
