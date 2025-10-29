// import from the framework
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

// import from packages
import { ErrorBoundary } from "react-error-boundary";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { SearchParams } from "nuqs";

// import from libraries
import { getQueryClient, trpc } from "@/trpc/server";
import { auth } from "@/lib/auth";

// import from the components
import {
  CoachesView,
  CoachesViewError,
  CoachesViewLoading,
} from "@/modules/agents/ui/views/coaches-view";
import { CoachingListHeader } from "@/modules/agents/ui/components/coaching-list-header";
import { loadSearchParams } from "@/modules/agents/params";

interface CoachingPageProps {
  searchParams: Promise<SearchParams>;
}

const CoachingPage = async ({ searchParams }: CoachingPageProps) => {
  const filters = await loadSearchParams(searchParams);
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(trpc.agents.getMany.queryOptions({ ...filters }));

  return (
    <>
      <CoachingListHeader />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ErrorBoundary fallback={<CoachesViewError />}>
          <Suspense fallback={<CoachesViewLoading />}>
            <CoachesView />
          </Suspense>
        </ErrorBoundary>
      </HydrationBoundary>
    </>
  );
};

export default CoachingPage;
