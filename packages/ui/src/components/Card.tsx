import { forwardRef } from "react";
import { Card as RadixCard } from "@radix-ui/themes";
import { cn } from "../utils";

// Card
export interface CardProps
  extends React.ComponentPropsWithoutRef<typeof RadixCard> {
  variant?: "surface" | "classic" | "ghost";
  interactive?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "surface", interactive = false, ...props }, ref) => {
    return (
      <RadixCard
        ref={ref}
        variant={variant}
        className={cn(
          interactive && "cursor-pointer hover:shadow-md transition-shadow",
          className
        )}
        {...props}
      />
    );
  }
);

Card.displayName = "Card";

// Card Header
export interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function CardHeader({ children, className }: CardHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between mb-4", className)}>
      {children}
    </div>
  );
}

// Card Title
export interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

export function CardTitle({ children, className }: CardTitleProps) {
  return (
    <h3
      className={cn("text-lg font-semibold text-[var(--gray-12)]", className)}
    >
      {children}
    </h3>
  );
}

// Card Description
export interface CardDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export function CardDescription({ children, className }: CardDescriptionProps) {
  return (
    <p className={cn("text-sm text-[var(--gray-11)]", className)}>{children}</p>
  );
}

// Card Content
export interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export function CardContent({ children, className }: CardContentProps) {
  return <div className={cn("", className)}>{children}</div>;
}

// Card Footer
export interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function CardFooter({ children, className }: CardFooterProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-end gap-2 mt-4 pt-4 border-t border-[var(--gray-6)]",
        className
      )}
    >
      {children}
    </div>
  );
}

// File Card (for Drive)
export interface FileCardProps {
  name: string;
  type:
    | "folder"
    | "document"
    | "spreadsheet"
    | "presentation"
    | "image"
    | "other";
  icon?: React.ReactNode;
  selected?: boolean;
  onClick?: () => void;
  onDoubleClick?: () => void;
  className?: string;
}

export function FileCard({
  name,
  type,
  icon,
  selected,
  onClick,
  onDoubleClick,
  className,
}: FileCardProps) {
  const typeColors = {
    folder: "text-yellow-500",
    document: "text-blue-600",
    spreadsheet: "text-green-600",
    presentation: "text-orange-500",
    image: "text-purple-500",
    other: "text-gray-500",
  };

  return (
    <div
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      className={cn(
        "flex flex-col items-center p-4 rounded-lg cursor-pointer transition-colors",
        "hover:bg-[var(--gray-3)]",
        selected && "bg-[var(--accent-3)] ring-2 ring-[var(--accent-9)]",
        className
      )}
    >
      <div className={cn("w-12 h-12 mb-2", typeColors[type])}>{icon}</div>
      <span className="text-sm text-center truncate w-full" title={name}>
        {name}
      </span>
    </div>
  );
}

// Stat Card
export interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon?: React.ReactNode;
  className?: string;
}

export function StatCard({
  title,
  value,
  change,
  changeType = "neutral",
  icon,
  className,
}: StatCardProps) {
  const changeColors = {
    positive: "text-green-600",
    negative: "text-red-600",
    neutral: "text-[var(--gray-11)]",
  };

  return (
    <Card className={cn("p-4", className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-[var(--gray-11)]">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {change && (
            <p className={cn("text-sm mt-1", changeColors[changeType])}>
              {change}
            </p>
          )}
        </div>
        {icon && (
          <div className="w-10 h-10 bg-[var(--accent-3)] rounded-lg flex items-center justify-center text-[var(--accent-9)]">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}
