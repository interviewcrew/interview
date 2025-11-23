// import from the framework
import { useForm } from "react-hook-form";

// import from the libraries
import { InterviewGetById } from "@/modules/interviews/types";
import { useTRPC } from "@/trpc/client";
import { createInterviewSchema } from "@/modules/interviews/schemas";

// import from the packages
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { toast } from "sonner";

// import from the components
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { CommandSelect } from "@/components/command-select";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { NewCoachDialog } from "@/modules/coaches/ui/components/new-coach-dialog";

interface InterviewFormProps {
  onSuccess?: (interviewId?: InterviewGetById["id"]) => void;
  onCancel?: () => void;
  initialValues?: InterviewGetById;
}

export const InterviewForm = ({
  onSuccess,
  onCancel,
  initialValues,
}: InterviewFormProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const [openNewInterviewDialog, setOpenNewInterviewDialog] = useState(false);
  const [coachSearch, setCoachSearch] = useState("");

  const coaches = useQuery(
    trpc.coaches.getMany.queryOptions({
      pageSize: 100,
      search: coachSearch,
    })
  );

  const createInterviewMutation = useMutation(
    trpc.interviews.create.mutationOptions({
      onSuccess: async (data) => {
        await queryClient.invalidateQueries(
          trpc.interviews.getMany.queryOptions({})
        );

        onSuccess?.(data.id);
        toast.success("Interview created successfully");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  const updateInterviewMutation = useMutation(
    trpc.interviews.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.interviews.getMany.queryOptions({})
        );

        if (initialValues?.id) {
          await queryClient.invalidateQueries(
            trpc.interviews.getById.queryOptions({ id: initialValues.id })
          );
        }

        onSuccess?.();
        toast.success("Interview updated successfully");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  const form = useForm<z.infer<typeof createInterviewSchema>>({
    resolver: zodResolver(createInterviewSchema),
    defaultValues: {
      title: initialValues?.title || "",
      coachId: initialValues?.coachId || "",
    },
  });

  const isEditing = !!initialValues?.id;
  const isPending =
    createInterviewMutation.isPending || updateInterviewMutation.isPending;

  const onSubmit = (data: z.infer<typeof createInterviewSchema>) => {
    if (isEditing) {
      updateInterviewMutation.mutate({
        id: initialValues!.id,
        ...data,
      });
    } else {
      createInterviewMutation.mutate(data);
    }
  };

  return (
    <>
      <NewCoachDialog
        open={openNewInterviewDialog}
        onOpenChange={setOpenNewInterviewDialog}
      />
      <Form {...form}>
        <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            name="title"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="e.g. Introduction call with HR"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="coachId"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Coach</FormLabel>
                <FormControl>
                  <CommandSelect
                    options={(coaches.data?.items ?? []).map((coach) => ({
                      id: coach.id,
                      value: coach.id,
                      children: (
                        <div>
                          <GeneratedAvatar
                            seed={coach.name}
                            variant="botttsNeutral"
                            className="border size-6"
                          />
                          <span>{coach.name}</span>
                        </div>
                      ),
                    }))}
                    onSelect={field.onChange}
                    onSearch={setCoachSearch}
                    value={field.value}
                    placeholder="Select a coach"
                  />
                </FormControl>
                <FormDescription>
                  Not found what you&apos;re looking for?{" "}
                  <button
                    type="button"
                    className="text-primary hover:underline"
                    onClick={() => setOpenNewInterviewDialog(true)}
                  >
                    Create a new coach
                  </button>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-between gap-2">
            {onCancel && (
              <Button
                type="button"
                variant="ghost"
                onClick={onCancel}
                disabled={isPending}
              >
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={isPending}>
              {isEditing ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};
