import { Suspense } from "react";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { ErrorBoundary } from "react-error-boundary";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient, trpc } from "@/trpc/server";
import { auth } from "@/lib/auth";
import {
  BlogAdminView,
  BlogAdminViewError,
  BlogAdminViewLoading,
  BlogAdminHeader,
} from "@/modules/blog/ui/views/blog-admin-view";

export default async function BlogDashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  const isAdmin =
    session.user.email?.endsWith("@interviewcrew.io") && session.user.emailVerified;

  if (!isAdmin) {
    redirect("/dashboard/interviews");
  }

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(
    trpc.posts.getMany.queryOptions({ pageSize: 100 })
  );

  return (
    <>
      <BlogAdminHeader />
      <div className="flex-1 overflow-auto p-4 md:p-6">
        <HydrationBoundary state={dehydrate(queryClient)}>
          <ErrorBoundary fallback={<BlogAdminViewError />}>
            <Suspense fallback={<BlogAdminViewLoading />}>
              <BlogAdminView />
            </Suspense>
          </ErrorBoundary>
        </HydrationBoundary>
      </div>
    </>
  );
}

