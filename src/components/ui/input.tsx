import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type = "text", ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(
        "w-full h-10 px-3 rounded-[var(--radius-md)]",
        "bg-[color:var(--color-surface-raised)]",
        "border border-[color:var(--color-border-subtle)]",
        "text-[14px] text-[color:var(--color-text-primary)]",
        "placeholder:text-[color:var(--color-text-muted)]",
        "transition-colors duration-150",
        "hover:border-[color:var(--color-border-strong)]",
        "focus:outline-none focus:border-[color:var(--color-border-focus)]",
        "focus:ring-2 focus:ring-[color:var(--color-accent)]/20",
        "disabled:opacity-50 disabled:pointer-events-none",
        // Inputs no mobile devem ter 16px+ pra evitar zoom no iOS
        "text-[16px] md:text-[14px]",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";

export const Label = forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        "block text-[12.5px] font-medium text-[color:var(--color-text-secondary)] mb-1.5",
        className,
      )}
      {...props}
    />
  ),
);
Label.displayName = "Label";

interface FieldProps {
  label: string;
  hint?: React.ReactNode;
  error?: string;
  children: React.ReactNode;
  htmlFor?: string;
}

export function Field({ label, hint, error, children, htmlFor }: FieldProps) {
  return (
    <div>
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {error ? (
        <p className="mt-1.5 text-[11.5px] text-[color:var(--color-danger)]">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-[11.5px] text-[color:var(--color-text-muted)]">{hint}</p>
      ) : null}
    </div>
  );
}
