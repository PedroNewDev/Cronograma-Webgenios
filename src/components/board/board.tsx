"use client";

import { useState, useTransition, useOptimistic } from "react";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  useDraggable,
  useDroppable,
  closestCorners,
  DragOverlay,
  type DragStartEvent,
} from "@dnd-kit/core";
import { Plus, X } from "lucide-react";
import { Card, PriorityRail, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrazo, cn } from "@/lib/utils";
import {
  STATUS_ORDER,
  STATUS_LABELS,
  STATUS_TONES,
  type ListedTask,
  type TaskStatus,
} from "@/lib/task-types";
import { moveTask, createTask } from "@/server/tasks";

const dueTone = { far: "neutral", soon: "warning", today: "danger" } as const;

export function Board({
  funnelId,
  initialTasks,
}: {
  funnelId: string;
  initialTasks: ListedTask[];
}) {
  const [optimisticTasks, applyOptimistic] = useOptimistic(
    initialTasks,
    (state: ListedTask[], action: { type: "move"; id: string; status: TaskStatus }) => {
      if (action.type === "move") {
        return state.map((t) => (t.id === action.id ? { ...t, status: action.status } : t));
      }
      return state;
    },
  );
  const [, startTransition] = useTransition();
  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  const grouped: Record<TaskStatus, ListedTask[]> = {
    backlog: [],
    producao: [],
    revisao: [],
    aprovado: [],
  };
  for (const t of optimisticTasks) grouped[t.status].push(t);

  const activeTask = activeId ? optimisticTasks.find((t) => t.id === activeId) : null;

  function onDragStart(e: DragStartEvent) {
    setActiveId(String(e.active.id));
  }

  function onDragEnd(e: DragEndEvent) {
    setActiveId(null);
    const { active, over } = e;
    if (!over) return;
    const newStatus = String(over.id) as TaskStatus;
    if (!STATUS_ORDER.includes(newStatus)) return;
    const taskId = String(active.id);
    const current = optimisticTasks.find((t) => t.id === taskId);
    if (!current || current.status === newStatus) return;

    startTransition(() => {
      applyOptimistic({ type: "move", id: taskId, status: newStatus });
      void moveTask(taskId, newStatus);
    });
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={onDragStart} onDragEnd={onDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-2 -mx-2 px-2">
        {STATUS_ORDER.map((status) => (
          <Column
            key={status}
            status={status}
            funnelId={funnelId}
            tasks={grouped[status]}
          />
        ))}
      </div>
      <DragOverlay>{activeTask ? <TaskCardView task={activeTask} dragging /> : null}</DragOverlay>
    </DndContext>
  );
}

function Column({
  status,
  funnelId,
  tasks,
}: {
  status: TaskStatus;
  funnelId: string;
  tasks: ListedTask[];
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status });
  const [adding, setAdding] = useState(false);

  return (
    <div className="flex-1 min-w-[300px] max-w-[340px]">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <span className="size-1.5 rounded-full" style={{ background: STATUS_TONES[status] }} />
          <h3 className="text-[12px] font-semibold tracking-tight uppercase text-[color:var(--color-text-secondary)]">
            {STATUS_LABELS[status]}
          </h3>
          <span className="text-[11px] text-[color:var(--color-text-muted)] tabular-nums">{tasks.length}</span>
        </div>
        <button
          onClick={() => setAdding(true)}
          className="size-5 grid place-items-center rounded text-[color:var(--color-text-muted)] hover:text-[color:var(--color-text-primary)] hover:bg-white/[0.04]"
          aria-label="Adicionar demanda"
        >
          <Plus className="size-3.5" />
        </button>
      </div>

      <div
        ref={setNodeRef}
        className={cn(
          "space-y-2.5 rounded-lg p-1 -m-1 min-h-[80px] transition-colors",
          isOver && "bg-white/[0.03] outline outline-1 outline-dashed outline-[color:var(--color-border-focus)]",
        )}
      >
        {tasks.map((t) => (
          <DraggableTask key={t.id} task={t} />
        ))}

        {adding && (
          <NewTaskForm funnelId={funnelId} status={status} onDone={() => setAdding(false)} />
        )}

        {!adding && tasks.length === 0 && (
          <button
            onClick={() => setAdding(true)}
            className="w-full text-[12px] text-[color:var(--color-text-muted)] hover:text-[color:var(--color-text-primary)] py-3 rounded-md border border-dashed border-[color:var(--color-border-subtle)] hover:border-[color:var(--color-border-strong)] transition-colors"
          >
            + Demanda
          </button>
        )}
      </div>
    </div>
  );
}

function DraggableTask({ task }: { task: ListedTask }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: task.id });
  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{ opacity: isDragging ? 0.4 : 1 }}
      className="touch-none"
    >
      <TaskCardView task={task} />
    </div>
  );
}

function TaskCardView({ task, dragging = false }: { task: ListedTask; dragging?: boolean }) {
  const prazo = task.dueAt ? formatPrazo(task.dueAt) : null;
  return (
    <Card
      className={cn(
        "cursor-grab active:cursor-grabbing hover:border-[color:var(--color-border-strong)]",
        dragging && "ring-2 ring-[color:var(--color-accent)]/50 shadow-[var(--shadow-pop)]",
      )}
    >
      <PriorityRail priority={task.priority} />
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="min-w-0">
          <span className="text-[10.5px] font-mono text-[color:var(--color-text-muted)]">{task.code}</span>
        </div>
      </div>
      <CardTitle className="line-clamp-2 !text-[13.5px] mb-3">{task.title}</CardTitle>
      <div className="flex items-center justify-between gap-2">
        <div>
          {prazo && (
            <Badge tone={dueTone[prazo.tone]}>{prazo.label}</Badge>
          )}
        </div>
        {task.assigneeName && <Avatar name={task.assigneeName} size="sm" />}
      </div>
    </Card>
  );
}

function NewTaskForm({
  funnelId,
  status,
  onDone,
}: {
  funnelId: string;
  status: TaskStatus;
  onDone: () => void;
}) {
  const [title, setTitle] = useState("");
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const t = title.trim();
    if (!t) return;
    const fd = new FormData();
    fd.set("funnelId", funnelId);
    fd.set("title", t);
    fd.set("status", status);
    fd.set("priority", "media");
    startTransition(async () => {
      await createTask(fd);
      setTitle("");
      onDone();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="glass rounded-[var(--radius-lg)] p-3 space-y-2">
      <Input
        autoFocus
        placeholder="Título da demanda…"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="h-9"
        disabled={pending}
      />
      <div className="flex items-center gap-1.5">
        <Button type="submit" variant="primary" size="sm" loading={pending} className="flex-1">
          Criar
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={onDone} aria-label="Cancelar">
          <X className="size-3.5" />
        </Button>
      </div>
    </form>
  );
}
