"use client";

// import from the packages
import { ColumnDef } from "@tanstack/react-table";
import {
  CornerDownRightIcon,
  VideoIcon,
  ShieldCheckIcon,
  UserIcon,
} from "lucide-react";

// import from the libraries
import { CoachGetMany } from "@/modules/coaches/types";

// import from the components
import { Badge } from "@/components/ui/badge";
import { GeneratedAvatar } from "@/components/generated-avatar";

export const columns: ColumnDef<CoachGetMany[number]>[] = [
  {
    accessorKey: "name",
    header: "Coach Name",
    cell: ({ row }) => (
      <div className="flex flex-col gap-y-1">
        <div className="flex items-center gap-x-2">
          <GeneratedAvatar
            seed={row.original.name}
            variant="botttsNeutral"
            className="size-6"
          />
          <span className="font-semibold capitalize">{row.original.name}</span>
        </div>
        <div className="flex items-center gap-x-2">
          <CornerDownRightIcon className="size-3 text-muted-foreground" />
          <span className="text-sm text-muted-foreground max-w-[200px] truncate capitalize">
            {row.original.instructions}
          </span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "interviewCount",
    header: "Interviews",
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className="flex items-center gap-x-2 [&>svg]:size-4"
      >
        <VideoIcon className="text-blue-700" />
        {row.original.interviewCount}{" "}
        {row.original.interviewCount === 1 ? "Interview" : "Interviews"}
      </Badge>
    ),
  },
  {
    accessorKey: "isOfficial",
    header: "Official",
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className="flex items-center gap-x-2 [&>svg]:size-4"
      >
        {row.original.isOfficial ? (
          <ShieldCheckIcon className="size-3 text-green-700" />
        ) : (
          <UserIcon className="size-3 text-green-700" />
        )}
        {row.original.isOfficial ? "Official Coach" : "Created by you"}
      </Badge>
    ),
  },
];
