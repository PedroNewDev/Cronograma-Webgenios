import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Sparkles, FolderKanban } from "lucide-react";
import { listFunnels } from "@/server/funnels";

export default async function HomePage() {
  const funnels = await listFunnels();

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-semibold tracking-tight">Início</h1>
          <p className="text-[13px] text-[color:var(--color-text-secondary)] mt-0.5">
            Visão geral dos funis ativos do workspace.
          </p>
        </div>
        <Link href="/funnels/new">
          <Button variant="primary" size="sm">
            <Plus className="size-4" /> Novo funil
          </Button>
        </Link>
      </header>

      {funnels.length === 0 ? (
        <Card className="!p-10 text-center">
          <div className="size-12 mx-auto rounded-xl grid place-items-center bg-[color:var(--color-accent)]/15 border border-[color:var(--color-accent)]/30 mb-4">
            <FolderKanban className="size-5 text-[color:var(--color-accent)]" />
          </div>
          <CardTitle className="!text-[18px] mb-1.5">Nenhum funil ainda</CardTitle>
          <CardDescription className="max-w-md mx-auto mb-5">
            Funis agrupam demandas de um projeto, lançamento ou cliente. Crie o primeiro pra começar.
          </CardDescription>
          <Link href="/funnels/new">
            <Button variant="primary" size="md">
              <Plus className="size-4" /> Criar primeiro funil
            </Button>
          </Link>
        </Card>
      ) : (
        <>
          <Card className="!p-5">
            <div className="flex items-start gap-3">
              <div className="size-8 rounded-lg grid place-items-center bg-[color:var(--color-accent)]/15 border border-[color:var(--color-accent)]/30 shrink-0">
                <Sparkles className="size-4 text-[color:var(--color-accent)]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <CardTitle>Insight do agente</CardTitle>
                  <Badge tone="accent">IA</Badge>
                </div>
                <CardDescription>
                  {funnels.length} funil{funnels.length === 1 ? "" : "s"} ativo
                  {funnels.length === 1 ? "" : "s"}, com{" "}
                  {funnels.reduce((acc, f) => acc + f.count, 0)} demandas em aberto. Use a barra lateral
                  pra acessar cada quadro.
                </CardDescription>
              </div>
            </div>
          </Card>

          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {funnels.map((f) => (
              <Link key={f.id} href={`/f/${f.id}`}>
                <Card className="hover:border-[color:var(--color-border-strong)] hover:translate-y-[-1px] cursor-pointer h-full">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="size-2 rounded-full" style={{ background: f.color }} />
                    <CardTitle className="!text-[14.5px]">{f.name}</CardTitle>
                  </div>
                  <CardDescription className="!text-[12px]">
                    {f.count} demanda{f.count === 1 ? "" : "s"} em aberto
                  </CardDescription>
                </Card>
              </Link>
            ))}
          </section>
        </>
      )}
    </div>
  );
}
