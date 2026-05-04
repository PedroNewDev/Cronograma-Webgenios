import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "relative rounded-[var(--radius-lg)] glass p-4",
        "transition-[background,border-color,transform] duration-200",
        className,
      )}
      {...props}
    />
  ),
);
Card.displayName = "Card";

export const CardHeader = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex items-start justify-between gap-3 mb-3", className)} {...props} />
);

export const CardTitle = ({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className={cn("text-[15px] font-semibold tracking-tight text-[color:var(--color-text-primary)]", className)} {...props} />
);

export const CardDescription = ({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) => (
  <p className={cn("text-[13px] text-[color:var(--color-text-secondary)] leading-relaxed", className)} {...props} />
);

export const CardFooter = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("mt-4 flex items-center justify-between gap-2", className)} {...props} />
);

interface PriorityRailProps {
  priority: "baixa" | "media" | "alta" | "urgente";
}

const priorityColor: Record<PriorityRailProps["priority"], string> = {
  baixa: "var(--color-text-muted)",
  media: "var(--color-info)",
  alta: "var(--color-warning)",
  urgente: "var(--color-danger)",
};

export const PriorityRail = ({ priority }: PriorityRailProps) => (
  <span
    aria-label={`Prioridade ${priority}`}
    className="absolute left-0 top-3 bottom-3 w-[3px] rounded-r-full"
    style={{ background: priorityColor[priority] }}
  />
);
