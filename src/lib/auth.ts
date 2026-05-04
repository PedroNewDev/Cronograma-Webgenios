import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { organization, magicLink } from "better-auth/plugins";
import { Resend } from "resend";
import { db } from "@/db";
import * as schema from "@/db/schema";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const FROM = process.env.EMAIL_FROM ?? "WebGenios <noreply@example.com>";

export const auth = betterAuth({
  appName: "WebGenios Command Center",
  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET,

  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
      organization: schema.organization,
      member: schema.member,
      invitation: schema.invitation,
    },
  }),

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    requireEmailVerification: false,
  },

  socialProviders: process.env.GOOGLE_CLIENT_ID
    ? {
        google: {
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        },
      }
    : undefined,

  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 dias
    updateAge: 60 * 60 * 24,       // refresh diário
    cookieCache: { enabled: true, maxAge: 60 * 5 },
  },

  plugins: [
    organization({
      // Papéis WebGenios
      // (Better Auth permite custom roles via access control — aqui registramos os strings)
      allowUserToCreateOrganization: true,
      organizationLimit: 5,
      membershipLimit: 100,
      sendInvitationEmail: async ({ email, invitation: inv, organization: org, inviter }) => {
        if (!resend) {
          console.log(`[invite] ${email} → ${org.name} (token=${inv.id}) — Resend não configurado.`);
          return;
        }
        const url = `${process.env.NEXT_PUBLIC_APP_URL}/invite/${inv.id}`;
        await resend.emails.send({
          from: FROM,
          to: email,
          subject: `${inviter.user.name} convidou você para ${org.name}`,
          html: inviteEmail({ orgName: org.name, inviterName: inviter.user.name, url }),
        });
      },
    }),
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        if (!resend) {
          console.log(`[magic-link] ${email} → ${url}`);
          return;
        }
        await resend.emails.send({
          from: FROM,
          to: email,
          subject: "Seu acesso ao WebGenios Command Center",
          html: magicLinkEmail({ url }),
        });
      },
    }),
  ],
});

export type Session = typeof auth.$Infer.Session;

/* ─── E-mails (HTML inline minimalista) ───────────────────── */

function inviteEmail({ orgName, inviterName, url }: { orgName: string; inviterName: string; url: string }) {
  return baseEmail(`
    <h1 style="font:600 22px/1.2 system-ui;color:#08090C;margin:0 0 12px">Você foi convidado</h1>
    <p style="font:400 14px/1.55 system-ui;color:#5F6672;margin:0 0 24px">
      <strong style="color:#08090C">${escape(inviterName)}</strong> convidou você para o workspace
      <strong style="color:#08090C">${escape(orgName)}</strong> no WebGenios Command Center.
    </p>
    <a href="${url}" style="display:inline-block;background:#7C5CFF;color:#fff;font:500 14px system-ui;padding:12px 20px;border-radius:8px;text-decoration:none">
      Aceitar convite
    </a>
    <p style="font:400 12px/1.5 system-ui;color:#9BA1AD;margin:24px 0 0">
      Convite expira em 7 dias. Se não foi você, ignore este e-mail.
    </p>
  `);
}

function magicLinkEmail({ url }: { url: string }) {
  return baseEmail(`
    <h1 style="font:600 22px/1.2 system-ui;color:#08090C;margin:0 0 12px">Seu acesso</h1>
    <p style="font:400 14px/1.55 system-ui;color:#5F6672;margin:0 0 24px">
      Clique no botão abaixo para entrar. Link expira em 5 minutos.
    </p>
    <a href="${url}" style="display:inline-block;background:#7C5CFF;color:#fff;font:500 14px system-ui;padding:12px 20px;border-radius:8px;text-decoration:none">
      Entrar no Command Center
    </a>
  `);
}

function baseEmail(content: string) {
  return `<!doctype html><html><body style="margin:0;background:#F5F6F8;padding:32px"><table align="center" style="max-width:480px;background:#fff;border-radius:12px;padding:32px;border:1px solid rgba(0,0,0,0.06)"><tr><td>${content}</td></tr></table></body></html>`;
}

function escape(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}
