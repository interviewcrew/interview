// import from the framework
import { headers } from "next/headers";
import { redirect } from "next/navigation";

// import from the packages
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

// import from the libraries
import { auth } from "@/lib/auth";
import { trpc } from "@/trpc/server";
import { getQueryClient } from "@/trpc/server";

// import from the components
import { CallView } from "@/modules/calls/ui/views/call-view";

interface CallPageProps {
  params: Promise<{ interviewId: string }>;
}

const CallPage = async ({ params }: CallPageProps) => {
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
        <CallView interviewId={interviewId} />
    </HydrationBoundary>
  );
};

export default CallPage;
