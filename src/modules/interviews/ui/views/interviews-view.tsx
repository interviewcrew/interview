"use client";

// import from the packages
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

// import from the components
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";

export const InterviewsView = () => {
  const trpc = useTRPC();
  const { data: interviews } = useSuspenseQuery(trpc.interviews.getMany.queryOptions({}));

  return (
    <div>
      <h1>{interviews?.items.length} interviews</h1>
      <div>{JSON.stringify(interviews)}</div>
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