// import from the components
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";

// import from the libraries
import { UpdateCoachForm } from "@/modules/coaches/ui/components/update-coach-form";
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
      title="Update Coach"
      description="Update the coach details"
      open={open}
      onOpenChange={onOpenChange}
    >
      <UpdateCoachForm
        onSuccess={() => onOpenChange(false)}
        onCancel={() => onOpenChange(false)}
        initialValues={coach}
      />
    </ResponsiveDialog>
  );
};
