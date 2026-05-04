import { redirect } from "next/navigation";
import { headers } from "next/headers";
import type { ReactNode } from "react";
import { auth } from "@/lib/auth";
import { ensureMembership } from "@/server/bootstrap";
import { ShellServer } from "@/components/shell/shell-server";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const h = await headers();
  const session = await auth.api.getSession({ headers: h });
  if (!session?.user?.id) redirect("/login");

  // Garante membership no workspace canônico WebGenios.
  const orgId = await ensureMembership(session.user.id);

  // Ativa o workspace na sessão se ainda não estiver.
  if (session.session.activeOrganizationId !== orgId) {
    try {
      await auth.api.setActiveOrganization({
        body: { organizationId: orgId },
        headers: h,
      });
    } catch (err) {
      // Sessão inválida (ex.: cookie órfão) — força re-login.
      console.error("[layout] setActiveOrganization failed:", err);
      redirect("/login");
    }
  }

  return <ShellServer>{children}</ShellServer>;
}
