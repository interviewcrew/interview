// import from the framework
import { JSX, useState } from "react";

// import from the packages
import type { VariantProps } from "class-variance-authority";

// import from components
import { Button, buttonVariants } from "@/components/ui/button";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";

export const useConfirm = (
  title: string,
  description: string,
  buttonVariant: VariantProps<typeof buttonVariants>["variant"] = "default"
): [() => JSX.Element, () => Promise<unknown>] => {
  const [promise, setPromise] = useState<{
    resolve: (value: boolean) => void;
  } | null>(null);

  const confirm = () => {
    return new Promise((resolve) => {
      setPromise({ resolve });
    });
  };

  const handleClose = () => {
    setPromise(null);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open && promise) {
      promise.resolve(false);
      handleClose();
    }
  };

  const handleConfirm = () => {
    promise?.resolve(true);
    handleClose();
  };

  const handleCancel = () => {
    promise?.resolve(false);
    handleClose();
  };

  const ConfirmationDialog = () => {
    return (
      <ResponsiveDialog
        open={promise !== null}
        onOpenChange={handleOpenChange}
        title={title}
        description={description}
      >
        <div className="pt-4 w-full flex flex-col-reverse gap-y-2 lg:flex-row gap-x-2 items-center justify-end">
          <Button
            onClick={handleCancel}
            variant={"outline"}
            className="w-full lg:w-auto"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            variant={buttonVariant}
            className="w-full lg:w-auto"
          >
            Confirm
          </Button>
        </div>
      </ResponsiveDialog>
    );
  };

  return [ConfirmationDialog, confirm];
};
