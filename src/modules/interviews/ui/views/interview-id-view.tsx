"use client";

// import from the framework
import { useRouter } from "next/navigation";
import { useState } from "react";

// import from packages
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";

// import from the libraries
import { useTRPC } from "@/trpc/client";
import { useConfirm } from "@/hooks/use-confirm";

// import from the components
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";
import { InterviewIdViewHeader } from "@/modules/interviews/ui/components/interview-id-view-header";
import { UpdateInterviewDialog } from "@/modules/interviews/ui/components/update-interview-dialog";

interface InterviewIdViewProps {
  interviewId: string;
}

export const InterviewIdView = ({ interviewId }: InterviewIdViewProps) => {
  const [removing, setRemoving] = useState(false);
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [UpdateInterviewDialogOpen, setUpdateInterviewDialogOpen] =
    useState(false);
  const [RemoveInterviewConfirmationDialog, confirmRemoveInterview] =
    useConfirm(
      "Remove interview",
      "Are you sure you want to remove this interview? This action cannot be undone.",
      "destructive"
    );

  const { data: interview } = useSuspenseQuery(
    trpc.interviews.getById.queryOptions({ id: interviewId })
  );

  const removeInterviewMutation = useMutation(
    trpc.interviews.remove.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.interviews.getMany.queryOptions({})
        );
        router.push("/dashboard/interviews");

        setRemoving(false);
      },
      onError: (error) => {
        toast.error(error.message);
        setRemoving(false);
      },
    })
  );

  const handleRemoveInterview = async () => {
    const confirmed = await confirmRemoveInterview();
    if (!confirmed) return;

    setRemoving(true);

    await removeInterviewMutation.mutateAsync({ id: interviewId });

    setRemoving(false);
  };

  return (
    <>
      <RemoveInterviewConfirmationDialog />
      <UpdateInterviewDialog
        open={UpdateInterviewDialogOpen}
        onOpenChange={setUpdateInterviewDialogOpen}
        initialValues={interview}
      />
      {removing ? (
        <InterviewIdViewLoading
          title="Removing interview..."
          description="Please wait while we remove the interview."
        />
      ) : (
        <div className="flex-1 py-4 px-4 md:px-8 flex flex-col gap-y-4">
          <InterviewIdViewHeader
            interview={interview}
            onEdit={() => setUpdateInterviewDialogOpen(true)}
            onRemove={handleRemoveInterview}
          />
          {JSON.stringify(interview)}
        </div>
      )}
    </>
  );
};

export const InterviewIdViewLoading = ({
  title = "Loading interview...",
  description = "Please wait while we load the interview.",
}: {
  title?: string;
  description?: string;
}) => {
  return <LoadingState title={title} description={description} />;
};

export const InterviewIdViewError = () => {
  return (
    <ErrorState
      title="Failed to load interview..."
      description="Please try again later."
    />
  );
};
