import type { HTMLAttributes } from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "@/lib/utils";

const badge = tv({
  base: [
    "inline-flex items-center gap-1.5",
    "h-[22px] px-2 rounded-full",
    "text-[11px] font-medium tracking-tight",
    "border",
  ],
  variants: {
    tone: {
      neutral: "bg-white/[0.04] text-[color:var(--color-text-secondary)] border-[color:var(--color-border-subtle)]",
      accent: "bg-[color:var(--color-accent)]/12 text-[color:var(--color-accent)] border-[color:var(--color-accent)]/25",
      success: "bg-[color:var(--color-success)]/12 text-[color:var(--color-success)] border-[color:var(--color-success)]/25",
      warning: "bg-[color:var(--color-warning)]/12 text-[color:var(--color-warning)] border-[color:var(--color-warning)]/25",
      danger: "bg-[color:var(--color-danger)]/12 text-[color:var(--color-danger)] border-[color:var(--color-danger)]/25",
    },
  },
  defaultVariants: { tone: "neutral" },
});

interface BadgeProps extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badge> {}

export const Badge = ({ className, tone, ...props }: BadgeProps) => (
  <span className={cn(badge({ tone }), className)} {...props} />
);
