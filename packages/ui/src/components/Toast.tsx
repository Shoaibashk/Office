import { useEffect } from "react";
import * as RadixToast from "@radix-ui/react-toast";
import {
  Cross2Icon,
  CheckCircledIcon,
  ExclamationTriangleIcon,
  InfoCircledIcon,
  CrossCircledIcon,
} from "@radix-ui/react-icons";
import { cn } from "../utils";

// Toast Provider
export interface ToastProviderProps {
  children: React.ReactNode;
  duration?: number;
}

export function ToastProvider({
  children,
  duration = 5000,
}: ToastProviderProps) {
  return (
    <RadixToast.Provider duration={duration}>
      {children}
      <ToastViewport />
    </RadixToast.Provider>
  );
}

// Toast Viewport
export function ToastViewport({ className }: { className?: string }) {
  return (
    <RadixToast.Viewport
      className={cn(
        "fixed bottom-0 right-0 flex flex-col gap-2 w-96 max-w-[100vw] p-4 z-[100] outline-none",
        className
      )}
    />
  );
}

// Toast types
export type ToastVariant = "default" | "success" | "error" | "warning" | "info";

// Toast
export interface ToastProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  variant?: ToastVariant;
  action?: {
    label: string;
    onClick: () => void;
  };
  duration?: number;
}

export function Toast({
  open,
  onOpenChange,
  title,
  description,
  variant = "default",
  action,
  duration,
}: ToastProps) {
  const variantStyles = {
    default: "bg-white border-[var(--gray-6)]",
    success: "bg-green-50 border-green-200",
    error: "bg-red-50 border-red-200",
    warning: "bg-yellow-50 border-yellow-200",
    info: "bg-blue-50 border-blue-200",
  };

  const variantIcons = {
    default: null,
    success: <CheckCircledIcon className="w-5 h-5 text-green-600" />,
    error: <CrossCircledIcon className="w-5 h-5 text-red-600" />,
    warning: <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600" />,
    info: <InfoCircledIcon className="w-5 h-5 text-blue-600" />,
  };

  return (
    <RadixToast.Root
      open={open}
      onOpenChange={onOpenChange}
      duration={duration}
      className={cn(
        "p-4 rounded-lg shadow-lg border",
        "data-[state=open]:animate-slideIn",
        "data-[state=closed]:animate-hide",
        "data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)]",
        "data-[swipe=cancel]:translate-x-0",
        "data-[swipe=end]:animate-swipeOut",
        variantStyles[variant]
      )}
    >
      <div className="flex gap-3">
        {variantIcons[variant] && (
          <div className="flex-shrink-0">{variantIcons[variant]}</div>
        )}
        <div className="flex-1">
          <RadixToast.Title className="font-medium text-[var(--gray-12)]">
            {title}
          </RadixToast.Title>
          {description && (
            <RadixToast.Description className="mt-1 text-sm text-[var(--gray-11)]">
              {description}
            </RadixToast.Description>
          )}
          {action && (
            <RadixToast.Action asChild altText={action.label}>
              <button
                onClick={action.onClick}
                className="mt-2 text-sm font-medium text-[var(--accent-9)] hover:underline"
              >
                {action.label}
              </button>
            </RadixToast.Action>
          )}
        </div>
        <RadixToast.Close asChild>
          <button
            className="flex-shrink-0 p-1 rounded hover:bg-black/5"
            aria-label="Close"
          >
            <Cross2Icon />
          </button>
        </RadixToast.Close>
      </div>
    </RadixToast.Root>
  );
}

// useToast hook for imperative toast creation
import { useState, useCallback, createContext, useContext } from "react";

interface ToastItem {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
  action?: { label: string; onClick: () => void };
  duration?: number;
}

interface ToastContextValue {
  toasts: ToastItem[];
  addToast: (toast: Omit<ToastItem, "id">) => string;
  removeToast: (id: string) => void;
  success: (title: string, description?: string) => string;
  error: (title: string, description?: string) => string;
  warning: (title: string, description?: string) => string;
  info: (title: string, description?: string) => string;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback((toast: Omit<ToastItem, "id">) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const success = useCallback(
    (title: string, description?: string) =>
      addToast({ title, description, variant: "success" }),
    [addToast]
  );

  const error = useCallback(
    (title: string, description?: string) =>
      addToast({ title, description, variant: "error" }),
    [addToast]
  );

  const warning = useCallback(
    (title: string, description?: string) =>
      addToast({ title, description, variant: "warning" }),
    [addToast]
  );

  const info = useCallback(
    (title: string, description?: string) =>
      addToast({ title, description, variant: "info" }),
    [addToast]
  );

  return (
    <ToastContext.Provider
      value={{ toasts, addToast, removeToast, success, error, warning, info }}
    >
      <ToastProvider>
        {children}
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            open={true}
            onOpenChange={(open) => !open && removeToast(toast.id)}
            {...toast}
          />
        ))}
      </ToastProvider>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastContextProvider");
  }
  return context;
}
