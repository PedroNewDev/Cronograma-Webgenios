"use client";

import { Search, Bell, Plus, Filter, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { Avatar } from "@/components/ui/avatar";
import { useSession } from "@/lib/auth-client";

interface TopbarProps {
  onOpenPalette: () => void;
}

export function Topbar({ onOpenPalette }: TopbarProps) {
  const { data: session } = useSession();
  const userName = session?.user?.name ?? "";
  const userImg = session?.user?.image ?? undefined;

  return (
    <header className="h-14 px-5 flex items-center justify-between border-b border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-base)]/40 backdrop-blur-xl">
      <div className="flex items-center gap-3 min-w-0">
        <h1 className="text-[15px] font-semibold tracking-tight">Demandas</h1>
        <span className="text-[12.5px] text-[color:var(--color-text-muted)]">/</span>
        <span className="text-[12.5px] text-[color:var(--color-text-secondary)] truncate">Lançamento Alpha-Gal</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onOpenPalette}
          className="hidden md:flex items-center gap-2 h-9 w-[280px] px-3 rounded-md border border-[color:var(--color-border-subtle)] bg-[color:var(--color-surface-raised)] text-[12.5px] text-[color:var(--color-text-muted)] hover:border-[color:var(--color-border-strong)] hover:bg-white/[0.04] transition-colors"
        >
          <Search className="size-3.5" />
          <span className="flex-1 text-left">Buscar tudo…</span>
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </button>

        <Button variant="ghost" size="icon" aria-label="Filtros">
          <Filter className="size-4" />
        </Button>
        <Button variant="ghost" size="icon" aria-label="Visão">
          <SlidersHorizontal className="size-4" />
        </Button>
        <Button variant="ghost" size="icon" aria-label="Notificações" className="relative">
          <Bell className="size-4" />
          <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-[color:var(--color-danger)]" />
        </Button>

        <Button variant="primary" size="md">
          <Plus className="size-4" />
          Nova demanda
        </Button>

        {userName && <Avatar name={userName} src={userImg} size="md" className="ml-1" />}
      </div>
    </header>
  );
}
