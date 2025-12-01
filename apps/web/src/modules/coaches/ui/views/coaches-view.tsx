"use client";

// import from the framework
import { useRouter } from "next/navigation";

// import from packages
import { useSuspenseQuery } from "@tanstack/react-query";
import { ShieldCheckIcon, VideoIcon } from "lucide-react";

// import from libraries
import { useTRPC } from "@/trpc/client";
import { useCoachFilters } from "@/modules/coaches/hooks/use-coach-filters";

// import from the components
import { DataTable } from "@/components/data-table";
import { columns } from "@/modules/coaches/ui/components/columns";
import { EmptyState } from "@/components/empty-state";
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";
import { DataPagination } from "@/components/ui/data-pagination";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GeneratedAvatar } from "@/components/generated-avatar";

export const CoachesView = () => {
  const router = useRouter();
  const [filters, setFilters] = useCoachFilters();

  const trpc = useTRPC();

  const {
    data: { items: officialItems },
  } = useSuspenseQuery(
    trpc.coaches.getMany.queryOptions({
      search: filters.search,
      scope: "official",
      pageSize: 100,
    })
  );

  const {
    data: { items: userItems, totalPages: userTotalPages },
  } = useSuspenseQuery(
    trpc.coaches.getMany.queryOptions({ ...filters, scope: "user" })
  );

  return (
    <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-8">
      {officialItems.length > 0 && (
        <div className="flex flex-col gap-y-4">
          <h2 className="text-lg font-semibold">Official Coaches</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {officialItems.map((coach) => (
              <Card
                key={coach.id}
                className="hover:bg-accent/50 transition-colors cursor-pointer"
                onClick={() => router.push(`/dashboard/coaches/${coach.id}`)}
              >
                <CardHeader>
                  <div className="flex items-center gap-x-4">
                    <GeneratedAvatar
                      seed={coach.name}
                      variant="botttsNeutral"
                      className="size-10"
                    />
                    <div className="flex flex-col">
                      <CardTitle className="text-base">{coach.name}</CardTitle>
                      <CardDescription className="line-clamp-1">
                        {coach.systemPrompt}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardFooter className="flex items-center gap-2">
                  <Badge variant="secondary" className="gap-1">
                    <ShieldCheckIcon className="size-3 text-blue-500" />
                    Official
                  </Badge>
                  <Badge variant="outline" className="gap-1">
                    <VideoIcon className="size-3" />
                    {coach.interviewCount}
                  </Badge>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-y-4">
        <h2 className="text-lg font-semibold">Your Coaches</h2>
        <DataTable
          columns={columns}
          data={userItems}
          onRowClick={(row) => router.push(`/dashboard/coaches/${row.id}`)}
        />
        <DataPagination
          page={filters.page}
          totalPages={userTotalPages}
          onPageChange={(page) => setFilters({ page })}
        />
        {userItems.length === 0 && (
          <EmptyState
            title="Create your first coach"
            description="Create a coach to conduct your interviews. Each coach will follow your instructions and can interact with participants during the call."
          />
        )}
      </div>
    </div>
  );
};

export const CoachesViewLoading = () => {
  return (
    <LoadingState
      title="Loading coaches..."
      description="Please wait while we load the coaches."
    />
  );
};

export const CoachesViewError = () => {
  return (
    <ErrorState
      title="Failed to load coaches..."
      description="Please try again later."
    />
  );
};
