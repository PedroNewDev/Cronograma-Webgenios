"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Field } from "@/components/ui/input";
import { Divider } from "@/components/ui/divider";
import { signIn } from "@/lib/auth-client";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get("next") ?? "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [magicSent, setMagicSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onPasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await signIn.email({ email, password });
    setLoading(false);
    if (res.error) return setError(res.error.message ?? "Não foi possível entrar.");
    router.push(next);
  }

  async function onMagicLink() {
    if (!email) return setError("Informe seu e-mail acima.");
    setError(null);
    setLoading(true);
    const res = await signIn.magicLink({ email, callbackURL: next });
    setLoading(false);
    if (res.error) return setError(res.error.message ?? "Não foi possível enviar o link.");
    setMagicSent(true);
  }

  async function onGoogle() {
    await signIn.social({ provider: "google", callbackURL: next });
  }

  if (magicSent) {
    return (
      <div className="text-center">
        <div className="size-12 mx-auto mb-5 rounded-full grid place-items-center bg-[color:var(--color-accent)]/12 border border-[color:var(--color-accent)]/30">
          <Mail className="size-5 text-[color:var(--color-accent)]" />
        </div>
        <h1 className="text-[20px] font-semibold tracking-tight mb-2">Link enviado</h1>
        <p className="text-[13.5px] text-[color:var(--color-text-secondary)] leading-relaxed mb-6">
          Enviamos um link de acesso para <strong className="text-[color:var(--color-text-primary)]">{email}</strong>.
          Expira em 5 minutos.
        </p>
        <Button variant="ghost" size="sm" onClick={() => setMagicSent(false)}>Voltar</Button>
      </div>
    );
  }

  return (
    <>
      <div className="mb-7">
        <h1 className="text-[24px] font-semibold tracking-tight mb-1.5">Entrar</h1>
        <p className="text-[13.5px] text-[color:var(--color-text-secondary)]">
          Acesse seu Command Center.
        </p>
      </div>

      <Button variant="secondary" size="lg" className="w-full mb-3" onClick={onGoogle} type="button">
        <GoogleIcon /> Continuar com Google
      </Button>

      <Divider className="my-5">ou</Divider>

      <form onSubmit={onPasswordSubmit} className="space-y-4">
        <Field label="E-mail" htmlFor="email">
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="voce@empresa.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Field>

        <Field
          label="Senha"
          htmlFor="password"
          hint={
            <Link href="/forgot" className="text-[color:var(--color-accent)] hover:underline">
              Esqueci minha senha
            </Link>
          }
        >
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />
        </Field>

        {error && (
          <div className="text-[12.5px] text-[color:var(--color-danger)] bg-[color:var(--color-danger)]/10 border border-[color:var(--color-danger)]/25 rounded-md px-3 py-2">
            {error}
          </div>
        )}

        <Button variant="primary" size="lg" type="submit" loading={loading} className="w-full">
          Entrar <ArrowRight className="size-4" />
        </Button>

        <Button variant="ghost" size="md" type="button" onClick={onMagicLink} className="w-full" disabled={loading}>
          <Mail className="size-4" /> Enviar link de acesso
        </Button>
      </form>

      <p className="mt-7 text-center text-[12.5px] text-[color:var(--color-text-secondary)]">
        Sem conta?{" "}
        <Link href="/signup" className="text-[color:var(--color-accent)] hover:underline font-medium">
          Criar workspace
        </Link>
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
