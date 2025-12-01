// import from the framework
import { useForm, useFieldArray, useWatch, Control } from "react-hook-form";
import { useState, useEffect, useRef } from "react";

// import from the libraries
import { CoachGetById } from "@/modules/coaches/types";
import { useTRPC } from "@/trpc/client";
import {
  DEFAULT_INTERVIEW_INSTRUCTIONS,
  InterviewInstructions,
  InterviewInstructionsSchema,
} from "@interview/shared";

// import from the packages
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Trash2, Plus, Wand2 } from "lucide-react";

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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface InterviewInstructionsEditorProps {
  coach: CoachGetById;
}

// Helper component to watch a specific field
const PhaseTitle = ({
  index,
  control,
}: {
  index: number;
  control: Control<InterviewInstructions>;
}) => {
  const name = useWatch({
    control,
    name: `phases.${index}.name`,
  });
  const duration = useWatch({
    control,
    name: `phases.${index}.durationMinutes`,
  });

  return (
    <span className="font-medium">
      {name || `Phase ${index + 1}`}
      <span className="ml-2 text-muted-foreground text-sm font-normal">
        ({duration} min)
      </span>
    </span>
  );
};

export const InterviewInstructionsEditor = ({
  coach,
}: InterviewInstructionsEditorProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [openItem, setOpenItem] = useState<string | undefined>(undefined);
  const prevFieldsLengthRef = useRef(0);

  const updateCoachMutation = useMutation(
    trpc.coaches.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.coaches.getById.queryOptions({ id: coach.id })
        );

        toast.success("Interview instructions updated successfully");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  const form = useForm<InterviewInstructions>({
    resolver: zodResolver(InterviewInstructionsSchema),
    defaultValues: {
      phases:
        (coach.interviewInstructions
          ? (coach.interviewInstructions as InterviewInstructions)
          : {}
        )?.phases || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "phases",
  });

  // Auto-open newly added items
  useEffect(() => {
    if (fields.length > prevFieldsLengthRef.current && fields.length > 0) {
      // A new item was added
      const lastField = fields[fields.length - 1];
      setOpenItem(lastField.id);
    }
    prevFieldsLengthRef.current = fields.length;
  }, [fields]);

  const isPending = updateCoachMutation.isPending;

  const onSubmit = (data: InterviewInstructions) => {
    updateCoachMutation.mutate({
      id: coach.id,
      interviewInstructions: { phases: data.phases },
    });
  };

  return (
    <Form {...form}>
      <form
        className="space-y-8 bg-white rounded-lg border p-6"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Interview Instructions</h3>
              <p className="text-sm text-muted-foreground">
                You can configure the flow of the interview. During the
                interview, the phases will change based on the time elapsed.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                append({
                  name: "",
                  durationMinutes:
                    DEFAULT_INTERVIEW_INSTRUCTIONS.phases[fields.length]
                      ?.durationMinutes || 5,
                  instructions: "",
                });
              }}
            >
              <Plus className="size-4 mr-2" />
              Add Phase
            </Button>
          </div>

          <Accordion
            type="single"
            collapsible
            className="w-full space-y-2"
            value={openItem}
            onValueChange={setOpenItem}
          >
            {fields.map((field, index) => {
              const defaultPhase = DEFAULT_INTERVIEW_INSTRUCTIONS.phases[index];
              const defaultInstruction = defaultPhase?.instructions;
              const defaultName = defaultPhase?.name;

              return (
                <AccordionItem
                  key={field.id}
                  value={field.id}
                  className="border rounded-lg px-4 last:border-b"
                >
                  <div className="flex items-center justify-between py-4">
                    <AccordionTrigger className="py-0 hover:no-underline flex-1">
                      <PhaseTitle index={index} control={form.control} />
                    </AccordionTrigger>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="ml-2 text-destructive hover:text-destructive/90 shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        remove(index);
                      }}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                  <AccordionContent className="pb-4 space-y-4">
                    <div className="grid grid-cols-4 gap-4">
                      <FormField
                        control={form.control}
                        name={`phases.${index}.name`}
                        render={({ field }) => (
                          <FormItem className="col-span-3">
                            <div className="flex items-center justify-between">
                              <FormLabel>Phase Name</FormLabel>
                              {defaultName && !field.value && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="h-auto p-0 text-xs text-muted-foreground hover:text-primary"
                                  onClick={() => field.onChange(defaultName)}
                                >
                                  <Wand2 className="mr-1 size-3" />
                                  Use default
                                </Button>
                              )}
                            </div>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder={
                                  defaultName
                                    ? `e.g. "${defaultName}". Click 'Use default' to fill with suggested name as an sample`
                                    : `Phase ${index + 1}`
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`phases.${index}.durationMinutes`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Duration (min)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(parseInt(e.target.value) || 0)
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name={`phases.${index}.instructions`}
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center justify-between">
                            <FormLabel>Instructions</FormLabel>
                            {defaultInstruction && !field.value && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-auto p-0 text-xs text-muted-foreground hover:text-primary"
                                onClick={() =>
                                  field.onChange(defaultInstruction)
                                }
                              >
                                <Wand2 className="mr-1 size-3" />
                                Use default template
                              </Button>
                            )}
                          </div>
                          <FormControl>
                            <Textarea
                              {...field}
                              rows={6}
                              placeholder={
                                defaultInstruction
                                  ? "Click 'Use default template' to fill with suggested instructions as an sample"
                                  : "Enter instructions for this phase..."
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
          {fields.length === 0 && (
            <div className="text-center p-8 border border-dashed rounded-lg text-muted-foreground">
              No interview phases defined
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isPending}>
            Save Instructions
          </Button>
        </div>
      </form>
    </Form>
  );
};
