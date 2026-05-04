"use client";

import { useState, type ReactNode } from "react";
import { Sidebar, type SidebarFunnel } from "./sidebar";
import { Topbar } from "./topbar";
import { CommandPalette } from "./command-palette";

export function Shell({
  children,
  funnels,
  orgName,
}: {
  children: ReactNode;
  funnels: SidebarFunnel[];
  orgName: string;
}) {
  const [paletteOpen, setPaletteOpen] = useState(false);

  return (
    <div className="relative z-10 flex h-screen overflow-hidden">
      <Sidebar funnels={funnels} orgName={orgName} />
      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar onOpenPalette={() => setPaletteOpen(true)} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
    </div>
  );
}
