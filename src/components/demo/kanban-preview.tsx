import { TaskCard, type TaskCardData } from "./task-card";

const columns: { title: string; tone: string; tasks: TaskCardData[] }[] = [
  {
    title: "Backlog",
    tone: "var(--color-text-muted)",
    tasks: [
      {
        id: "WG-241",
        title: "Roteiro de VSL — versão dor amplificada",
        funnel: "Lançamento Alpha-Gal",
        priority: "media",
        assignees: ["Caroline Lima", "Eduardo Castro"],
        due: addDays(9),
        status: "Backlog",
        comments: 3,
        tags: ["Copy", "VSL"],
      },
      {
        id: "WG-238",
        title: "Pesquisa de criativos do nicho devocional",
        funnel: "Grimório de São Bento",
        priority: "baixa",
        assignees: ["Bruna Souza"],
        due: addDays(14),
        status: "Backlog",
        attachments: 2,
      },
    ],
  },
  {
    title: "Em produção",
    tone: "var(--color-info)",
    tasks: [
      {
        id: "WG-244",
        title: "Criativo carrossel — São Bento (3 variações)",
        funnel: "Grimório de São Bento",
        priority: "alta",
        assignees: ["Pedro Farias", "Marcela Reis"],
        due: addDays(2),
        status: "Em produção",
        comments: 7,
        attachments: 4,
        dependencies: 1,
        tags: ["Design", "Reels"],
      },
      {
        id: "WG-247",
        title: "Copy de bump + order bump no checkout",
        funnel: "Lançamento Alpha-Gal",
        priority: "urgente",
        assignees: ["Caroline Lima"],
        due: addDays(0),
        status: "Em produção",
        comments: 2,
        tags: ["Copy", "CRO"],
      },
    ],
  },
  {
    title: "Aguardando revisão",
    tone: "var(--color-warning)",
    tasks: [
      {
        id: "WG-239",
        title: "Landing presell — frame above the fold",
        funnel: "Evergreen — Setembro",
        priority: "alta",
        assignees: ["Marcela Reis", "Eduardo Castro", "Pedro Farias", "Caroline Lima"],
        due: addDays(1),
        status: "Aguardando revisão",
        comments: 12,
        attachments: 1,
        tags: ["Design", "Landing"],
      },
    ],
  },
  {
    title: "Aprovado",
    tone: "var(--color-success)",
    tasks: [
      {
        id: "WG-230",
        title: "Setup Pixel + UTM no funil de webinar",
        funnel: "Lançamento Alpha-Gal",
        priority: "media",
        assignees: ["Bruna Souza"],
        due: addDays(-1),
        status: "Aprovado",
        tags: ["Tracking"],
      },
    ],
  },
];

function addDays(d: number) {
  const date = new Date();
  date.setDate(date.getDate() + d);
  return date;
}

export function KanbanPreview() {
  return (
    <div className="flex gap-4 overflow-x-auto pb-2 -mx-2 px-2">
      {columns.map((col) => (
        <div key={col.title} className="flex-1 min-w-[300px] max-w-[320px]">
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center gap-2">
              <span className="size-1.5 rounded-full" style={{ background: col.tone }} />
              <h3 className="text-[12px] font-semibold tracking-tight uppercase text-[color:var(--color-text-secondary)]">
                {col.title}
              </h3>
              <span className="text-[11px] text-[color:var(--color-text-muted)] tabular-nums">
                {col.tasks.length}
              </span>
            </div>
          </div>
          <div className="space-y-2.5">
            {col.tasks.map((t) => (
              <TaskCard key={t.id} task={t} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
