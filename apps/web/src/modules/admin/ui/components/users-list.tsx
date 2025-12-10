"use client";

// import from the framework
import { useState } from "react";

// import from the packages
import { format } from "date-fns";
import { ColumnDef } from "@tanstack/react-table";
import { Loader2 } from "lucide-react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";

// import from the libraries
import { useTRPC } from "@/trpc/client";

// import from the components
import { DataTable } from "@/components/data-table";
import { DataPagination } from "@/components/ui/data-pagination";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface User {
  id: string;
  name: string;
  email: string;
  image: string | null;
  emailVerified: boolean;
  createdAt: string | Date;
}

const columns: ColumnDef<User>[] = [
  {
    accessorKey: "image",
    header: "",
    cell: ({ row }) => {
      const image = row.original.image;
      const name = row.original.name;
      return (
        <Avatar className="h-8 w-8">
          <AvatarImage src={image || ""} />
          <AvatarFallback>{name?.charAt(0)}</AvatarFallback>
        </Avatar>
      );
    },
  },
  {
    accessorKey: "name",
    header: () => {
      return <div className="text-left pl-2">Name</div>;
    },
  },
  {
    accessorKey: "email",
    header: () => {
      return <div className="text-left pl-2">Email</div>;
    },
  },
  {
    accessorKey: "emailVerified",
    header: "Verified",
    cell: ({ row }) =>
      row.original.emailVerified ? (
        <Badge variant="default" className="bg-green-500 hover:bg-green-600">
          Yes
        </Badge>
      ) : (
        <Badge variant="secondary">No</Badge>
      ),
  },
  {
    accessorKey: "createdAt",
    header: () => {
      return <div className="text-left pl-2">Joined at</div>;
    },
    cell: ({ row }) => format(new Date(row.original.createdAt), "PPP"),
  },
];

export const UsersList = () => {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const trpc = useTRPC();

  const { data, isLoading } = useQuery({
    ...trpc.admin.getUsers.queryOptions({ page, limit: pageSize }),
    placeholderData: keepPreviousData,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
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
        <CardTitle>Users</CardTitle>
        <CardDescription>
          List of all registered users on the platform.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={data?.items || []}
          showHeader={true}
        />
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
