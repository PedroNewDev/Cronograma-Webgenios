"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Inbox,
  CheckSquare,
  Calendar,
  Users,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  LogOut,
} from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { signOut, useSession } from "@/lib/auth-client";

const nav = [
  { icon: LayoutDashboard, label: "Início", href: "/" },
  { icon: Inbox, label: "Meu Dia", href: "/me" },
  { icon: CheckSquare, label: "Demandas", href: "/tasks" },
  { icon: Calendar, label: "Calendário", href: "/calendar" },
  { icon: Users, label: "Equipe", href: "/team" },
];

export type SidebarFunnel = { id: string; name: string; color: string; count: number };

export function Sidebar({ funnels, orgName }: { funnels: SidebarFunnel[]; orgName: string }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();
  const router = useRouter();

  const userName = session?.user?.name ?? "Convidado";
  const userImg = session?.user?.image ?? undefined;

  async function handleSignOut() {
    await signOut();
    router.push("/login");
  }

  return (
    <aside
      className={cn(
        "relative z-10 flex flex-col shrink-0",
        "h-screen border-r border-[color:var(--color-border-subtle)]",
        "bg-[color:var(--color-bg-elevated)]/60 backdrop-blur-xl",
        "transition-[width] duration-200",
        collapsed ? "w-[64px]" : "w-[248px]",
      )}
    >
      <div className="h-14 px-3 flex items-center justify-between border-b border-[color:var(--color-border-subtle)]">
        <Logo collapsed={collapsed} />
        <button
          onClick={() => setCollapsed((v) => !v)}
          className="size-7 grid place-items-center rounded-md text-[color:var(--color-text-muted)] hover:text-[color:var(--color-text-primary)] hover:bg-white/[0.04] transition-colors"
          aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
        >
          {collapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
        </button>
      </div>

      <nav className="px-2 py-3 space-y-0.5">
        {nav.map(({ icon: Icon, label, href }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={label}
              href={href}
              className={cn(
                "w-full flex items-center gap-2.5 h-9 px-2.5 rounded-md",
                "text-[13px] font-medium transition-colors",
                isActive
                  ? "bg-white/[0.06] text-[color:var(--color-text-primary)]"
                  : "text-[color:var(--color-text-secondary)] hover:bg-white/[0.04] hover:text-[color:var(--color-text-primary)]",
              )}
            >
              <Icon className="size-[16px] shrink-0" strokeWidth={1.75} />
              {!collapsed && <span className="flex-1">{label}</span>}
            </Link>
          );
        })}
      </nav>

      {!collapsed && (
        <div className="px-2 mt-2 flex-1 min-h-0 flex flex-col">
          <div className="px-2.5 mb-1.5 flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[color:var(--color-text-muted)]">
              Funis
            </span>
            <Link
              href="/funnels/new"
              className="size-5 grid place-items-center rounded text-[color:var(--color-text-muted)] hover:text-[color:var(--color-text-primary)] hover:bg-white/[0.04]"
              aria-label="Novo funil"
            >
              <Plus className="size-3.5" />
            </Link>
          </div>
          <div className="space-y-0.5 overflow-y-auto">
            {funnels.length === 0 && (
              <p className="px-2.5 py-2 text-[11.5px] text-[color:var(--color-text-muted)] leading-relaxed">
                Nenhum funil ainda.{" "}
                <Link href="/funnels/new" className="text-[color:var(--color-accent)] hover:underline">
                  Criar o primeiro
                </Link>
                .
              </p>
            )}
            {funnels.map((f) => {
              const isActive = pathname === `/f/${f.id}`;
              return (
                <Link
                  key={f.id}
                  href={`/f/${f.id}`}
                  className={cn(
                    "w-full flex items-center gap-2.5 h-8 px-2.5 rounded-md text-[12.5px] transition-colors",
                    isActive
                      ? "bg-white/[0.06] text-[color:var(--color-text-primary)]"
                      : "text-[color:var(--color-text-secondary)] hover:bg-white/[0.04] hover:text-[color:var(--color-text-primary)]",
                  )}
                >
                  <span className="size-1.5 rounded-full shrink-0" style={{ background: f.color }} />
                  <span className="flex-1 text-left truncate">{f.name}</span>
                  <span className="text-[10.5px] text-[color:var(--color-text-muted)] tabular-nums">{f.count}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      <div className="border-t border-[color:var(--color-border-subtle)] p-2">
        <div className={cn(
          "flex items-center gap-2.5 h-10 px-2 rounded-md hover:bg-white/[0.04] transition-colors",
          collapsed && "justify-center",
        )}>
          <Avatar name={userName} src={userImg} size="md" />
          {!collapsed && (
            <>
              <div className="flex-1 min-w-0 text-left">
                <div className="text-[12.5px] font-medium text-[color:var(--color-text-primary)] truncate">{userName}</div>
                <div className="text-[10.5px] text-[color:var(--color-text-muted)] flex items-center gap-1.5 truncate">
                  <Badge tone="accent" className="h-[16px] px-1.5 text-[9.5px]">Admin</Badge>
                  <span className="truncate">{orgName}</span>
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="size-7 grid place-items-center rounded-md text-[color:var(--color-text-muted)] hover:text-[color:var(--color-danger)] hover:bg-white/[0.04] transition-colors"
                aria-label="Sair"
                title="Sair"
              >
                <LogOut className="size-3.5" />
              </button>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
