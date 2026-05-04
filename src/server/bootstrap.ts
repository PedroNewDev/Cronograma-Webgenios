"use server";

import { and, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { organization, member } from "@/db/schema";

const DEFAULT_ORG_SLUG = "webgenios";
const DEFAULT_ORG_NAME = "WebGenios";

/** Garante a existência do workspace canônico WebGenios. Idempotente. */
export async function ensureDefaultOrg(): Promise<string> {
  const [existing] = await db
    .select({ id: organization.id })
    .from(organization)
    .where(eq(organization.slug, DEFAULT_ORG_SLUG))
    .limit(1);
  if (existing) return existing.id;

  const id = crypto.randomUUID();
  await db.insert(organization).values({
    id,
    name: DEFAULT_ORG_NAME,
    slug: DEFAULT_ORG_SLUG,
  });
  return id;
}

/** Garante que o usuário é membro do workspace WebGenios. Primeiro usuário vira admin. */
export async function ensureMembership(userId: string): Promise<string> {
  const orgId = await ensureDefaultOrg();

  const [existing] = await db
    .select({ id: member.id })
    .from(member)
    .where(and(eq(member.organizationId, orgId), eq(member.userId, userId)))
    .limit(1);
  if (existing) return orgId;

  // Conta membros existentes — primeiro vira admin, demais são members.
  const [{ count }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(member)
    .where(eq(member.organizationId, orgId));
  const role = (count ?? 0) === 0 ? "admin" : "member";

  await db.insert(member).values({
    id: crypto.randomUUID(),
    organizationId: orgId,
    userId,
    role,
  });

  return orgId;
}
