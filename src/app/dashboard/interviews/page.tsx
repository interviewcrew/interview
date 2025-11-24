// import from the framework
import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

// import from the packages
import { ErrorBoundary } from "react-error-boundary";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { SearchParams } from "nuqs/server";

// import from the components
import {
  InterviewsView,
  InterviewsViewError,
  InterviewsViewLoading,
} from "@/modules/interviews/ui/views/interviews-view";
import { InterviewsListHeader } from "@/modules/interviews/ui/components/interviews-list-header";

// import from the libraries
import { getQueryClient, trpc } from "@/trpc/server";
import { auth } from "@/lib/auth";
import { loadSearchParams } from "@/modules/interviews/params";

interface InterviewsPageProps {
  searchParams: Promise<SearchParams>;
}

export default async function InterviewsPage({ searchParams }: InterviewsPageProps) {
  const filters = await loadSearchParams(searchParams);

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(trpc.interviews.getMany.queryOptions({ ...filters }));

  return (
    <>
      <InterviewsListHeader />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ErrorBoundary fallback={<InterviewsViewError />}>
          <Suspense fallback={<InterviewsViewLoading />}>
            <InterviewsView />
          </Suspense>
        </ErrorBoundary>
      </HydrationBoundary>
    </>
  );
}
