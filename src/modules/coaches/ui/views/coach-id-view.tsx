"use client";

// import from the framework
import { useRouter } from "next/navigation";
import { useState } from "react";

// import from the packages
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { VideoIcon } from "lucide-react";
import { toast } from "sonner";

// import from the libraries
import { useTRPC } from "@/trpc/client";

// import from the components
import { CoachIdViewHeader } from "@/modules/coaches/ui/components/coach-id-view-header";
import { UpdateCoachDialog } from "@/modules/coaches/ui/components/update-coach-dialog";
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { Badge } from "@/components/ui/badge";

// import from the hooks
import { useConfirm } from "@/hooks/use-confirm";

interface CoachIdViewProps {
  coachId: string;
}

export const CoachIdView = ({ coachId }: CoachIdViewProps) => {
  const [removing, setRemoving] = useState(false);

  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [UpdateCoachDialogOpen, setUpdateCoachDialogOpen] = useState(false);

  const { data: coach } = useSuspenseQuery(
    trpc.coaches.getById.queryOptions({ id: coachId })
  );

  const removeCoachMutation = useMutation(
    trpc.coaches.remove.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.coaches.getMany.queryOptions({})
        );

        router.push("/coaches");

        setRemoving(false);
      },
      onError: (error) => {
        toast.error(error.message);
        setRemoving(false);
      },
    })
  );

  const [RemoveConfirmationDialog, confirmRemove] = useConfirm(
    "Remove coach",
    `Are you sure you want to remove this coach? It would also delete ${
      coach.meetingCount
    } ${
      coach.meetingCount === 1 ? "meeting" : "meetings"
    } associated with it permanently.`,
    "destructive"
  );

  const handleRemoveCoach = async () => {
    const confirmed = await confirmRemove();

    if (!confirmed) return;

    setRemoving(true);

    await removeCoachMutation.mutateAsync({ id: coachId });
  };

  return (
    <>
      <RemoveConfirmationDialog />
      <UpdateCoachDialog
        open={UpdateCoachDialogOpen}
        onOpenChange={setUpdateCoachDialogOpen}
        coach={coach}
      />
      {removing ? (
        <CoachIdViewLoading
          title="Removing coach..."
          description="Please wait while we remove the coach."
        />
      ) : (
        <div className="flex-1 py-4 px-4 md:px-8 flex flex-col gap-y-4">
          <CoachIdViewHeader
            coach={coach}
            onEdit={() => setUpdateCoachDialogOpen(true)}
            onRemove={handleRemoveCoach}
          />
          <div className="bg-white rounded-lg border">
            <div className="px-4 py-5 gap-y-5 flex flex-col col-span-5">
              <div className="flex items-center gap-x-3">
                <GeneratedAvatar
                  seed={coach.name}
                  variant="botttsNeutral"
                  className="size-10"
                />
                <h2 className="font-medium text-2xl">{coach.name}</h2>
              </div>
              <Badge
                variant="outline"
                className="flex items-center gap-x-2 [&>svg]:size-4"
              >
                <VideoIcon />
                {coach.meetingCount}{" "}
                {coach.meetingCount === 1 ? "meeting" : "meetings"}
              </Badge>
              <div className="flex flex-col gap-y-4">
                <p className="text-lg font-medium">Instructions</p>
                <p className="text-neutral-800">{coach.instructions}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const CoachIdViewLoading = ({
  title = "Loading coach...",
  description = "Please wait while we load the coach.",
}: {
  title?: string;
  description?: string;
}) => {
  return <LoadingState title={title} description={description} />;
};

export const CoachIdViewError = () => {
  return (
    <ErrorState
      title="Failed to load coach..."
      description="Please try again later."
    />
  );
};
