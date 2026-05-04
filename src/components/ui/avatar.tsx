import { cn, initialsOf } from "@/lib/utils";

interface AvatarProps {
  name: string;
  src?: string;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  xs: "size-5 text-[9px]",
  sm: "size-6 text-[10px]",
  md: "size-7 text-[11px]",
  lg: "size-9 text-[13px]",
} as const;

const palette = [
  "linear-gradient(135deg, #7C5CFF, #4F46E5)",
  "linear-gradient(135deg, #34D399, #059669)",
  "linear-gradient(135deg, #F5B544, #D97706)",
  "linear-gradient(135deg, #F26B6B, #DC2626)",
  "linear-gradient(135deg, #60A5FA, #2563EB)",
  "linear-gradient(135deg, #EC4899, #BE185D)",
];

function pickGradient(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return palette[h % palette.length];
}

export function Avatar({ name, src, size = "md", className }: AvatarProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full font-semibold text-white",
        "ring-2 ring-[color:var(--color-bg-base)] shrink-0",
        sizeMap[size],
        className,
      )}
      style={!src ? { background: pickGradient(name) } : undefined}
      title={name}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={name} className="size-full rounded-full object-cover" />
      ) : (
        initialsOf(name)
      )}
    </span>
  );
}

interface AvatarStackProps {
  names: string[];
  max?: number;
  size?: AvatarProps["size"];
}

export function AvatarStack({ names, max = 3, size = "sm" }: AvatarStackProps) {
  const visible = names.slice(0, max);
  const remaining = names.length - visible.length;
  return (
    <div className="flex -space-x-1.5">
      {visible.map((n) => (
        <Avatar key={n} name={n} size={size} />
      ))}
      {remaining > 0 && (
        <span
          className={cn(
            "inline-flex items-center justify-center rounded-full font-medium",
            "bg-[color:var(--color-bg-overlay)] text-[color:var(--color-text-secondary)]",
            "ring-2 ring-[color:var(--color-bg-base)]",
            sizeMap[size!],
          )}
        >
          +{remaining}
        </span>
      )}
    </div>
  );
}
