import { forwardRef } from "react";
import {
  TextField,
  TextArea,
  Select as RadixSelect,
  Checkbox as RadixCheckbox,
  Switch as RadixSwitch,
} from "@radix-ui/themes";
import { cn } from "../utils";

// Input
export interface InputProps
  extends React.ComponentPropsWithoutRef<typeof TextField.Root> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { className, label, error, helperText, leftIcon, rightIcon, ...props },
    ref
  ) => {
    return (
      <div className={cn("flex flex-col gap-1", className)}>
        {label && (
          <label className="text-sm font-medium text-[var(--gray-12)]">
            {label}
          </label>
        )}
        <TextField.Root ref={ref} {...props}>
          {leftIcon && <TextField.Slot>{leftIcon}</TextField.Slot>}
          {rightIcon && (
            <TextField.Slot side="right">{rightIcon}</TextField.Slot>
          )}
        </TextField.Root>
        {helperText && !error && (
          <span className="text-xs text-[var(--gray-11)]">{helperText}</span>
        )}
        {error && <span className="text-xs text-red-600">{error}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";

// TextArea
export interface TextAreaProps
  extends React.ComponentPropsWithoutRef<typeof TextArea> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, label, error, helperText, ...props }, ref) => {
    return (
      <div className={cn("flex flex-col gap-1", className)}>
        {label && (
          <label className="text-sm font-medium text-[var(--gray-12)]">
            {label}
          </label>
        )}
        <TextArea ref={ref} {...props} />
        {helperText && !error && (
          <span className="text-xs text-[var(--gray-11)]">{helperText}</span>
        )}
        {error && <span className="text-xs text-red-600">{error}</span>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

// Select
export interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  options: { value: string; label: string; disabled?: boolean }[];
  label?: string;
  error?: string;
  className?: string;
  disabled?: boolean;
}

export function Select({
  value,
  onValueChange,
  placeholder = "Select...",
  options,
  label,
  error,
  className,
  disabled,
}: SelectProps) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {label && (
        <label className="text-sm font-medium text-[var(--gray-12)]">
          {label}
        </label>
      )}
      <RadixSelect.Root
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
      >
        <RadixSelect.Trigger placeholder={placeholder} />
        <RadixSelect.Content>
          {options.map((option) => (
            <RadixSelect.Item
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </RadixSelect.Item>
          ))}
        </RadixSelect.Content>
      </RadixSelect.Root>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}

// Checkbox
export interface CheckboxProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export function Checkbox({
  checked,
  onCheckedChange,
  label,
  disabled,
  className,
}: CheckboxProps) {
  return (
    <label
      className={cn(
        "flex items-center gap-2 cursor-pointer",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      <RadixCheckbox
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
      />
      {label && <span className="text-sm">{label}</span>}
    </label>
  );
}

// Switch
export interface SwitchProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export function Switch({
  checked,
  onCheckedChange,
  label,
  disabled,
  className,
}: SwitchProps) {
  return (
    <label
      className={cn(
        "flex items-center gap-2 cursor-pointer",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      <RadixSwitch
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
      />
      {label && <span className="text-sm">{label}</span>}
    </label>
  );
}

// Search Input
export interface SearchInputProps extends Omit<InputProps, "leftIcon"> {
  onSearch?: (value: string) => void;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ onSearch, ...props }, ref) => {
    return (
      <Input
        ref={ref}
        type="search"
        leftIcon={
          <svg
            className="w-4 h-4 text-[var(--gray-9)]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        }
        {...props}
      />
    );
  }
);

SearchInput.displayName = "SearchInput";

// Color Picker Input
export interface ColorInputProps {
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  className?: string;
}

export function ColorInput({
  value = "#000000",
  onChange,
  label,
  className,
}: ColorInputProps) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {label && (
        <label className="text-sm font-medium text-[var(--gray-12)]">
          {label}
        </label>
      )}
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="w-8 h-8 rounded border border-[var(--gray-6)] cursor-pointer"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="flex-1 px-2 py-1 text-sm border border-[var(--gray-6)] rounded focus:outline-none focus:ring-2 focus:ring-[var(--accent-7)]"
        />
      </div>
    </div>
  );
}

// Number Input with stepper
export interface NumberInputProps {
  value?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  className?: string;
  disabled?: boolean;
}

export function NumberInput({
  value = 0,
  onChange,
  min = -Infinity,
  max = Infinity,
  step = 1,
  label,
  className,
  disabled,
}: NumberInputProps) {
  const handleChange = (newValue: number) => {
    const clamped = Math.min(max, Math.max(min, newValue));
    onChange?.(clamped);
  };

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {label && (
        <label className="text-sm font-medium text-[var(--gray-12)]">
          {label}
        </label>
      )}
      <div className="flex items-center">
        <button
          type="button"
          onClick={() => handleChange(value - step)}
          disabled={disabled || value <= min}
          className="px-2 py-1 border border-r-0 border-[var(--gray-6)] rounded-l hover:bg-[var(--gray-3)] disabled:opacity-50"
        >
          −
        </button>
        <input
          type="number"
          value={value}
          onChange={(e) => handleChange(parseFloat(e.target.value) || 0)}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          className="w-16 px-2 py-1 text-center border-y border-[var(--gray-6)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-7)] disabled:opacity-50"
        />
        <button
          type="button"
          onClick={() => handleChange(value + step)}
          disabled={disabled || value >= max}
          className="px-2 py-1 border border-l-0 border-[var(--gray-6)] rounded-r hover:bg-[var(--gray-3)] disabled:opacity-50"
        >
          +
        </button>
      </div>
    </div>
  );
}
