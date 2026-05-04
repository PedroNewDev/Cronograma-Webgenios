export type TaskStatus = "backlog" | "producao" | "revisao" | "aprovado";
export type TaskPriority = "baixa" | "media" | "alta" | "urgente";

export const STATUS_ORDER: TaskStatus[] = ["backlog", "producao", "revisao", "aprovado"];

export const STATUS_LABELS: Record<TaskStatus, string> = {
  backlog: "Backlog",
  producao: "Em produção",
  revisao: "Aguardando revisão",
  aprovado: "Aprovado",
};

export const STATUS_TONES: Record<TaskStatus, string> = {
  backlog: "var(--color-text-muted)",
  producao: "var(--color-info)",
  revisao: "var(--color-warning)",
  aprovado: "var(--color-success)",
};

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  baixa: "Baixa",
  media: "Média",
  alta: "Alta",
  urgente: "Urgente",
};

export type ListedTask = {
  id: string;
  code: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueAt: Date | null;
  funnelName: string;
  assigneeName: string | null;
};
