import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { ArrowRight } from "lucide-react";
import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";

export default async function AcceptInvitePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect(`/login?next=/invite/${token}`);

  let invitation: Awaited<ReturnType<typeof auth.api.getInvitation>> | null = null;
  try {
    invitation = await auth.api.getInvitation({
      query: { id: token },
      headers: await headers(),
    });
  } catch {
    invitation = null;
  }

  if (!invitation) {
    return (
      <Centered>
        <h1 className="text-[20px] font-semibold tracking-tight mb-2">Convite inválido</h1>
        <p className="text-[13.5px] text-[color:var(--color-text-secondary)] mb-6">
          Este convite expirou ou não existe. Peça um novo para o admin do workspace.
        </p>
      </Centered>
    );
  }

  return (
    <Centered>
      <h1 className="text-[22px] font-semibold tracking-tight mb-1.5">
        Você foi convidado para <span className="text-[color:var(--color-accent)]">{invitation.organizationName}</span>
      </h1>
      <p className="text-[13.5px] text-[color:var(--color-text-secondary)] mb-6">
        Como <strong className="text-[color:var(--color-text-primary)]">{invitation.role}</strong>. Aceitar dá acesso aos
        funis e demandas do workspace.
      </p>

      <form
        action={async () => {
          "use server";
          await auth.api.acceptInvitation({
            body: { invitationId: token },
            headers: await headers(),
          });
          redirect("/");
        }}
      >
        <Button variant="primary" size="lg" type="submit" className="w-full">
          Aceitar convite <ArrowRight className="size-4" />
        </Button>
      </form>

      <form
        action={async () => {
          "use server";
          await auth.api.rejectInvitation({
            body: { invitationId: token },
            headers: await headers(),
          });
          redirect("/login");
        }}
        className="mt-2"
      >
        <Button variant="ghost" size="md" type="submit" className="w-full">Recusar</Button>
      </form>
    </Centered>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-[420px]">
        <div className="mb-8 flex justify-center"><Logo /></div>
        <div className="glass rounded-[var(--radius-xl)] p-8">{children}</div>
      </div>
    </div>
  );
}
