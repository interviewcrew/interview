// import from the framework
import { Suspense } from "react";

// import from the packages
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";

// import from the libraries
import { getQueryClient, trpc } from "@/trpc/server";

// import from the components
import {
  CoachIdView,
  CoachIdViewError,
  CoachIdViewLoading,
} from "@/modules/coaches/ui/views/coach-id-view";

interface CoachPageProps {
  params: Promise<{ coachId: string }>;
}

const CoachPage = async ({ params }: CoachPageProps) => {
  const { coachId } = await params;

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(
    trpc.coaches.getById.queryOptions({ id: coachId })
  );

  return (
    <div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ErrorBoundary fallback={<CoachIdViewError />}>
          <Suspense fallback={<CoachIdViewLoading />}>
            <CoachIdView coachId={coachId} />
          </Suspense>
        </ErrorBoundary>
      </HydrationBoundary>
    </div>
  );
};

export default CoachPage;
