// import from the framework
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { Suspense } from "react";

// import from the packages
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";

// import from the libraries
import { auth } from "@/lib/auth";
import { trpc, getQueryClient } from "@/trpc/server";

// import from the components
import {
  AdminView,
  AdminViewError,
  AdminViewLoading,
} from "@/modules/admin/ui/views/admin-view";

export const metadata = {
  title: "Admin Dashboard",
};

const AdminPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(trpc.admin.getStats.queryOptions());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ErrorBoundary fallback={<AdminViewError />}>
        <Suspense fallback={<AdminViewLoading />}>
          <AdminView />
        </Suspense>
      </ErrorBoundary>
    </HydrationBoundary>
  );
};

export default AdminPage;
