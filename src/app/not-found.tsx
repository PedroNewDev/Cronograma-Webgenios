import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 text-center bg-[color:var(--color-bg-base)]">
      <span className="text-5xl font-bold text-[color:var(--color-text-muted)]">404</span>
      <h2 className="text-lg font-semibold text-[color:var(--color-text-primary)]">
        Página não encontrada
      </h2>
      <p className="text-sm text-[color:var(--color-text-muted)]">
        A página que você procura não existe.
      </p>
      <Link
        href="/"
        className="text-sm px-4 py-2 rounded-md bg-white/[0.06] hover:bg-white/[0.1] text-[color:var(--color-text-primary)] transition-colors"
      >
        Voltar ao início
      </Link>
    </div>
  );
}
