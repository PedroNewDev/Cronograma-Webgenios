import { MessageCircle, Paperclip, GitBranch } from "lucide-react";
import { Card, CardHeader, CardTitle, CardFooter, PriorityRail } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AvatarStack } from "@/components/ui/avatar";
import { formatPrazo } from "@/lib/utils";

export interface TaskCardData {
  id: string;
  title: string;
  funnel: string;
  priority: "baixa" | "media" | "alta" | "urgente";
  assignees: string[];
  due: Date;
  status: string;
  comments?: number;
  attachments?: number;
  dependencies?: number;
  tags?: string[];
}

const dueTone = {
  far: "neutral" as const,
  soon: "warning" as const,
  today: "danger" as const,
};

export function TaskCard({ task }: { task: TaskCardData }) {
  const prazo = formatPrazo(task.due);

  return (
    <Card className="cursor-pointer hover:border-[color:var(--color-border-strong)] hover:translate-y-[-1px]">
      <PriorityRail priority={task.priority} />

      <CardHeader>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="text-[10.5px] font-mono text-[color:var(--color-text-muted)]">{task.id}</span>
            <span className="text-[color:var(--color-text-muted)]">·</span>
            <span className="text-[10.5px] text-[color:var(--color-text-secondary)] truncate">{task.funnel}</span>
          </div>
          <CardTitle className="line-clamp-2">{task.title}</CardTitle>
        </div>
      </CardHeader>

      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {task.tags.map((t) => (
            <Badge key={t} tone="neutral">{t}</Badge>
          ))}
        </div>
      )}

      <CardFooter>
        <div className="flex items-center gap-3 text-[11.5px] text-[color:var(--color-text-muted)]">
          {task.comments ? (
            <span className="inline-flex items-center gap-1">
              <MessageCircle className="size-3.5" /> {task.comments}
            </span>
          ) : null}
          {task.attachments ? (
            <span className="inline-flex items-center gap-1">
              <Paperclip className="size-3.5" /> {task.attachments}
            </span>
          ) : null}
          {task.dependencies ? (
            <span className="inline-flex items-center gap-1">
              <GitBranch className="size-3.5" /> {task.dependencies}
            </span>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          <Badge tone={dueTone[prazo.tone]}>{prazo.label}</Badge>
          <AvatarStack names={task.assignees} max={3} size="sm" />
        </div>
      </CardFooter>
    </Card>
  );
}
