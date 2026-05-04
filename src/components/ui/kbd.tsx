import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const Kbd = ({ className, ...props }: HTMLAttributes<HTMLElement>) => (
  <kbd
    className={cn(
      "inline-flex items-center justify-center min-w-[20px] h-5 px-1.5",
      "rounded-[var(--radius-xs)] border",
      "bg-white/[0.04] border-[color:var(--color-border-subtle)]",
      "font-mono text-[10px] text-[color:var(--color-text-secondary)]",
      "shadow-[0_1px_0_rgba(255,255,255,0.04)_inset]",
      className,
    )}
    {...props}
  />
);
