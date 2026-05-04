"use client";

import { useEffect, useState } from "react";
import { Command } from "cmdk";
import {
  Search,
  Plus,
  CheckSquare,
  Calendar,
  Users,
  Sparkles,
  ArrowRight,
  Inbox,
  Folder,
  Settings,
} from "lucide-react";
import { Kbd } from "@/components/ui/kbd";
import { cn } from "@/lib/utils";

const actions = [
  { icon: Plus, label: "Nova demanda", group: "Ações", shortcut: "C" },
  { icon: Folder, label: "Novo funil", group: "Ações", shortcut: "F" },
  { icon: Sparkles, label: "Resumir com IA", group: "IA", shortcut: "I" },
  { icon: Sparkles, label: "Sugerir prazo", group: "IA" },
];

const navigate = [
  { icon: Inbox, label: "Ir para Meu Dia", group: "Navegação" },
  { icon: CheckSquare, label: "Ir para Demandas", group: "Navegação" },
  { icon: Calendar, label: "Ir para Calendário", group: "Navegação" },
  { icon: Users, label: "Ir para Equipe", group: "Navegação" },
  { icon: Settings, label: "Abrir configurações", group: "Navegação" },
];

const recents = [
  { label: "Roteiro VSL — Frei Gilson v3", group: "Demandas recentes" },
  { label: "Criativo carrossel São Bento", group: "Demandas recentes" },
  { label: "Copy de bump Alpha-Gal", group: "Demandas recentes" },
];

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
      if (e.key === "Escape") onOpenChange(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  if (!open) return null;
  const setOpen = onOpenChange;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[18vh] px-4"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <button
        aria-label="Fechar"
        onClick={() => setOpen(false)}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />

      <Command
        className={cn(
          "relative w-full max-w-[620px] rounded-[var(--radius-xl)] overflow-hidden",
          "glass shadow-[var(--shadow-pop)]",
          "animate-in fade-in zoom-in-95 duration-150",
        )}
        loop
      >
        <div className="flex items-center gap-3 px-4 h-14 border-b border-[color:var(--color-border-subtle)]">
          <Search className="size-4 text-[color:var(--color-text-muted)]" />
          <Command.Input
            placeholder="Buscar demandas, pessoas, funis ou ações…"
            className="flex-1 bg-transparent outline-none text-[14px] placeholder:text-[color:var(--color-text-muted)]"
          />
          <Kbd>esc</Kbd>
        </div>

        <Command.List className="max-h-[420px] overflow-y-auto p-2">
          <Command.Empty className="py-10 text-center text-[13px] text-[color:var(--color-text-muted)]">
            Nada encontrado.
          </Command.Empty>

          <CmdGroup heading="Ações">
            {actions.map((a) => (
              <CmdItem key={a.label} icon={a.icon} label={a.label} shortcut={a.shortcut} />
            ))}
          </CmdGroup>

          <CmdGroup heading="Navegação">
            {navigate.map((a) => (
              <CmdItem key={a.label} icon={a.icon} label={a.label} />
            ))}
          </CmdGroup>

          <CmdGroup heading="Demandas recentes">
            {recents.map((r) => (
              <CmdItem key={r.label} icon={CheckSquare} label={r.label} />
            ))}
          </CmdGroup>
        </Command.List>

        <div className="border-t border-[color:var(--color-border-subtle)] px-4 h-9 flex items-center justify-between text-[11px] text-[color:var(--color-text-muted)]">
          <div className="flex items-center gap-2">
            <Kbd>↑</Kbd><Kbd>↓</Kbd>
            <span>navegar</span>
          </div>
          <div className="flex items-center gap-2">
            <Kbd>↵</Kbd>
            <span>abrir</span>
          </div>
        </div>
      </Command>
    </div>
  );
}

function CmdGroup({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <Command.Group
      heading={heading}
      className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.08em] [&_[cmdk-group-heading]]:text-[color:var(--color-text-muted)]"
    >
      {children}
    </Command.Group>
  );
}

function CmdItem({
  icon: Icon,
  label,
  shortcut,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  shortcut?: string;
}) {
  return (
    <Command.Item
      className={cn(
        "flex items-center gap-2.5 h-9 px-2.5 rounded-md cursor-pointer",
        "text-[13px] text-[color:var(--color-text-secondary)]",
        "data-[selected=true]:bg-white/[0.06] data-[selected=true]:text-[color:var(--color-text-primary)]",
        "transition-colors",
      )}
    >
      <Icon className="size-4 shrink-0 text-[color:var(--color-text-muted)]" strokeWidth={1.75} />
      <span className="flex-1 truncate">{label}</span>
      {shortcut && <Kbd>{shortcut}</Kbd>}
      <ArrowRight className="size-3.5 opacity-0 -translate-x-1 group-data-[selected=true]:opacity-100 group-data-[selected=true]:translate-x-0 transition-all" />
    </Command.Item>
  );
}
