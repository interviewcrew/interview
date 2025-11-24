// import from the packages
import {
  CircleXIcon,
  CircleCheckIcon,
  ClockArrowUpIcon,
  VideoIcon,
  LoaderIcon,
} from "lucide-react";

// import from the components
import { CommandSelect } from "@/components/command-select";

// import from the libraries
import { InterviewStatus } from "@/modules/interviews/types";
import { useInterviewsFilters } from "@/modules/interviews/hooks/use-interviews-filters";

const options = [
  {
    id: InterviewStatus.UPCOMING,
    value: InterviewStatus.UPCOMING,
    children: (
      <div className="flex items-center gap-x-2 capitalize">
        <ClockArrowUpIcon />
        {InterviewStatus.UPCOMING}
      </div>
    ),
  },
  {
    id: InterviewStatus.IN_PROGRESS,
    value: InterviewStatus.IN_PROGRESS,
    children: (
      <div className="flex items-center gap-x-2 capitalize">
        <VideoIcon />
        {InterviewStatus.IN_PROGRESS}
      </div>
    ),
  },
  {
    id: InterviewStatus.COMPLETED,
    value: InterviewStatus.COMPLETED,
    children: (
      <div className="flex items-center gap-x-2 capitalize">
        <CircleCheckIcon />
        {InterviewStatus.COMPLETED}
      </div>
    ),
  },
  {
    id: InterviewStatus.PROCESSING,
    value: InterviewStatus.PROCESSING,
    children: (
      <div className="flex items-center gap-x-2 capitalize">
        <LoaderIcon />
        {InterviewStatus.PROCESSING}
      </div>
    ),
  },
  {
    id: InterviewStatus.CANCELLED,
    value: InterviewStatus.CANCELLED,
    children: (
      <div className="flex items-center gap-x-2 capitalize">
        <CircleXIcon />
        {InterviewStatus.CANCELLED}
      </div>
    ),
  },
];

export const StatusFilter = () => {
  const [filters, setFilters] = useInterviewsFilters();

  return (
    <CommandSelect
      placeholder="Status"
      className="h-9"
      options={options}
      onSelect={(value) => setFilters({ status: value as InterviewStatus })}
      value={filters.status ?? ""}
    />
  );
};
