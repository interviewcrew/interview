// import from the framework
import { useRouter } from "next/navigation";

// import from the components
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import { InterviewForm } from "@/modules/interviews/ui/components/interview-form";

export const NewInterviewDialog = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const router = useRouter();

  return (
    <ResponsiveDialog
      title="New Interview"
      description="Create a new interview"
      open={open}
      onOpenChange={onOpenChange}
    >
      <InterviewForm
        onSuccess={(id) => {
          onOpenChange(false);
          router.push(`/interviews/${id}`);
        }}
        onCancel={() => onOpenChange(false)}
      />
    </ResponsiveDialog>
  );
};
