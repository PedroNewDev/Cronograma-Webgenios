"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const button = tv({
  base: [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap select-none",
    "font-medium tracking-tight",
    "rounded-[var(--radius-md)]",
    "transition-[background,border-color,color,transform,box-shadow] duration-150",
    "disabled:opacity-50 disabled:pointer-events-none",
    "active:scale-[0.98]",
    "focus-visible:outline-2 focus-visible:outline-[color:var(--color-border-focus)] focus-visible:outline-offset-2",
  ],
  variants: {
    variant: {
      primary: [
        "bg-[color:var(--color-accent)] text-white",
        "hover:bg-[color:var(--color-accent-hover)]",
        "shadow-[0_1px_0_rgba(255,255,255,0.18)_inset,0_8px_24px_-8px_var(--color-accent-glow)]",
      ],
      secondary: [
        "bg-[color:var(--color-surface-raised)] text-[color:var(--color-text-primary)]",
        "border border-[color:var(--color-border-subtle)]",
        "hover:bg-white/[0.06] hover:border-[color:var(--color-border-strong)]",
      ],
      ghost: [
        "text-[color:var(--color-text-secondary)]",
        "hover:bg-white/[0.04] hover:text-[color:var(--color-text-primary)]",
      ],
      danger: [
        "bg-[color:var(--color-danger)]/15 text-[color:var(--color-danger)]",
        "border border-[color:var(--color-danger)]/30",
        "hover:bg-[color:var(--color-danger)]/25",
      ],
      glass: [
        "glass text-[color:var(--color-text-primary)]",
        "hover:bg-white/[0.07]",
      ],
    },
    size: {
      sm: "h-8 px-3 text-[13px]",
      md: "h-9 px-4 text-sm",
      lg: "h-11 px-5 text-[15px]",
      icon: "h-9 w-9 p-0",
    },
  },
  defaultVariants: { variant: "secondary", size: "md" },
});

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof button> {
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, children, disabled, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(button({ variant, size }), className)}
      {...props}
    >
      {loading ? <Loader2 className="size-4 animate-spin" /> : children}
    </button>
  ),
);
Button.displayName = "Button";
