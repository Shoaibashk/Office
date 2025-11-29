import { forwardRef } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { cn } from "../utils";

// Modal (Dialog)
export interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export function Modal({ open, onOpenChange, children }: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      {children}
    </Dialog.Root>
  );
}

// Modal Trigger
export const ModalTrigger = Dialog.Trigger;

// Modal Content
export interface ModalContentProps {
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  showClose?: boolean;
}

export const ModalContent = forwardRef<HTMLDivElement, ModalContentProps>(
  ({ children, className, size = "md", showClose = true }, ref) => {
    const sizeStyles = {
      sm: "max-w-sm",
      md: "max-w-md",
      lg: "max-w-lg",
      xl: "max-w-xl",
      full: "max-w-[90vw]",
    };

    return (
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-fadeIn" />
        <Dialog.Content
          ref={ref}
          className={cn(
            "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
            "w-full p-6 bg-white rounded-lg shadow-xl",
            "data-[state=open]:animate-contentShow",
            "focus:outline-none",
            sizeStyles[size],
            className
          )}
        >
          {children}
          {showClose && (
            <Dialog.Close asChild>
              <button
                className="absolute top-4 right-4 p-1 rounded-md hover:bg-[var(--gray-4)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-7)]"
                aria-label="Close"
              >
                <Cross2Icon />
              </button>
            </Dialog.Close>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    );
  }
);

ModalContent.displayName = "ModalContent";

// Modal Header
export interface ModalHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function ModalHeader({ children, className }: ModalHeaderProps) {
  return <div className={cn("mb-4", className)}>{children}</div>;
}

// Modal Title
export interface ModalTitleProps {
  children: React.ReactNode;
  className?: string;
}

export function ModalTitle({ children, className }: ModalTitleProps) {
  return (
    <Dialog.Title
      className={cn("text-lg font-semibold text-[var(--gray-12)]", className)}
    >
      {children}
    </Dialog.Title>
  );
}

// Modal Description
export interface ModalDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export function ModalDescription({
  children,
  className,
}: ModalDescriptionProps) {
  return (
    <Dialog.Description
      className={cn("mt-2 text-sm text-[var(--gray-11)]", className)}
    >
      {children}
    </Dialog.Description>
  );
}

// Modal Footer
export interface ModalFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function ModalFooter({ children, className }: ModalFooterProps) {
  return (
    <div className={cn("mt-6 flex justify-end gap-3", className)}>
      {children}
    </div>
  );
}

// Modal Close
export const ModalClose = Dialog.Close;

// Alert Modal
export interface AlertModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export function AlertModal({ open, onOpenChange, children }: AlertModalProps) {
  return (
    <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
      {children}
    </AlertDialog.Root>
  );
}

// Alert Modal Content
export interface AlertModalContentProps {
  children: React.ReactNode;
  className?: string;
}

export const AlertModalContent = forwardRef<
  HTMLDivElement,
  AlertModalContentProps
>(({ children, className }, ref) => {
  return (
    <AlertDialog.Portal>
      <AlertDialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-fadeIn" />
      <AlertDialog.Content
        ref={ref}
        className={cn(
          "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
          "w-full max-w-md p-6 bg-white rounded-lg shadow-xl",
          "data-[state=open]:animate-contentShow",
          "focus:outline-none",
          className
        )}
      >
        {children}
      </AlertDialog.Content>
    </AlertDialog.Portal>
  );
});

AlertModalContent.displayName = "AlertModalContent";

// Alert Modal Title
export function AlertModalTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <AlertDialog.Title
      className={cn("text-lg font-semibold text-[var(--gray-12)]", className)}
    >
      {children}
    </AlertDialog.Title>
  );
}

// Alert Modal Description
export function AlertModalDescription({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <AlertDialog.Description
      className={cn("mt-2 text-sm text-[var(--gray-11)]", className)}
    >
      {children}
    </AlertDialog.Description>
  );
}

// Alert Modal Actions
export function AlertModalActions({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mt-6 flex justify-end gap-3", className)}>
      {children}
    </div>
  );
}

// Alert Modal Cancel
export const AlertModalCancel = AlertDialog.Cancel;

// Alert Modal Action
export const AlertModalAction = AlertDialog.Action;
