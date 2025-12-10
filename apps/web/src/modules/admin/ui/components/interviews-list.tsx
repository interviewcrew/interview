"use client";

import { useState } from "react";
import { format } from "date-fns";
import { ColumnDef } from "@tanstack/react-table";
import { Loader2 } from "lucide-react";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { DataTable } from "@/components/data-table";
import { DataPagination } from "@/components/ui/data-pagination";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface Interview {
  id: string;
  title: string;
  status: string;
  createdAt: string | Date;
  userName: string | null;
  coachName: string | null;
}

const columns: ColumnDef<Interview>[] = [
  {
    accessorKey: "title",
    header: () => {
      return <div className="text-left pl-2">Title</div>;
    },
  },
  {
    accessorKey: "userName",
    header: () => {
      return <div className="text-left pl-2">Candidate</div>;
    },
    cell: ({ row }) => row.original.userName || "Unknown",
  },
  {
    accessorKey: "coachName",
    header: () => {
      return <div className="text-left pl-2">Coach</div>;
    },
    cell: ({ row }) => row.original.coachName || "Unknown",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      let variant: "default" | "secondary" | "destructive" | "outline" = "secondary";
      
      switch (status) {
        case "completed":
          variant = "default"; // dark/primary
          break;
        case "upcoming":
          variant = "outline";
          break;
        case "cancelled":
          variant = "destructive";
          break;
        case "in_progress":
        case "processing":
             variant = "default"; // Or maybe something else for active?
             break;
      }
      
      return <Badge variant={variant}>{status}</Badge>;
    },
  },
  {
    accessorKey: "createdAt",
    header: () => {
      return <div className="text-left pl-2">Created at</div>;
    },
    cell: ({ row }) => format(new Date(row.original.createdAt), "PPP"),
  },
];



export const InterviewsList = () => {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const trpc = useTRPC();
  
  const { data, isLoading } = useQuery({
    ...trpc.admin.getInterviews.queryOptions({ page, limit: pageSize }),
    placeholderData: keepPreviousData,
  });

  if (isLoading) {
    return (
       <Card>
        <CardHeader>
           <CardTitle>Interviews</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Interviews</CardTitle>
        <CardDescription>
            List of all interviews conducted on the platform.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={data?.items || []} showHeader={true} />
        <div className="mt-4">
          <DataPagination
            page={page}
            totalPages={data?.totalPages || 1}
            onPageChange={setPage}
          />
        </div>
      </CardContent>
    </Card>
  );
};
