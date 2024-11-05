import { CopyIcon } from "@radix-ui/react-icons";

import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import React from "react";

export function DentalDialog({
  open,
  onOpenChange,
  showClose = false,
  showTitleClose = false,
  title,
  description,
  closeText = "Close",
  children,
  disableOutsideClose = false,
}) {
  return (
    <Dialog
      open={open}
      onOpenChange={disableOutsideClose ? null : onOpenChange}
    >
      <DialogContent
        className="sm:max-w-md p-0 pt-2 min-w-[350px]"
        showCloseDialog={showTitleClose}
      >
        <DialogHeader>
          <DialogTitle className="font-bold text-[1.4rem] text-center px-2">
            {title}
          </DialogTitle>
          <DialogDescription className="font-semibold text-lg text-center px-2">
            {description}
          </DialogDescription>
        </DialogHeader>
        {children}
        <DialogFooter className="sm:justify-start flex p-1 flex-row lg:justify-center">
          {showClose && (
            <DialogClose asChild>
              <Button
                type="button"
                variant="secondary"
                className="text-white p-2 h-[30px]"
                onClick={(val) => onOpenChange(!val)}
              >
                {closeText}
              </Button>
            </DialogClose>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
