"use client";

// import from the packages
import { ColumnDef } from "@tanstack/react-table";
import {
  CircleCheckIcon,
  CircleXIcon,
  ClockArrowUpIcon,
  ClockFadingIcon,
  CornerDownRightIcon,
  LoaderIcon,
} from "lucide-react";
import { format } from "date-fns";
import humanizeDuration from "humanize-duration";

// import from the libraries
import { InterviewGetMany } from "@/modules/interviews/types";
import { cn } from "@/lib/utils";

// import from the components
import { Badge } from "@/components/ui/badge";
import { GeneratedAvatar } from "@/components/generated-avatar";

function formatDuration(seconds: number) {
  return humanizeDuration(seconds * 1000, {
    largest: 1,
    round: true,
    units: ["h", "m", "s"],
  });
}

const statusIconMap = {
  upcoming: ClockArrowUpIcon,
  "in-progress": LoaderIcon,
  completed: CircleCheckIcon,
  processing: LoaderIcon,
  cancelled: CircleXIcon,
};

const statusColorMap = {
  upcoming: "bg-yellow-500/20 text-yellow-800 border-yellow-800/5",
  "in-progress": "bg-blue-500/20 text-blue-800 border-blue-800/5",
  completed: "bg-emerald-500/20 text-emerald-800 border-emerald-800/5",
  processing: "bg-gray-500/20 text-gray-800 border-gray-800/5",
  cancelled: "bg-rose-500/20 text-rose-800 border-rose-800/5",
};

function getStatusIcon(status: InterviewGetMany[number]["status"]) {
  const icon = statusIconMap[status as keyof typeof statusIconMap];
  return icon ?? ClockArrowUpIcon;
}

function getStatusColor(status: InterviewGetMany[number]["status"]) {
  const color = statusColorMap[status as keyof typeof statusColorMap];
  return color ?? "bg-yellow-500/20 text-yellow-800 border-yellow-800/5";
}

export const columns: ColumnDef<InterviewGetMany[number]>[] = [
  {
    accessorKey: "name",
    header: "Interview Name",
    cell: ({ row }) => (
      <div className="flex flex-col gap-y-1">
        <span className="font-semibold capitalize">{row.original.title}</span>
        <div className="flex items-center gap-x-2">
          <div className="ml-2 flex items-center gap-x-2">
            <CornerDownRightIcon className="size-3 text-muted-foreground" />
            <span className="text-sm text-muted-foreground max-w-[200px] truncate capitalize">
              {row.original.coach.name}
            </span>
          </div>
          <GeneratedAvatar
            seed={row.original.coach.name}
            variant="botttsNeutral"
            className="size-4"
          />
          <span className="text-sm text-muted-foreground">
            {row.original.startedAt
              ? format(row.original.startedAt, "MMM d")
              : ""}
          </span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const StatusIcon = getStatusIcon(row.original.status);

      return (
        <Badge
          variant="outline"
          className={cn(
            "capitalize [&>svg]:size-4 text-muted-foreground",
            getStatusColor(row.original.status)
          )}
        >
          <StatusIcon
            className={cn(
              row.original.status === "processing" && "animate-spin"
            )}
          />
          {row.original.status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "duration",
    header: "Duration",
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className="capitalize [&>svg]:size-4 flex items-center gap-x-2"
      >
        <ClockFadingIcon className="text-blue-700" />
        {row.original.duration
          ? formatDuration(row.original.duration)
          : "No duration"}
      </Badge>
    ),
  },
];
