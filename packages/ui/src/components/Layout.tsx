import { forwardRef } from "react";
import { Box, Flex, Container } from "@radix-ui/themes";
import { cn } from "../utils";

// App Layout - Main layout wrapper for the entire application
export interface AppLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function AppLayout({ children, className }: AppLayoutProps) {
  return (
    <Flex
      direction="column"
      className={cn("h-screen w-screen overflow-hidden", className)}
    >
      {children}
    </Flex>
  );
}

// App Header
export interface AppHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function AppHeader({ children, className }: AppHeaderProps) {
  return (
    <Box
      className={cn(
        "flex items-center h-12 px-4 bg-[var(--accent-9)] text-white shrink-0",
        className
      )}
    >
      {children}
    </Box>
  );
}

// App Logo
export interface AppLogoProps {
  children?: React.ReactNode;
  className?: string;
  appName?: string;
  icon?: React.ReactNode;
}

export function AppLogo({ children, className, appName, icon }: AppLogoProps) {
  return (
    <Flex align="center" gap="2" className={cn("font-semibold", className)}>
      {icon && <span className="w-6 h-6">{icon}</span>}
      {appName && <span>{appName}</span>}
      {children}
    </Flex>
  );
}

// App Title Bar (editable document title)
export interface AppTitleBarProps {
  title: string;
  onTitleChange?: (title: string) => void;
  editable?: boolean;
  className?: string;
}

export function AppTitleBar({
  title,
  onTitleChange,
  editable = true,
  className,
}: AppTitleBarProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.currentTarget.blur();
    }
  };

  if (!editable) {
    return <span className={cn("text-sm", className)}>{title}</span>;
  }

  return (
    <input
      type="text"
      value={title}
      onChange={(e) => onTitleChange?.(e.target.value)}
      onKeyDown={handleKeyDown}
      className={cn(
        "bg-transparent border-none text-sm text-inherit focus:outline-none focus:ring-1 focus:ring-white/30 rounded px-2 py-1",
        className
      )}
    />
  );
}

// App Body - Contains sidebar and main content
export interface AppBodyProps {
  children: React.ReactNode;
  className?: string;
}

export function AppBody({ children, className }: AppBodyProps) {
  return (
    <Flex className={cn("flex-1 overflow-hidden", className)}>{children}</Flex>
  );
}

// Main Content Area
export interface MainContentProps {
  children: React.ReactNode;
  className?: string;
}

export const MainContent = forwardRef<HTMLDivElement, MainContentProps>(
  ({ children, className }, ref) => {
    return (
      <Box
        ref={ref}
        className={cn("flex-1 overflow-auto bg-[var(--gray-1)]", className)}
      >
        {children}
      </Box>
    );
  }
);

MainContent.displayName = "MainContent";

// Panel - Flexible container
export interface PanelProps {
  children: React.ReactNode;
  className?: string;
}

export function Panel({ children, className }: PanelProps) {
  return (
    <Box
      className={cn(
        "bg-white border border-[var(--gray-6)] rounded-lg shadow-sm",
        className
      )}
    >
      {children}
    </Box>
  );
}

// Panel Header
export interface PanelHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function PanelHeader({ children, className }: PanelHeaderProps) {
  return (
    <Flex
      align="center"
      justify="between"
      className={cn("px-4 py-3 border-b border-[var(--gray-6)]", className)}
    >
      {children}
    </Flex>
  );
}

// Panel Content
export interface PanelContentProps {
  children: React.ReactNode;
  className?: string;
  padding?: boolean;
}

export function PanelContent({
  children,
  className,
  padding = true,
}: PanelContentProps) {
  return <Box className={cn(padding && "p-4", className)}>{children}</Box>;
}

// Status Bar
export interface StatusBarProps {
  children: React.ReactNode;
  className?: string;
}

export function StatusBar({ children, className }: StatusBarProps) {
  return (
    <Flex
      align="center"
      className={cn(
        "h-6 px-4 bg-[var(--gray-2)] border-t border-[var(--gray-6)] text-xs text-[var(--gray-11)] shrink-0",
        className
      )}
    >
      {children}
    </Flex>
  );
}

// Status Bar Item
export interface StatusBarItemProps {
  children: React.ReactNode;
  className?: string;
}

export function StatusBarItem({ children, className }: StatusBarItemProps) {
  return (
    <Flex align="center" gap="1" className={cn("px-2", className)}>
      {children}
    </Flex>
  );
}

// Google Docs–style shell components

export interface DocsShellProps {
  children: React.ReactNode;
  className?: string;
}

// Full viewport background similar to Docs (light gray canvas)
export function DocsShell({ children, className }: DocsShellProps) {
  return (
    <Flex
      direction="column"
      className={cn(
        "h-screen w-screen overflow-hidden bg-(--gray-2) text-(--gray-12)",
        className
      )}
    >
      {children}
    </Flex>
  );
}

export interface DocsHeaderProps {
  left?: React.ReactNode;
  center?: React.ReactNode;
  right?: React.ReactNode;
  className?: string;
}

// Top Docs bar (logo + title + actions)
export function DocsHeader({
  left,
  center,
  right,
  className,
}: DocsHeaderProps) {
  return (
    <Flex
      align="center"
      justify="between"
      className={cn(
        "h-12 px-3 bg-white border-b border-(--gray-5) shrink-0",
        className
      )}
    >
      <Flex align="center" gap="3" className="min-w-0 flex-1">
        {left}
      </Flex>
      <Flex align="center" justify="center" className="flex-1 min-w-0">
        {center}
      </Flex>
      <Flex align="center" gap="2" justify="end" className="flex-1">
        {right}
      </Flex>
    </Flex>
  );
}

export interface DocsMenuBarProps {
  children: React.ReactNode;
  className?: string;
}

// Text-based menu row (File / Edit / View ...)
export function DocsMenuBar({ children, className }: DocsMenuBarProps) {
  return (
    <Flex
      align="center"
      gap="3"
      className={cn(
        "h-8 px-3 text-xs bg-white border-b border-(--gray-5) text-(--gray-12)",
        className
      )}
    >
      {children}
    </Flex>
  );
}

export interface DocsMenuItemProps {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

export function DocsMenuItem({
  children,
  active,
  onClick,
  className,
}: DocsMenuItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "px-1 py-0.5 rounded text-xs font-medium",
        "hover:bg-(--gray-3) focus:outline-none",
        active && "text-(--accent-11)",
        className
      )}
    >
      {children}
    </button>
  );
}

export interface DocsCanvasProps {
  children: React.ReactNode;
  className?: string;
}

// Scrollable background that centers a page
export function DocsCanvas({ children, className }: DocsCanvasProps) {
  return (
    <Box
      className={cn(
        "flex-1 overflow-auto flex justify-center items-start px-4 py-6 bg-(--gray-2)",
        className
      )}
    >
      {children}
    </Box>
  );
}

export interface DocsPageProps {
  children: React.ReactNode;
  className?: string;
}

// White page with shadow, similar to a Google Docs sheet
export function DocsPage({ children, className }: DocsPageProps) {
  return (
    <Box
      className={cn(
        "bg-white shadow-sm rounded-sm border border-(--gray-4) w-[8.27in] min-h-[11.69in] px-12 py-10",
        className
      )}
    >
      {children}
    </Box>
  );
}

// Re-export Radix layout primitives
export { Box, Flex, Container } from "@radix-ui/themes";
