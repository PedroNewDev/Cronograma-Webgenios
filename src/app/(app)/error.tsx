"use client";

import { useEffect } from "react";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
      <h2 className="text-lg font-semibold text-[color:var(--color-text-primary)]">
        Algo deu errado
      </h2>
      <p className="text-sm text-[color:var(--color-text-muted)] max-w-xs">
        {error.message ?? "Ocorreu um erro inesperado."}
      </p>
      <button
        onClick={reset}
        className="text-sm px-4 py-2 rounded-md bg-white/[0.06] hover:bg-white/[0.1] text-[color:var(--color-text-primary)] transition-colors"
      >
        Tentar novamente
      </button>
    </div>
  );
}
