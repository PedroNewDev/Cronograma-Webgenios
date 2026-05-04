"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq, and, desc } from "drizzle-orm";
import { db } from "@/db";
import { funnel, task } from "@/db/schema";
import { getActiveOrg } from "./session";

const PALETTE = ["#7C5CFF", "#34D399", "#F5B544", "#F26B6B", "#60A5FA", "#EC4899"];

/** Lista funis ativos da org corrente (RSC). */
export async function listFunnels() {
  const { id: orgId } = await getActiveOrg();
  const rows = await db
    .select({
      id: funnel.id,
      name: funnel.name,
      color: funnel.color,
      archived: funnel.archived,
      createdAt: funnel.createdAt,
    })
    .from(funnel)
    .where(and(eq(funnel.organizationId, orgId), eq(funnel.archived, false)))
    .orderBy(desc(funnel.createdAt));

  // contagem de tasks por funil (subquery simples — em escala virar materialized view)
  const counts = await db
    .select({ funnelId: task.funnelId, status: task.status })
    .from(task)
    .where(eq(task.organizationId, orgId));

  const countByFunnel = new Map<string, number>();
  for (const c of counts) {
    if (c.status === "aprovado") continue;
    countByFunnel.set(c.funnelId, (countByFunnel.get(c.funnelId) ?? 0) + 1);
  }

  return rows.map((f) => ({ ...f, count: countByFunnel.get(f.id) ?? 0 }));
}

/** Busca um funil específico (com checagem de tenant). */
export async function getFunnel(id: string) {
  const { id: orgId } = await getActiveOrg();
  const [row] = await db
    .select()
    .from(funnel)
    .where(and(eq(funnel.id, id), eq(funnel.organizationId, orgId)))
    .limit(1);
  return row ?? null;
}

/** Cria um funil novo. Retorna o id. */
export async function createFunnel(formData: FormData) {
  const { id: orgId } = await getActiveOrg();
  const name = String(formData.get("name") ?? "").trim();
  const colorRaw = String(formData.get("color") ?? PALETTE[0]);
  if (!name) throw new Error("Nome obrigatório.");
  const color = PALETTE.includes(colorRaw) ? colorRaw : PALETTE[0];

  const id = crypto.randomUUID();
  await db.insert(funnel).values({ id, organizationId: orgId, name, color });

  revalidatePath("/", "layout");
  redirect(`/f/${id}`);
}

/** Arquiva um funil (soft-delete). */
export async function archiveFunnel(id: string) {
  const { id: orgId } = await getActiveOrg();
  await db
    .update(funnel)
    .set({ archived: true })
    .where(and(eq(funnel.id, id), eq(funnel.organizationId, orgId)));

  revalidatePath("/", "layout");
}
