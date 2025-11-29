import { forwardRef } from "react";
import {
  Button as RadixButton,
  IconButton as RadixIconButton,
} from "@radix-ui/themes";
import { cn } from "../utils";

// Button Component
export interface ButtonProps
  extends React.ComponentPropsWithoutRef<typeof RadixButton> {
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      loading,
      leftIcon,
      rightIcon,
      fullWidth,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <RadixButton
        ref={ref}
        disabled={disabled || loading}
        className={cn(fullWidth && "w-full", className)}
        {...props}
      >
        {loading && <LoadingSpinner />}
        {!loading && leftIcon}
        {children}
        {!loading && rightIcon}
      </RadixButton>
    );
  }
);

Button.displayName = "Button";

// Icon Button Component
export interface IconButtonProps
  extends React.ComponentPropsWithoutRef<typeof RadixIconButton> {
  loading?: boolean;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ children, loading, disabled, ...props }, ref) => {
    return (
      <RadixIconButton ref={ref} disabled={disabled || loading} {...props}>
        {loading ? <LoadingSpinner /> : children}
      </RadixIconButton>
    );
  }
);

IconButton.displayName = "IconButton";

// Loading Spinner
function LoadingSpinner({ className }: { className?: string }) {
  return (
    <svg
      className={cn("animate-spin h-4 w-4", className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

// Button Group Component
export interface ButtonGroupProps {
  children: React.ReactNode;
  className?: string;
  orientation?: "horizontal" | "vertical";
}

export function ButtonGroup({
  children,
  className,
  orientation = "horizontal",
}: ButtonGroupProps) {
  return (
    <div
      className={cn(
        "inline-flex",
        orientation === "horizontal" ? "flex-row" : "flex-col",
        "[&>button]:rounded-none",
        orientation === "horizontal" &&
          "[&>button:first-child]:rounded-l-md [&>button:last-child]:rounded-r-md",
        orientation === "vertical" &&
          "[&>button:first-child]:rounded-t-md [&>button:last-child]:rounded-b-md",
        className
      )}
    >
      {children}
    </div>
  );
}
