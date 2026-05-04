import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input, Field } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { createFunnel } from "@/server/funnels";

const PALETTE = ["#7C5CFF", "#34D399", "#F5B544", "#F26B6B", "#60A5FA", "#EC4899"];

export default function NewFunnelPage() {
  return (
    <div className="max-w-[480px] mx-auto">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-[12.5px] text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text-primary)] mb-4"
      >
        <ArrowLeft className="size-3.5" /> Voltar
      </Link>

      <Card className="!p-6">
        <h1 className="text-[20px] font-semibold tracking-tight mb-1">Novo funil</h1>
        <p className="text-[13px] text-[color:var(--color-text-secondary)] mb-5">
          Um agrupamento de demandas: projeto, lançamento, cliente ou squad.
        </p>

        <form action={createFunnel} className="space-y-4">
          <Field label="Nome" htmlFor="name">
            <Input
              id="name"
              name="name"
              placeholder="Lançamento Alpha-Gal"
              required
              autoFocus
              maxLength={80}
            />
          </Field>

          <div>
            <label className="block text-[12.5px] font-medium text-[color:var(--color-text-secondary)] mb-1.5">
              Cor
            </label>
            <div className="flex gap-2 flex-wrap">
              {PALETTE.map((c, i) => (
                <label
                  key={c}
                  className="cursor-pointer size-8 rounded-full grid place-items-center ring-2 ring-transparent has-[:checked]:ring-white/40 transition-all hover:scale-110"
                  style={{ background: c }}
                >
                  <input
                    type="radio"
                    name="color"
                    value={c}
                    defaultChecked={i === 0}
                    className="sr-only"
                  />
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Link href="/" className="flex-1">
              <Button variant="ghost" size="md" type="button" className="w-full">
                Cancelar
              </Button>
            </Link>
            <Button variant="primary" size="md" type="submit" className="flex-1">
              Criar funil
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
