// Imports from frameworks
import { Dispatch, SetStateAction } from "react";

// Imports from components
import { CommandDialog, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

interface DashboardCommandProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export const DashboardCommand = ({ open, setOpen }: DashboardCommandProps) => {
  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Find an interview"/>
      <CommandList>
        <CommandItem>
            Test
        </CommandItem>
      </CommandList>
    </CommandDialog>
  );
};
