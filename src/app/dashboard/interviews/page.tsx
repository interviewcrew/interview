// import from the framework
import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

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
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function InterviewsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(trpc.interviews.getMany.queryOptions({}));

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
