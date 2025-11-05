// import from the framework
import { Suspense } from "react";

// import from the packages
import { ErrorBoundary } from "react-error-boundary";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

// import from the components
import {
  InterviewsView,
  InterviewsViewError,
  InterviewsViewLoading,
} from "@/modules/interviews/ui/views/interviews-view";

// import from the libraries
import { getQueryClient, trpc } from "@/trpc/server";

export default function InterviewsPage() {
  const queryClient = getQueryClient();
  queryClient.prefetchQuery(trpc.interviews.getMany.queryOptions({}));

  return (
    <div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ErrorBoundary fallback={<InterviewsViewError />}>
          <Suspense fallback={<InterviewsViewLoading />}>
            <InterviewsView />
          </Suspense>
        </ErrorBoundary>
      </HydrationBoundary>
    </div>
  );
}
