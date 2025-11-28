// import from the libraries
import { InterviewGetById } from "@/modules/interviews/types";

// import from the components
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import { InterviewForm } from "@/modules/interviews/ui/components/interview-form";

export const UpdateInterviewDialog = ({
  open,
  onOpenChange,
  initialValues,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues: InterviewGetById;
}) => {
  return (
    <ResponsiveDialog
      title="Edit Interview"
      description="Edit the interview details"
      open={open}
      onOpenChange={onOpenChange}
    >
      <InterviewForm
        onSuccess={() => onOpenChange(false)}
        onCancel={() => onOpenChange(false)}
        initialValues={initialValues}
      />
    </ResponsiveDialog>
  );
};
