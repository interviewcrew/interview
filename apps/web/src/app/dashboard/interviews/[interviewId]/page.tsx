// import from the framework
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";

// import from the packages
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";

// import from the libraries
import { auth } from "@/lib/auth";
import { getQueryClient, trpc } from "@/trpc/server";

// import from the components
import {
  InterviewIdView,
  InterviewIdViewLoading,
  InterviewIdViewError,
} from "@/modules/interviews/ui/views/interview-id-view";

interface InterviewPageProps {
  params: Promise<{ interviewId: string }>;
}

const InterviewPage = async ({ params }: InterviewPageProps) => {
  const { interviewId } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(
    trpc.interviews.getById.queryOptions({ id: interviewId })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ErrorBoundary
        fallback={
          <InterviewIdViewError />
        }
      >
        <Suspense fallback={<InterviewIdViewLoading />}>
          <InterviewIdView interviewId={interviewId} />
        </Suspense>
      </ErrorBoundary>
    </HydrationBoundary>
  );
};

export default InterviewPage;
