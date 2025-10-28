// import from the components
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";

// import from the libraries
import { CoachForm } from "@/modules/agents/ui/components/coach-form";

export const NewCoachDialog = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  return (
    <ResponsiveDialog
      title="New Coach"
      description="Create a new coach"
      open={open}
      onOpenChange={onOpenChange}
    >
      <CoachForm
        onSuccess={() => onOpenChange(false)}
        onCancel={() => onOpenChange(false)}
      />
    </ResponsiveDialog>
  );
};
