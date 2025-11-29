import { forwardRef } from "react";
import * as RadixDropdown from "@radix-ui/react-dropdown-menu";
import {
  CheckIcon,
  ChevronRightIcon,
  DotFilledIcon,
} from "@radix-ui/react-icons";
import { cn } from "../utils";

// Dropdown Menu Root
export const DropdownMenu = RadixDropdown.Root;

// Dropdown Menu Trigger
export const DropdownMenuTrigger = RadixDropdown.Trigger;

// Dropdown Menu Content
export interface DropdownMenuContentProps
  extends React.ComponentPropsWithoutRef<typeof RadixDropdown.Content> {
  className?: string;
}

export const DropdownMenuContent = forwardRef<
  HTMLDivElement,
  DropdownMenuContentProps
>(({ className, children, sideOffset = 4, ...props }, ref) => {
  return (
    <RadixDropdown.Portal>
      <RadixDropdown.Content
        ref={ref}
        sideOffset={sideOffset}
        className={cn(
          "min-w-[180px] bg-[var(--color-panel-solid)] rounded-md shadow-lg border border-[var(--gray-6)] p-1 z-50",
          "data-[state=open]:animate-fadeIn",
          className
        )}
        {...props}
      >
        {children}
      </RadixDropdown.Content>
    </RadixDropdown.Portal>
  );
});

DropdownMenuContent.displayName = "DropdownMenuContent";

// Dropdown Menu Item
export interface DropdownMenuItemProps
  extends React.ComponentPropsWithoutRef<typeof RadixDropdown.Item> {
  icon?: React.ReactNode;
  shortcut?: string;
  destructive?: boolean;
}

export const DropdownMenuItem = forwardRef<
  HTMLDivElement,
  DropdownMenuItemProps
>(
  (
    { className, children, icon, shortcut, destructive, disabled, ...props },
    ref
  ) => {
    return (
      <RadixDropdown.Item
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
          <span className="text-xs text-[var(--gray-11)] data-[highlighted]:text-white/70 ml-auto pl-4">
            {shortcut}
          </span>
        )}
      </RadixDropdown.Item>
    );
  }
);

DropdownMenuItem.displayName = "DropdownMenuItem";

// Dropdown Menu Checkbox Item
export interface DropdownMenuCheckboxItemProps
  extends React.ComponentPropsWithoutRef<typeof RadixDropdown.CheckboxItem> {
  className?: string;
}

export const DropdownMenuCheckboxItem = forwardRef<
  HTMLDivElement,
  DropdownMenuCheckboxItemProps
>(({ className, children, checked, ...props }, ref) => {
  return (
    <RadixDropdown.CheckboxItem
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
        <RadixDropdown.ItemIndicator>
          <CheckIcon />
        </RadixDropdown.ItemIndicator>
      </span>
      {children}
    </RadixDropdown.CheckboxItem>
  );
});

DropdownMenuCheckboxItem.displayName = "DropdownMenuCheckboxItem";

// Dropdown Menu Radio Group
export const DropdownMenuRadioGroup = RadixDropdown.RadioGroup;

// Dropdown Menu Radio Item
export interface DropdownMenuRadioItemProps
  extends React.ComponentPropsWithoutRef<typeof RadixDropdown.RadioItem> {
  className?: string;
}

export const DropdownMenuRadioItem = forwardRef<
  HTMLDivElement,
  DropdownMenuRadioItemProps
>(({ className, children, ...props }, ref) => {
  return (
    <RadixDropdown.RadioItem
      ref={ref}
      className={cn(
        "flex items-center gap-2 px-2 py-1.5 text-sm rounded cursor-pointer outline-none",
        "data-[highlighted]:bg-[var(--accent-9)] data-[highlighted]:text-white",
        className
      )}
      {...props}
    >
      <span className="w-4 h-4 flex items-center justify-center">
        <RadixDropdown.ItemIndicator>
          <DotFilledIcon />
        </RadixDropdown.ItemIndicator>
      </span>
      {children}
    </RadixDropdown.RadioItem>
  );
});

DropdownMenuRadioItem.displayName = "DropdownMenuRadioItem";

// Dropdown Menu Sub
export const DropdownMenuSub = RadixDropdown.Sub;

// Dropdown Menu Sub Trigger
export interface DropdownMenuSubTriggerProps
  extends React.ComponentPropsWithoutRef<typeof RadixDropdown.SubTrigger> {
  icon?: React.ReactNode;
}

export const DropdownMenuSubTrigger = forwardRef<
  HTMLDivElement,
  DropdownMenuSubTriggerProps
>(({ className, children, icon, ...props }, ref) => {
  return (
    <RadixDropdown.SubTrigger
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
    </RadixDropdown.SubTrigger>
  );
});

DropdownMenuSubTrigger.displayName = "DropdownMenuSubTrigger";

// Dropdown Menu Sub Content
export interface DropdownMenuSubContentProps
  extends React.ComponentPropsWithoutRef<typeof RadixDropdown.SubContent> {
  className?: string;
}

export const DropdownMenuSubContent = forwardRef<
  HTMLDivElement,
  DropdownMenuSubContentProps
>(({ className, children, ...props }, ref) => {
  return (
    <RadixDropdown.Portal>
      <RadixDropdown.SubContent
        ref={ref}
        className={cn(
          "min-w-[180px] bg-white rounded-md shadow-lg border border-[var(--gray-6)] p-1 z-50",
          "data-[state=open]:animate-fadeIn",
          className
        )}
        {...props}
      >
        {children}
      </RadixDropdown.SubContent>
    </RadixDropdown.Portal>
  );
});

DropdownMenuSubContent.displayName = "DropdownMenuSubContent";

// Dropdown Menu Separator
export function DropdownMenuSeparator({ className }: { className?: string }) {
  return (
    <RadixDropdown.Separator
      className={cn("h-px my-1 bg-[var(--gray-6)]", className)}
    />
  );
}

// Dropdown Menu Label
export function DropdownMenuLabel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <RadixDropdown.Label
      className={cn(
        "px-2 py-1 text-xs font-medium text-[var(--gray-11)]",
        className
      )}
    >
      {children}
    </RadixDropdown.Label>
  );
}

// Dropdown Menu Group
export const DropdownMenuGroup = RadixDropdown.Group;
