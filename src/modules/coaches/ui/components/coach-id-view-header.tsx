// import from the framework
import Link from "next/link";

// import from the packages
import {
  ChevronRightIcon,
  TrashIcon,
  PencilIcon,
  MoreVerticalIcon,
} from "lucide-react";

// import from the libraries
import { CoachGetById } from "@/modules/coaches/types";

// Import from the components
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface CoachIdViewHeaderProps {
  coach: CoachGetById;
  onEdit: () => void;
  onRemove: () => void;
}

export const CoachIdViewHeader = ({
  coach,
  onEdit,
  onRemove,
}: CoachIdViewHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild className="font-medium text-xl">
              <Link href="/coaches">Coaches</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="text-foreground text-xl font-medium [&>svg]:size-4">
            <ChevronRightIcon />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink
              asChild
              className="font-medium text-xl text-foreground"
            >
              <Link href={`/coaches/${coach.id}`}>{coach.name}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost">
            <MoreVerticalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onEdit} disabled={coach.userId === null}>
            <PencilIcon className="size-4 text-black" />
            {coach.userId !== null ? "Edit" : "Edit not possible (Official coach)"}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onRemove} disabled={coach.userId === null}>
            <TrashIcon className="size-4 text-black" />
            {coach.userId !== null ? "Delete" : "Delete not possible (Official coach)"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
