"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Field } from "@/components/ui/input";
import { Divider } from "@/components/ui/divider";
import { signUp, signIn } from "@/lib/auth-client";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    let res;
    try {
      res = await signUp.email({ name, email, password });
    } catch (err) {
      setLoading(false);
      console.error("[signup] throw", err);
      return setError(`Exceção: ${err instanceof Error ? err.message : String(err)}`);
    }
    setLoading(false);
    console.log("[signup] full response:", JSON.stringify(res, null, 2));
    if (res.error) {
      const e = res.error as Record<string, unknown>;
      console.error("[signup] error keys:", Object.keys(e), e);
      return setError(
        (e.message as string) ||
          (e.statusText as string) ||
          (e.code as string) ||
          `Erro: ${JSON.stringify(e) || "vazio"} — veja terminal do server.`,
      );
    }
    router.push("/");
  }

  return (
    <>
      <div className="mb-7">
        <h1 className="text-[24px] font-semibold tracking-tight mb-1.5">Criar conta</h1>
        <p className="text-[13.5px] text-[color:var(--color-text-secondary)]">
          Acesso interno do time WebGenios.
        </p>
      </div>

      <Button variant="secondary" size="lg" className="w-full mb-3" type="button"
        onClick={() => signIn.social({ provider: "google", callbackURL: "/" })}>
        <GoogleIcon /> Continuar com Google
      </Button>

      <Divider className="my-5">ou</Divider>

      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="Nome completo" htmlFor="name">
          <Input
            id="name" autoComplete="name" placeholder="Pedro Farias" required
            value={name} onChange={(e) => setName(e.target.value)}
          />
        </Field>

        <Field label="E-mail corporativo" htmlFor="email">
          <Input
            id="email" type="email" autoComplete="email" placeholder="voce@empresa.com" required
            value={email} onChange={(e) => setEmail(e.target.value)}
          />
        </Field>

        <Field label="Senha" htmlFor="password" hint="Mínimo 8 caracteres.">
          <Input
            id="password" type="password" autoComplete="new-password" placeholder="••••••••" required minLength={8}
            value={password} onChange={(e) => setPassword(e.target.value)}
          />
        </Field>

        {error && (
          <div className="text-[12.5px] text-[color:var(--color-danger)] bg-[color:var(--color-danger)]/10 border border-[color:var(--color-danger)]/25 rounded-md px-3 py-2">
            {error}
          </div>
        )}

        <Button variant="primary" size="lg" type="submit" loading={loading} className="w-full">
          Criar conta <ArrowRight className="size-4" />
        </Button>
      </form>

      <p className="mt-6 text-center text-[12.5px] text-[color:var(--color-text-secondary)]">
        Já tem conta?{" "}
        <Link href="/login" className="text-[color:var(--color-accent)] hover:underline font-medium">
          Entrar
        </Link>
      </p>

      <p className="mt-6 text-center text-[10.5px] text-[color:var(--color-text-muted)] leading-relaxed">
        Acesso restrito ao time WebGenios.
      </p>
    </>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
      <path fill="#EA4335" d="M12 11v3.2h4.5c-.2 1.2-1.4 3.5-4.5 3.5-2.7 0-4.9-2.2-4.9-5s2.2-5 4.9-5c1.5 0 2.6.7 3.2 1.2l2.2-2.1C15.9 5.4 14.1 4.5 12 4.5 7.9 4.5 4.5 7.9 4.5 12s3.4 7.5 7.5 7.5c4.3 0 7.2-3 7.2-7.3 0-.5-.1-.9-.2-1.2H12z"/>
    </svg>
  );
}
