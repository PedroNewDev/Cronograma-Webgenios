import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function initialsOf(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? "")
    .join("");
}

export function formatPrazo(date: Date, now = new Date()) {
  const diffDays = Math.round((date.getTime() - now.getTime()) / 86_400_000);
  if (diffDays < 0) return { label: `Atrasada ${Math.abs(diffDays)}d`, tone: "today" as const };
  if (diffDays === 0) return { label: "Hoje", tone: "today" as const };
  if (diffDays === 1) return { label: "Amanhã", tone: "soon" as const };
  if (diffDays <= 3) return { label: `Em ${diffDays}d`, tone: "soon" as const };
  if (diffDays <= 7) return { label: `Em ${diffDays}d`, tone: "far" as const };
  return { label: date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }), tone: "far" as const };
}
