import type { ReactNode } from "react";
import { Logo } from "@/components/ui/logo";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative z-10 min-h-screen grid grid-cols-1 lg:grid-cols-[1fr_minmax(420px,520px)]">
      {/* Lado esquerdo — pitch (some no mobile) */}
      <aside className="hidden lg:flex relative overflow-hidden border-r border-[color:var(--color-border-subtle)]">
        {/* Orbe extra mais forte só dentro do auth */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 700px 500px at 30% 30%, rgba(124,92,255,0.22), transparent 60%), radial-gradient(ellipse 700px 600px at 80% 80%, rgba(72,158,255,0.15), transparent 60%)",
          }}
        />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Logo />
          <div className="max-w-[420px]">
            <h2 className="text-[34px] font-semibold tracking-tight leading-[1.1] mb-4">
              Onde demandas viram entregas, sem caos.
            </h2>
            <p className="text-[14.5px] text-[color:var(--color-text-secondary)] leading-relaxed">
              O Command Center da WebGenios. Substitui sua planilha por um produto real — com revisão
              estruturada, automações e IA que enxerga o que vai atrasar antes de você.
            </p>
          </div>
          <p className="text-[11.5px] text-[color:var(--color-text-muted)]">
            © 2026 WebGenios. Built with care in São Paulo.
          </p>
        </div>
      </aside>

      {/* Lado direito — formulário */}
      <main className="flex items-center justify-center p-6">
        <div className="w-full max-w-[380px]">
          <div className="lg:hidden mb-8 flex justify-center">
            <Logo />
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
