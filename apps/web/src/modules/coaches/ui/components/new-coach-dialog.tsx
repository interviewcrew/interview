// import from the components
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import { CreateCoachForm } from "@/modules/coaches/ui/components/create-coach-form";

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
      <CreateCoachForm
        onSuccess={() => onOpenChange(false)}
        onCancel={() => onOpenChange(false)}
      />
    </ResponsiveDialog>
  );
};
