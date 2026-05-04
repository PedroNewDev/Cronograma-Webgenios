import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Board } from "@/components/board/board";
import { getFunnel } from "@/server/funnels";
import { listTasksByFunnel } from "@/server/tasks";

export default async function FunnelPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const f = await getFunnel(id);
  if (!f) notFound();

  const tasks = await listTasksByFunnel(id);

  return (
    <div className="max-w-[1600px] mx-auto space-y-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <span className="size-2.5 rounded-full shrink-0" style={{ background: f.color }} />
          <div className="min-w-0">
            <h1 className="text-[20px] font-semibold tracking-tight truncate">{f.name}</h1>
            <p className="text-[12px] text-[color:var(--color-text-secondary)] mt-0.5">
              {tasks.length} demanda{tasks.length === 1 ? "" : "s"} no funil
            </p>
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button variant="glass" size="sm">Kanban</Button>
          <Button variant="ghost" size="sm" disabled>Lista</Button>
          <Button variant="ghost" size="sm" disabled>Calendário</Button>
        </div>
      </header>

      <Board funnelId={id} initialTasks={tasks} />
    </div>
  );
}
