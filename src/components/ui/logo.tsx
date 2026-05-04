import { cn } from "@/lib/utils";

interface LogoProps {
  collapsed?: boolean;
  className?: string;
}

/**
 * "Spark W" — vértice central elevado vira faísca/cursor luminoso.
 * Avatar (collapsed) renderiza só o W com spark.
 */
export function Logo({ collapsed = false, className }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <SparkWMark />
      {!collapsed && (
        <span className="font-semibold tracking-tight text-[15px] text-[color:var(--color-text-primary)]">
          web<span className="text-[color:var(--color-text-secondary)]">genios</span>
        </span>
      )}
    </div>
  );
}

function SparkWMark() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-label="WebGenios"
      role="img"
    >
      <defs>
        <linearGradient id="wg-stroke" x1="0" y1="24" x2="24" y2="0">
          <stop offset="0%" stopColor="#7C5CFF" />
          <stop offset="100%" stopColor="#A78BFA" />
        </linearGradient>
        <radialGradient id="wg-spark" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="40%" stopColor="#A78BFA" />
          <stop offset="100%" stopColor="#7C5CFF" stopOpacity="0" />
        </radialGradient>
      </defs>
      <path
        d="M3 5 L7.5 19 L12 9 L16.5 19 L21 5"
        stroke="url(#wg-stroke)"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="6" r="3.2" fill="url(#wg-spark)" />
      <circle cx="12" cy="6" r="1.1" fill="#FFFFFF" />
    </svg>
  );
}
