import { cn } from "@/lib/utils";

export function Divider({ children, className }: { children?: React.ReactNode; className?: string }) {
  if (!children) {
    return <hr className={cn("border-0 h-px bg-[color:var(--color-border-subtle)]", className)} />;
  }
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <hr className="flex-1 border-0 h-px bg-[color:var(--color-border-subtle)]" />
      <span className="text-[10.5px] uppercase tracking-[0.08em] text-[color:var(--color-text-muted)] font-semibold">
        {children}
      </span>
      <hr className="flex-1 border-0 h-px bg-[color:var(--color-border-subtle)]" />
    </div>
  );
}
