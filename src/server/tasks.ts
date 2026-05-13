"use server";

import { revalidatePath } from "next/cache";
import { eq, and, asc, sql } from "drizzle-orm";
import { db } from "@/db";
import { task, user, funnel } from "@/db/schema";
import { getActiveOrg } from "./session";
import type { ListedTask, TaskStatus, TaskPriority } from "@/lib/task-types";

/** Lista tasks de um funil. */
export async function listTasksByFunnel(funnelId: string): Promise<ListedTask[]> {
  const { id: orgId } = await getActiveOrg();
  const rows = await db
    .select({
      id: task.id,
      code: task.code,
      title: task.title,
      status: task.status,
      priority: task.priority,
      dueAt: task.dueAt,
      funnelName: funnel.name,
      assigneeName: user.name,
    })
    .from(task)
    .innerJoin(funnel, eq(task.funnelId, funnel.id))
    .leftJoin(user, eq(task.assigneeId, user.id))
    .where(and(eq(task.organizationId, orgId), eq(task.funnelId, funnelId)))
    .orderBy(asc(task.createdAt));

  return rows.map((r) => ({
    ...r,
    status: r.status as TaskStatus,
    priority: r.priority as TaskPriority,
  }));
}

/** Próximo código sequencial WG-NNN dentro da org. */
async function nextTaskCode(orgId: string) {
  const [row] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(task)
    .where(eq(task.organizationId, orgId));
  const n = (row?.count ?? 0) + 1;
  return `WG-${String(n).padStart(3, "0")}`;
}

/** Cria task em um funil. */
export async function createTask(formData: FormData) {
  const { id: orgId, userId } = await getActiveOrg();
  const funnelId = String(formData.get("funnelId") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const status = (String(formData.get("status") ?? "backlog") as TaskStatus);
  const priority = (String(formData.get("priority") ?? "media") as TaskPriority);
  if (!funnelId || !title) throw new Error("Dados incompletos.");

  const [f] = await db
    .select({ id: funnel.id })
    .from(funnel)
    .where(and(eq(funnel.id, funnelId), eq(funnel.organizationId, orgId)))
    .limit(1);
  if (!f) throw new Error("Funil inválido.");

  const id = crypto.randomUUID();
  const code = await nextTaskCode(orgId);

  await db.insert(task).values({
    id,
    organizationId: orgId,
    funnelId,
    code,
    title,
    status,
    priority,
    assigneeId: userId,
  });

  revalidatePath(`/f/${funnelId}`);
}

/** Move task entre colunas (drag-drop). */
export async function moveTask(taskId: string, status: TaskStatus) {
  const { id: orgId } = await getActiveOrg();

  const [moved] = await db
    .select({ funnelId: task.funnelId })
    .from(task)
    .where(and(eq(task.id, taskId), eq(task.organizationId, orgId)))
    .limit(1);

  await db
    .update(task)
    .set({ status, updatedAt: new Date() })
    .where(and(eq(task.id, taskId), eq(task.organizationId, orgId)));

  if (moved) revalidatePath(`/f/${moved.funnelId}`);
}

/** Deleta task. */
export async function deleteTask(taskId: string, funnelId: string) {
  const { id: orgId } = await getActiveOrg();
  await db
    .delete(task)
    .where(and(eq(task.id, taskId), eq(task.organizationId, orgId)));
  revalidatePath(`/f/${funnelId}`);
}
