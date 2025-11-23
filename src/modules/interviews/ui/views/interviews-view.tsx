"use client";

// import from the packages
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

// import from the components
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";
import { DataTable } from "@/components/data-table";
import { columns } from "@/modules/interviews/ui/components/columns";
import { EmptyState } from "@/components/empty-state";

export const InterviewsView = () => {
  const trpc = useTRPC();
  const { data: interviews } = useSuspenseQuery(
    trpc.interviews.getMany.queryOptions({})
  );

  return (
    <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
      <DataTable columns={columns} data={interviews.items} />
      {interviews.items.length === 0 && (
        <EmptyState
          title="Create your first interview"
          description="Create an interview to get started."
        />
      )}
    </div>
  );
};

export const InterviewsViewLoading = () => {
  return (
    <LoadingState
      title="Loading interviews..."
      description="Please wait while we load the interviews."
    />
  );
};

export const InterviewsViewError = () => {
  return (
    <ErrorState
      title="Failed to load interviews..."
      description="Please try again later."
    />
  );
};
