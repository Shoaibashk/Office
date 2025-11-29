import { forwardRef } from "react";
import * as RadixTooltip from "@radix-ui/react-tooltip";
import { cn } from "../utils";

// Tooltip Provider (wrap app root)
export const TooltipProvider = RadixTooltip.Provider;

// Tooltip Root
export const Tooltip = RadixTooltip.Root;

// Tooltip Trigger
export const TooltipTrigger = RadixTooltip.Trigger;

// Tooltip Content
export interface TooltipContentProps
  extends React.ComponentPropsWithoutRef<typeof RadixTooltip.Content> {
  className?: string;
}

export const TooltipContent = forwardRef<HTMLDivElement, TooltipContentProps>(
  ({ className, sideOffset = 4, children, ...props }, ref) => {
    return (
      <RadixTooltip.Portal>
        <RadixTooltip.Content
          ref={ref}
          sideOffset={sideOffset}
          className={cn(
            "z-50 px-3 py-1.5 text-sm bg-[var(--gray-12)] text-white rounded-md shadow-md",
            "data-[state=delayed-open]:animate-fadeIn",
            "data-[state=closed]:animate-fadeOut",
            className
          )}
          {...props}
        >
          {children}
          <RadixTooltip.Arrow className="fill-[var(--gray-12)]" />
        </RadixTooltip.Content>
      </RadixTooltip.Portal>
    );
  }
);

TooltipContent.displayName = "TooltipContent";

// Simple Tooltip wrapper
export interface SimpleTooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  delayDuration?: number;
  className?: string;
}

export function SimpleTooltip({
  content,
  children,
  side = "top",
  delayDuration = 200,
  className,
}: SimpleTooltipProps) {
  return (
    <Tooltip delayDuration={delayDuration}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side={side} className={className}>
        {content}
      </TooltipContent>
    </Tooltip>
  );
}

// Keyboard Shortcut Tooltip
export interface ShortcutTooltipProps {
  label: string;
  shortcut?: string[];
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
}

export function ShortcutTooltip({
  label,
  shortcut,
  children,
  side = "bottom",
}: ShortcutTooltipProps) {
  return (
    <Tooltip delayDuration={400}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side={side}>
        <div className="flex items-center gap-2">
          <span>{label}</span>
          {shortcut && shortcut.length > 0 && (
            <kbd className="px-1.5 py-0.5 bg-white/20 rounded text-xs">
              {shortcut.join("+")}
            </kbd>
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
