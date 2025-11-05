// import from the framework
import { useForm } from "react-hook-form";

// import from the libraries
import { CoachGetById } from "@/modules/coaches/types";
import { useTRPC } from "@/trpc/client";
import { createCoachSchema } from "@/modules/coaches/schemas";

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

interface CoachFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialValues?: CoachGetById;
}

export const CoachForm = ({
  onSuccess,
  onCancel,
  initialValues,
}: CoachFormProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const createCoachMutation = useMutation(
    trpc.coaches.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.coaches.getMany.queryOptions({})
        );

        onSuccess?.();
        toast.success("Coach created successfully");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

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

  const form = useForm<z.infer<typeof createCoachSchema>>({
    resolver: zodResolver(createCoachSchema),
    defaultValues: {
      name: initialValues?.name || "",
      instructions: initialValues?.instructions || "",
    },
  });

  const isEditing = !!initialValues?.id;
  const isPending =
    createCoachMutation.isPending || updateCoachMutation.isPending;

  const onSubmit = (data: z.infer<typeof createCoachSchema>) => {
    if (isEditing) {
      updateCoachMutation.mutate({
        id: initialValues!.id,
        ...data,
      });
    } else {
      createCoachMutation.mutate(data);
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
        <GeneratedAvatar
          seed={form.watch("name")}
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
          name="instructions"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instructions</FormLabel>
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
            {isEditing ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
