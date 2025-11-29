import { forwardRef } from "react";
import * as RadixContextMenu from "@radix-ui/react-context-menu";
import {
  CheckIcon,
  ChevronRightIcon,
  DotFilledIcon,
} from "@radix-ui/react-icons";
import { cn } from "../utils";

// Context Menu Root
export const ContextMenu = RadixContextMenu.Root;

// Context Menu Trigger
export const ContextMenuTrigger = RadixContextMenu.Trigger;

// Context Menu Content
export interface ContextMenuContentProps
  extends React.ComponentPropsWithoutRef<typeof RadixContextMenu.Content> {
  className?: string;
}

export const ContextMenuContent = forwardRef<
  HTMLDivElement,
  ContextMenuContentProps
>(({ className, children, ...props }, ref) => {
  return (
    <RadixContextMenu.Portal>
      <RadixContextMenu.Content
        ref={ref}
        className={cn(
          "min-w-[180px] bg-[var(--color-panel-solid)] rounded-md shadow-lg border border-[var(--gray-6)] p-1",
          "data-[state=open]:animate-fadeIn",
          className
        )}
        {...props}
      >
        {children}
      </RadixContextMenu.Content>
    </RadixContextMenu.Portal>
  );
});

ContextMenuContent.displayName = "ContextMenuContent";

// Context Menu Item
export interface ContextMenuItemProps
  extends React.ComponentPropsWithoutRef<typeof RadixContextMenu.Item> {
  icon?: React.ReactNode;
  shortcut?: string;
  destructive?: boolean;
}

export const ContextMenuItem = forwardRef<HTMLDivElement, ContextMenuItemProps>(
  (
    { className, children, icon, shortcut, destructive, disabled, ...props },
    ref
  ) => {
    return (
      <RadixContextMenu.Item
        ref={ref}
        disabled={disabled}
        className={cn(
          "flex items-center gap-2 px-2 py-1.5 text-sm rounded cursor-pointer outline-none",
          "data-[highlighted]:bg-[var(--accent-9)] data-[highlighted]:text-white",
          "data-[disabled]:text-[var(--gray-8)] data-[disabled]:pointer-events-none",
          destructive && "text-red-600 data-[highlighted]:bg-red-600",
          className
        )}
        {...props}
      >
        {icon && <span className="w-4 h-4 flex-shrink-0">{icon}</span>}
        <span className="flex-1">{children}</span>
        {shortcut && (
          <span className="text-xs text-[var(--gray-11)] data-[highlighted]:text-white/70 ml-auto">
            {shortcut}
          </span>
        )}
      </RadixContextMenu.Item>
    );
  }
);

ContextMenuItem.displayName = "ContextMenuItem";

// Context Menu Checkbox Item
export interface ContextMenuCheckboxItemProps
  extends React.ComponentPropsWithoutRef<typeof RadixContextMenu.CheckboxItem> {
  className?: string;
}

export const ContextMenuCheckboxItem = forwardRef<
  HTMLDivElement,
  ContextMenuCheckboxItemProps
>(({ className, children, checked, ...props }, ref) => {
  return (
    <RadixContextMenu.CheckboxItem
      ref={ref}
      checked={checked}
      className={cn(
        "flex items-center gap-2 px-2 py-1.5 text-sm rounded cursor-pointer outline-none",
        "data-[highlighted]:bg-[var(--accent-9)] data-[highlighted]:text-white",
        className
      )}
      {...props}
    >
      <span className="w-4 h-4 flex items-center justify-center">
        <RadixContextMenu.ItemIndicator>
          <CheckIcon />
        </RadixContextMenu.ItemIndicator>
      </span>
      {children}
    </RadixContextMenu.CheckboxItem>
  );
});

ContextMenuCheckboxItem.displayName = "ContextMenuCheckboxItem";

// Context Menu Radio Group
export const ContextMenuRadioGroup = RadixContextMenu.RadioGroup;

// Context Menu Radio Item
export interface ContextMenuRadioItemProps
  extends React.ComponentPropsWithoutRef<typeof RadixContextMenu.RadioItem> {
  className?: string;
}

export const ContextMenuRadioItem = forwardRef<
  HTMLDivElement,
  ContextMenuRadioItemProps
>(({ className, children, ...props }, ref) => {
  return (
    <RadixContextMenu.RadioItem
      ref={ref}
      className={cn(
        "flex items-center gap-2 px-2 py-1.5 text-sm rounded cursor-pointer outline-none",
        "data-[highlighted]:bg-[var(--accent-9)] data-[highlighted]:text-white",
        className
      )}
      {...props}
    >
      <span className="w-4 h-4 flex items-center justify-center">
        <RadixContextMenu.ItemIndicator>
          <DotFilledIcon />
        </RadixContextMenu.ItemIndicator>
      </span>
      {children}
    </RadixContextMenu.RadioItem>
  );
});

ContextMenuRadioItem.displayName = "ContextMenuRadioItem";

// Context Menu Sub
export const ContextMenuSub = RadixContextMenu.Sub;

// Context Menu Sub Trigger
export interface ContextMenuSubTriggerProps
  extends React.ComponentPropsWithoutRef<typeof RadixContextMenu.SubTrigger> {
  icon?: React.ReactNode;
}

export const ContextMenuSubTrigger = forwardRef<
  HTMLDivElement,
  ContextMenuSubTriggerProps
>(({ className, children, icon, ...props }, ref) => {
  return (
    <RadixContextMenu.SubTrigger
      ref={ref}
      className={cn(
        "flex items-center gap-2 px-2 py-1.5 text-sm rounded cursor-pointer outline-none",
        "data-[state=open]:bg-[var(--gray-4)]",
        "data-[highlighted]:bg-[var(--accent-9)] data-[highlighted]:text-white",
        className
      )}
      {...props}
    >
      {icon && <span className="w-4 h-4 flex-shrink-0">{icon}</span>}
      <span className="flex-1">{children}</span>
      <ChevronRightIcon className="ml-auto" />
    </RadixContextMenu.SubTrigger>
  );
});

ContextMenuSubTrigger.displayName = "ContextMenuSubTrigger";

// Context Menu Sub Content
export interface ContextMenuSubContentProps
  extends React.ComponentPropsWithoutRef<typeof RadixContextMenu.SubContent> {
  className?: string;
}

export const ContextMenuSubContent = forwardRef<
  HTMLDivElement,
  ContextMenuSubContentProps
>(({ className, children, ...props }, ref) => {
  return (
    <RadixContextMenu.Portal>
      <RadixContextMenu.SubContent
        ref={ref}
        className={cn(
          "min-w-[180px] bg-white rounded-md shadow-lg border border-[var(--gray-6)] p-1",
          "data-[state=open]:animate-fadeIn",
          className
        )}
        {...props}
      >
        {children}
      </RadixContextMenu.SubContent>
    </RadixContextMenu.Portal>
  );
});

ContextMenuSubContent.displayName = "ContextMenuSubContent";

// Context Menu Separator
export function ContextMenuSeparator({ className }: { className?: string }) {
  return (
    <RadixContextMenu.Separator
      className={cn("h-px my-1 bg-[var(--gray-6)]", className)}
    />
  );
}

// Context Menu Label
export function ContextMenuLabel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <RadixContextMenu.Label
      className={cn(
        "px-2 py-1 text-xs font-medium text-[var(--gray-11)]",
        className
      )}
    >
      {children}
    </RadixContextMenu.Label>
  );
}
