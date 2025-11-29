import { forwardRef } from "react";
import * as RadixToolbar from "@radix-ui/react-toolbar";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { Separator } from "@radix-ui/themes";
import { cn } from "../utils";

// Toolbar Root
export interface ToolbarProps
  extends React.ComponentPropsWithoutRef<typeof RadixToolbar.Root> {
  size?: "sm" | "md" | "lg";
}

export const Toolbar = forwardRef<HTMLDivElement, ToolbarProps>(
  ({ className, size = "md", ...props }, ref) => {
    const sizeStyles = {
      sm: "h-8 px-1 gap-0.5",
      md: "h-10 px-2 gap-1",
      lg: "h-12 px-3 gap-1.5",
    };

    return (
      <RadixToolbar.Root
        ref={ref}
        className={cn(
          "flex items-center bg-[var(--gray-1)] border-b border-[var(--gray-6)]",
          sizeStyles[size],
          className
        )}
        {...props}
      />
    );
  }
);

Toolbar.displayName = "Toolbar";

// Toolbar Button
export interface ToolbarButtonProps
  extends React.ComponentPropsWithoutRef<typeof RadixToolbar.Button> {
  active?: boolean;
  size?: "sm" | "md" | "lg";
}

export const ToolbarButton = forwardRef<HTMLButtonElement, ToolbarButtonProps>(
  ({ className, active, size = "md", children, ...props }, ref) => {
    const sizeStyles = {
      sm: "h-6 w-6 text-xs",
      md: "h-7 w-7 text-sm",
      lg: "h-8 w-8 text-base",
    };

    return (
      <RadixToolbar.Button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md transition-colors",
          "hover:bg-[var(--gray-4)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-7)]",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          active && "bg-[var(--accent-3)] text-[var(--accent-11)]",
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {children}
      </RadixToolbar.Button>
    );
  }
);

ToolbarButton.displayName = "ToolbarButton";

// Toolbar Toggle Group
export interface ToolbarToggleGroupProps
  extends React.ComponentPropsWithoutRef<typeof ToggleGroup.Root> {
  size?: "sm" | "md" | "lg";
}

export const ToolbarToggleGroup = forwardRef<
  HTMLDivElement,
  ToolbarToggleGroupProps
>(({ className, children, ...props }, ref) => {
  return (
    <ToggleGroup.Root
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-md bg-[var(--gray-3)] p-0.5",
        className
      )}
      {...props}
    >
      {children}
    </ToggleGroup.Root>
  );
});

ToolbarToggleGroup.displayName = "ToolbarToggleGroup";

// Toolbar Toggle Item
export interface ToolbarToggleItemProps
  extends React.ComponentPropsWithoutRef<typeof ToggleGroup.Item> {
  size?: "sm" | "md" | "lg";
}

export const ToolbarToggleItem = forwardRef<
  HTMLButtonElement,
  ToolbarToggleItemProps
>(({ className, size = "md", children, ...props }, ref) => {
  const sizeStyles = {
    sm: "h-5 w-5 text-xs",
    md: "h-6 w-6 text-sm",
    lg: "h-7 w-7 text-base",
  };

  return (
    <ToggleGroup.Item
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded transition-colors",
        "hover:bg-[var(--gray-5)] focus:outline-none",
        "data-[state=on]:bg-[var(--accent-9)] data-[state=on]:text-white",
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </ToggleGroup.Item>
  );
});

ToolbarToggleItem.displayName = "ToolbarToggleItem";

// Toolbar Separator
export function ToolbarSeparator({ className }: { className?: string }) {
  return (
    <Separator orientation="vertical" className={cn("h-5 mx-1", className)} />
  );
}

// Toolbar Section
export interface ToolbarSectionProps {
  children: React.ReactNode;
  className?: string;
}

export function ToolbarSection({ children, className }: ToolbarSectionProps) {
  return (
    <div className={cn("flex items-center gap-0.5", className)}>{children}</div>
  );
}

// Re-export RadixToolbar for advanced use cases
export { RadixToolbar };
