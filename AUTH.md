# AUTH — Autenticação & Multi-tenant

Better Auth como autoridade. Drizzle como ORM. Postgres como persistência.

## Por que Better Auth (e não NextAuth/Auth.js)?

- **Organizations nativo** com convites, papéis, switching. NextAuth precisa de plugins externos pouco maduros.
- **API server-side limpa** (`auth.api.*`) sem precisar de Server Actions wrapper.
- **TypeScript-first** com inferência de tipos do schema.
- **Sem lock-in de provider** (postgres direto via Drizzle).

## Estrutura

```
src/
  db/
    schema.ts            # Tabelas Better Auth (user, session, account, verification)
                         # + Organization plugin (organization, member, invitation)
                         # + Domain placeholder (funnel, task) — Fase 3+
    index.ts             # Cliente postgres-js + drizzle (singleton)
  lib/
    auth.ts              # betterAuth({...}) — server config
    auth-client.ts       # createAuthClient({...}) — para componentes
  app/
    api/auth/[...all]/   # Handler único Better Auth
    (auth)/              # Layout split-screen — login/signup/setup/forgot
    (app)/               # Layout protegido — requer sessão + org ativa
    invite/[token]/      # Aceitar convite (RSC + server actions)
  server/
    session.ts           # getSession() / getActiveOrg() helpers cacheados
  middleware.ts          # Edge middleware — redireciona não-autenticados
```

## Fluxos

### Cadastro novo
1. `/signup` → cria user (email/password ou Google)
2. Redireciona para `/setup` → cria organization (= workspace)
3. `setActive` na sessão → vai pra `/`

### Login existente
1. `/login` → email/password OU magic link OU Google
2. Sessão tem `activeOrganizationId` → vai pra `/` (ou `?next=`)
3. Sessão sem org ativa → AppLayout ativa a primeira

### Convite
1. Admin chama `organization.inviteMember({ email, role })`
2. Better Auth dispara `sendInvitationEmail` → Resend → e-mail HTML estilizado
3. Convidado clica → `/invite/[token]` → exige login → aceita ou rejeita
4. Aceitar cria `member` row e ativa a org

## Papéis WebGenios

| Role | Pode |
|---|---|
| `admin` | Tudo: gerenciar membros, billing, automações, deletar |
| `leader` | Criar funis, gerenciar demandas, aprovar revisões |
| `member` | Criar/editar próprias demandas, comentar |
| `reviewer` | Apenas revisar demandas atribuídas |
| `client` | Read-only em funis específicos (compartilhamento externo) |

Permissões granulares por funil ficam em `funnel_member.role` (Fase 3).

## Variáveis críticas

```
DATABASE_URL              # Postgres connection
BETTER_AUTH_SECRET        # 32+ bytes — openssl rand -base64 32
BETTER_AUTH_URL           # http://localhost:3000 (dev) / https://command.webgenios.com.br (prod)
NEXT_PUBLIC_APP_URL       # mesmo que BETTER_AUTH_URL
RESEND_API_KEY            # opcional — sem ele, e-mails caem em console.log
EMAIL_FROM                # remetente verificado no Resend
GOOGLE_CLIENT_ID/SECRET   # opcional — sem, o botão "Continuar com Google" falha
```

## Comandos

```bash
npm run db:push           # cria/atualiza tabelas no Postgres (dev)
npm run db:generate       # gera migration SQL versionada (prod)
npm run db:migrate        # aplica migrations
npm run db:studio         # GUI Drizzle
```

## Sessões

- Duração: 30 dias
- Refresh: a cada 24h de uso
- Cookie cache: 5 minutos (reduz hits no DB)
- Cookie httpOnly + sameSite=lax + secure em prod

Para acessar sessão em RSC:

```ts
import { getSession, getActiveOrg } from "@/server/session";
const { user } = await getSession();
const { id: orgId } = await getActiveOrg();
```

Em client:

```tsx
import { useSession } from "@/lib/auth-client";
const { data: session, isPending } = useSession();
```

## Deploy notes (não fazer agora)

- `BETTER_AUTH_URL` precisa bater com domínio público
- `secure` cookie só funciona em HTTPS — Nginx do aaPanel deve ter SSL ativo
- Postgres da VPS: criar role `wg_user` + database `wg_command` no plugin Postgres do aaPanel
- Resend: adicionar SPF/DKIM no Cloudflare do domínio remetente
