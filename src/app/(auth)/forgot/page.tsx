"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Field } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

export default function ForgotPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await authClient.requestPasswordReset({
      email,
      redirectTo: "/reset",
    });
    setLoading(false);
    if (res.error) return setError(res.error.message ?? "Não foi possível enviar.");
    setSent(true);
  }

  if (sent) {
    return (
      <div className="text-center">
        <div className="size-12 mx-auto mb-5 rounded-full grid place-items-center bg-[color:var(--color-accent)]/12 border border-[color:var(--color-accent)]/30">
          <Mail className="size-5 text-[color:var(--color-accent)]" />
        </div>
        <h1 className="text-[20px] font-semibold tracking-tight mb-2">Verifique seu e-mail</h1>
        <p className="text-[13.5px] text-[color:var(--color-text-secondary)] leading-relaxed mb-6">
          Se houver conta para <strong>{email}</strong>, enviamos instruções para redefinir a senha.
        </p>
        <Link href="/login" className="text-[13px] text-[color:var(--color-accent)] hover:underline">Voltar ao login</Link>
      </div>
    );
  }

  return (
    <>
      <div className="mb-7">
        <h1 className="text-[24px] font-semibold tracking-tight mb-1.5">Recuperar acesso</h1>
        <p className="text-[13.5px] text-[color:var(--color-text-secondary)]">
          Enviamos um link para redefinir sua senha.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="E-mail" htmlFor="email">
          <Input id="email" type="email" autoComplete="email" required
            value={email} onChange={(e) => setEmail(e.target.value)} />
        </Field>

        {error && (
          <div className="text-[12.5px] text-[color:var(--color-danger)] bg-[color:var(--color-danger)]/10 border border-[color:var(--color-danger)]/25 rounded-md px-3 py-2">
            {error}
          </div>
        )}

        <Button variant="primary" size="lg" type="submit" loading={loading} className="w-full">
          Enviar link de recuperação
        </Button>
      </form>

      <p className="mt-6 text-center text-[12.5px] text-[color:var(--color-text-secondary)]">
        Lembrou a senha?{" "}
        <Link href="/login" className="text-[color:var(--color-accent)] hover:underline font-medium">
          Voltar ao login
        </Link>
      </p>
    </>
  );
}
