// import from the framework
import { useForm } from "react-hook-form";

// import from the libraries
import { CoachGetById } from "@/modules/coaches/types";
import { useTRPC } from "@/trpc/client";
import {
  updateCoachSchema,
} from "@/modules/coaches/schemas";

// import from the packages
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { toast } from "sonner";

// import from the components
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GeneratedAvatar } from "@/components/generated-avatar";

interface UpdateCoachFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialValues?: CoachGetById;
}

export const UpdateCoachForm = ({
  onSuccess,
  onCancel,
  initialValues,
}: UpdateCoachFormProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const updateCoachMutation = useMutation(
    trpc.coaches.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.coaches.getMany.queryOptions({})
        );

        if (initialValues?.id) {
          await queryClient.invalidateQueries(
            trpc.coaches.getById.queryOptions({ id: initialValues.id })
          );
        }

        onSuccess?.();
        toast.success("Coach updated successfully");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  const form = useForm<z.infer<typeof updateCoachSchema>>({
    resolver: zodResolver(updateCoachSchema),
    defaultValues: {
      name: initialValues?.name || "",
      systemPrompt: initialValues?.systemPrompt || "",
      interviewInstructions: initialValues?.interviewInstructions || undefined,
    },
  });

  const isPending = updateCoachMutation.isPending;

  const onSubmit = (data: z.infer<typeof updateCoachSchema>) => {
    updateCoachMutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
        <GeneratedAvatar
          seed={form.watch("name") || ""}
          variant="botttsNeutral"
          className="border size-16"
        />
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g. the Oracle" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="systemPrompt"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>System Prompt</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="You are a helpful assistant that can answer questions and help with tasks."
                />
              </FormControl>
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
            Update
          </Button>
        </div>
      </form>
    </Form>
  );
};
