// Imports from frameworks
import { Dispatch, SetStateAction, useState } from "react";
import { useRouter } from "next/navigation";

// Imports from libraries
import { useTRPC } from "@/trpc/client";
import { MAX_PAGE_SIZE } from "@/constants";

// Imports from components
import {
  CommandResponsiveDialog,
  CommandInput,
  CommandItem,
  CommandList,
  CommandGroup,
  CommandEmpty,
} from "@/components/ui/command";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { useQuery } from "@tanstack/react-query";

interface DashboardCommandProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export const DashboardCommand = ({ open, setOpen }: DashboardCommandProps) => {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const trpc = useTRPC();
  const { data: interviews } = useQuery(
    trpc.interviews.getMany.queryOptions({
      pageSize: MAX_PAGE_SIZE,
      search: search,
    })
  );
  const { data: coaches } = useQuery(
    trpc.coaches.getMany.queryOptions({
      pageSize: MAX_PAGE_SIZE,
      search: search,
    })
  );

  return (
    <CommandResponsiveDialog
      open={open}
      onOpenChange={setOpen}
      shouldFilter={false}
    >
      <CommandInput
        placeholder="Find an interview or coach"
        value={search}
        onValueChange={(value) => setSearch(value)}
      />
      <CommandList>
        <CommandGroup heading="Interviews">
          <CommandEmpty>
            <span className="text-muted-foreground text-sm">
              No interviews found
            </span>
          </CommandEmpty>
          {interviews?.items.map((interview) => (
            <CommandItem
              key={interview.id}
              onSelect={() => {
                router.push(`/dashboard/interviews/${interview.id}`);
                setOpen(false);
              }}
            >
              {interview.title}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Coaches">
          <CommandEmpty>
            <span className="text-muted-foreground text-sm">
              No coaches found
            </span>
          </CommandEmpty>
          {coaches?.items.map((coach) => (
            <CommandItem
              key={coach.id}
              onSelect={() => {
                router.push(`/dashboard/coaches/${coach.id}`);
                setOpen(false);
              }}
            >
              <GeneratedAvatar seed={coach.name} variant="botttsNeutral" className="size-4" />
              {coach.name}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandResponsiveDialog>
  );
};
