import { forwardRef } from "react";
import * as RadixTabs from "@radix-ui/react-tabs";
import { cn } from "../utils";

// Tabs Root
export interface TabsProps
  extends React.ComponentPropsWithoutRef<typeof RadixTabs.Root> {
  className?: string;
}

export const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  ({ className, ...props }, ref) => {
    return (
      <RadixTabs.Root
        ref={ref}
        className={cn("flex flex-col", className)}
        {...props}
      />
    );
  }
);

Tabs.displayName = "Tabs";

// Tabs List
export interface TabsListProps
  extends React.ComponentPropsWithoutRef<typeof RadixTabs.List> {
  className?: string;
  variant?: "default" | "pills" | "underline";
}

export const TabsList = forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const variantStyles = {
      default: "bg-[var(--gray-3)] p-1 rounded-lg",
      pills: "gap-2",
      underline: "border-b border-[var(--gray-6)]",
    };

    return (
      <RadixTabs.List
        ref={ref}
        className={cn(
          "flex items-center shrink-0",
          variantStyles[variant],
          className
        )}
        {...props}
      />
    );
  }
);

TabsList.displayName = "TabsList";

// Tabs Trigger
export interface TabsTriggerProps
  extends React.ComponentPropsWithoutRef<typeof RadixTabs.Trigger> {
  className?: string;
  variant?: "default" | "pills" | "underline";
  icon?: React.ReactNode;
}

export const TabsTrigger = forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, variant = "default", icon, children, ...props }, ref) => {
    const variantStyles = {
      default: [
        "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
        "data-[state=active]:bg-white data-[state=active]:shadow-sm",
        "text-[var(--gray-11)] data-[state=active]:text-[var(--gray-12)]",
      ].join(" "),
      pills: [
        "px-4 py-2 rounded-full text-sm font-medium transition-colors",
        "data-[state=active]:bg-[var(--accent-9)] data-[state=active]:text-white",
        "text-[var(--gray-11)] hover:bg-[var(--gray-4)]",
      ].join(" "),
      underline: [
        "px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px",
        "border-transparent data-[state=active]:border-[var(--accent-9)]",
        "text-[var(--gray-11)] data-[state=active]:text-[var(--accent-9)]",
      ].join(" "),
    };

    return (
      <RadixTabs.Trigger
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 outline-none",
          "focus-visible:ring-2 focus-visible:ring-[var(--accent-7)] focus-visible:ring-offset-1",
          "disabled:opacity-50 disabled:pointer-events-none",
          variantStyles[variant],
          className
        )}
        {...props}
      >
        {icon && <span className="w-4 h-4">{icon}</span>}
        {children}
      </RadixTabs.Trigger>
    );
  }
);

TabsTrigger.displayName = "TabsTrigger";

// Tabs Content
export interface TabsContentProps
  extends React.ComponentPropsWithoutRef<typeof RadixTabs.Content> {
  className?: string;
}

export const TabsContent = forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, ...props }, ref) => {
    return (
      <RadixTabs.Content
        ref={ref}
        className={cn(
          "flex-1 outline-none",
          "data-[state=inactive]:hidden",
          className
        )}
        {...props}
      />
    );
  }
);

TabsContent.displayName = "TabsContent";
