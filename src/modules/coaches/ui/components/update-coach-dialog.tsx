// import from the components
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";

// import from the libraries
import { CoachForm } from "@/modules/coaches/ui/components/coach-form";
import { CoachGetById } from "@/modules/coaches/types";

interface UpdateCoachDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  coach: CoachGetById;
}

export const UpdateCoachDialog = ({
  open,
  onOpenChange,
  coach,
}: UpdateCoachDialogProps) => {
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
        initialValues={coach}
      />
    </ResponsiveDialog>
  );
};
