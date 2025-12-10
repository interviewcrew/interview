"use client";

// import from the packages 
import { useSuspenseQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// import from the libraries
import { useTRPC } from "@/trpc/client";

// import from the components
import { UsersList } from "@/modules/admin/ui/components/users-list";
import { InterviewsList } from "@/modules/admin/ui/components/interviews-list";
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const AdminView = () => {
  const trpc = useTRPC();
  const { data: stats } = useSuspenseQuery(trpc.admin.getStats.queryOptions());


  return (
    <div className="container mx-auto p-8 space-y-8">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.users}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Interviews
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.interviews}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Coaches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.coaches}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="interviews">Interviews</TabsTrigger>
        </TabsList>
        <TabsContent value="users" className="mt-4">
          <UsersList />
        </TabsContent>
        <TabsContent value="interviews" className="mt-4">
          <InterviewsList />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export const AdminViewLoading = () => {
  return (
    <LoadingState
      title="Loading admin dashboard..."
      description="Please wait while we load the admin dashboard."
    />
  );
};

export const AdminViewError = () => {
  return (
    <ErrorState
      title="Failed to load admin dashboard..."
      description="Please try again later."
    />
  );
};