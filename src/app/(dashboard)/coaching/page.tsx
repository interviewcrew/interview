// import from the framework
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

// import from packages
import { ErrorBoundary } from "react-error-boundary";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

// import from libraries
import { getQueryClient, trpc } from "@/trpc/server";
import { auth } from "@/lib/auth";

// import from the components
import {
  AgentsView,
  AgentsViewError,
  AgentsViewLoading,
} from "@/modules/agents/ui/views/agents-view";
import { CoachingListHeader } from "@/modules/agents/ui/components/coaching-list-header";

const CoachingPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }
  
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(trpc.agents.getMany.queryOptions());

  return (
    <>
      <CoachingListHeader />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ErrorBoundary fallback={<AgentsViewError />}>
          <Suspense fallback={<AgentsViewLoading />}>
            <AgentsView />
          </Suspense>
        </ErrorBoundary>
      </HydrationBoundary>
    </>
  );
};

export default CoachingPage;
