import { forwardRef, useState, useCallback } from "react";
import { Box, ScrollArea } from "@radix-ui/themes";
import { cn } from "../utils";

// Sidebar Root
export interface SidebarProps {
  children: React.ReactNode;
  className?: string;
  defaultCollapsed?: boolean;
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  resizable?: boolean;
  position?: "left" | "right";
}

export function Sidebar({
  children,
  className,
  defaultCollapsed = false,
  collapsed: controlledCollapsed,
  onCollapsedChange,
  width = 280,
  minWidth = 200,
  maxWidth = 400,
  resizable = true,
  position = "left",
}: SidebarProps) {
  const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed);
  const [currentWidth, setCurrentWidth] = useState(width);
  const [isResizing, setIsResizing] = useState(false);

  const isCollapsed = controlledCollapsed ?? internalCollapsed;

  const toggleCollapsed = useCallback(() => {
    const newCollapsed = !isCollapsed;
    setInternalCollapsed(newCollapsed);
    onCollapsedChange?.(newCollapsed);
  }, [isCollapsed, onCollapsedChange]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!resizable) return;
      e.preventDefault();
      setIsResizing(true);

      const startX = e.clientX;
      const startWidth = currentWidth;

      const handleMouseMove = (e: MouseEvent) => {
        const delta =
          position === "left" ? e.clientX - startX : startX - e.clientX;
        const newWidth = Math.min(
          maxWidth,
          Math.max(minWidth, startWidth + delta)
        );
        setCurrentWidth(newWidth);
      };

      const handleMouseUp = () => {
        setIsResizing(false);
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [resizable, currentWidth, position, minWidth, maxWidth]
  );

  return (
    <Box
      className={cn(
        "flex flex-col bg-[var(--gray-2)] border-r border-[var(--gray-6)] transition-all duration-200",
        isCollapsed ? "w-12" : "",
        position === "right" && "border-r-0 border-l",
        className
      )}
      style={{ width: isCollapsed ? 48 : currentWidth }}
    >
      <ScrollArea className="flex-1">{children}</ScrollArea>

      {/* Resize Handle */}
      {resizable && !isCollapsed && (
        <div
          className={cn(
            "absolute top-0 bottom-0 w-1 cursor-col-resize hover:bg-[var(--accent-9)] transition-colors",
            position === "left" ? "right-0" : "left-0",
            isResizing && "bg-[var(--accent-9)]"
          )}
          onMouseDown={handleMouseDown}
        />
      )}

      {/* Collapse Toggle */}
      <SidebarContext.Provider value={{ isCollapsed, toggleCollapsed }}>
        {/* Context available to children */}
      </SidebarContext.Provider>
    </Box>
  );
}

// Sidebar Context
import { createContext, useContext } from "react";

interface SidebarContextValue {
  isCollapsed: boolean;
  toggleCollapsed: () => void;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a Sidebar");
  }
  return context;
}

// Sidebar Header
export interface SidebarHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function SidebarHeader({ children, className }: SidebarHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-center px-3 py-2 border-b border-[var(--gray-6)]",
        className
      )}
    >
      {children}
    </div>
  );
}

// Sidebar Content
export interface SidebarContentProps {
  children: React.ReactNode;
  className?: string;
}

export function SidebarContent({ children, className }: SidebarContentProps) {
  return <div className={cn("flex-1 p-2", className)}>{children}</div>;
}

// Sidebar Footer
export interface SidebarFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function SidebarFooter({ children, className }: SidebarFooterProps) {
  return (
    <div className={cn("px-3 py-2 border-t border-[var(--gray-6)]", className)}>
      {children}
    </div>
  );
}

// Sidebar Item
export interface SidebarItemProps {
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}

export function SidebarItem({
  children,
  className,
  icon,
  active,
  onClick,
}: SidebarItemProps) {
  return (
    <button
      className={cn(
        "flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm transition-colors text-left",
        "hover:bg-[var(--gray-4)]",
        active && "bg-[var(--accent-3)] text-[var(--accent-11)]",
        className
      )}
      onClick={onClick}
    >
      {icon && <span className="flex-shrink-0 w-4 h-4">{icon}</span>}
      <span className="truncate">{children}</span>
    </button>
  );
}

// Sidebar Section
export interface SidebarSectionProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export function SidebarSection({
  children,
  className,
  title,
}: SidebarSectionProps) {
  return (
    <div className={cn("mb-2", className)}>
      {title && (
        <div className="px-3 py-1 text-xs font-medium text-[var(--gray-11)] uppercase tracking-wide">
          {title}
        </div>
      )}
      {children}
    </div>
  );
}
