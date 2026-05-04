import { eq } from "drizzle-orm";
import { db } from "@/db";
import { organization } from "@/db/schema";
import { getActiveOrg } from "@/server/session";
import { listFunnels } from "@/server/funnels";
import { Shell } from "./shell";
import type { ReactNode } from "react";

/** Shell server-component: busca funis + nome da org e injeta no client Shell. */
export async function ShellServer({ children }: { children: ReactNode }) {
  const { id: orgId } = await getActiveOrg();
  const [orgRow, funnels] = await Promise.all([
    db.select({ name: organization.name }).from(organization).where(eq(organization.id, orgId)).limit(1),
    listFunnels(),
  ]);
  const orgName = orgRow[0]?.name ?? "Workspace";

  return (
    <Shell funnels={funnels.map((f) => ({ id: f.id, name: f.name, color: f.color, count: f.count }))} orgName={orgName}>
      {children}
    </Shell>
  );
}
