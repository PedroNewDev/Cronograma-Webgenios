import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { ensureMembership } from "./bootstrap";

/** Sessão atual, cacheada por request. Lança redirect se não autenticado. */
export const getSession = cache(async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");
  return session;
});

/**
 * Workspace ativo. Como o app é single-tenant (workspace fixo "WebGenios"),
 * garante que o usuário está vinculado ao workspace canônico e retorna seu id.
 */
export const getActiveOrg = cache(async () => {
  const session = await getSession();
  const orgId = session.session.activeOrganizationId ?? (await ensureMembership(session.user.id));
  return {
    id: orgId,
    userId: session.user.id,
  };
});
