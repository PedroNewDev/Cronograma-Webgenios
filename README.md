# WebGenios Command Center

> O Command Center da WebGenios — onde demandas viram entregas, sem caos.

Substitui a planilha Google Sheets de gestão de demandas (Funil/Prazo/Status/Revisão) por um produto real, com IA e revisão estruturada.

## Stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript** estrito
- **Tailwind CSS v4** (config-in-CSS via `@theme`)
- **shadcn-style** componentes próprios (`tailwind-variants`)
- **Geist Sans/Mono** (Vercel)
- **Framer Motion**, **dnd-kit**, **cmdk**, **lucide-react**
- **TanStack Query** (servidor)
- **Drizzle ORM** + **Postgres** (próximas fases)
- **Better Auth** (próximas fases)
- **Soketi** (Pusher-compat OSS, self-host) — realtime
- **Anthropic SDK** direto — IA

## Setup local

```bash
npm install
cp .env.example .env       # preencher DATABASE_URL + BETTER_AUTH_SECRET (mínimo)
npm run db:push            # cria tabelas no Postgres
npm run dev                # http://localhost:3000
```

Outros comandos:

```bash
npm run build
npm run typecheck
npm run db:studio          # GUI Drizzle pra inspecionar dados
npm run db:generate        # gera migration SQL após mudar schema
```

Requer Node 20+ (Node 24 LTS recomendado) e Postgres 14+.

## Deploy (não fazer agora)

Configurado para self-host na VPS Contabo + aaPanel:

- `next.config.ts` → `output: "standalone"`
- Servir via PM2 atrás do Nginx do aaPanel
- Postgres no plugin nativo do aaPanel
- Soketi em porta dedicada para realtime

## Estrutura

```
src/
  app/
    layout.tsx          # GeistSans/Mono + globals
    page.tsx            # Demo da Fase 1 (kanban + IA insight)
    globals.css         # Tokens (@theme) + utilitários (glass, glow)
  components/
    ui/                 # Button, Card, Badge, Avatar, Kbd, Logo
    shell/              # Sidebar, Topbar, CommandPalette, Shell
    demo/               # TaskCard, KanbanPreview (mock)
  lib/
    utils.ts            # cn(), initialsOf(), formatPrazo()
```

## Status

### Fase 1 — Setup & Design System ✅

- [x] Tokens (cores, raios, tipografia, densidade, sombras)
- [x] `Button` (5 variantes × 4 tamanhos)
- [x] `Card` + `PriorityRail` + `CardHeader/Title/Description/Footer`
- [x] `Badge` (5 tons semânticos)
- [x] `Avatar` + `AvatarStack` (gradient determinístico por nome)
- [x] `Kbd`
- [x] `Logo` (Spark W — wordmark + spark roxo no ápice)
- [x] `Sidebar` colapsável + funis + perfil
- [x] `Topbar` com search trigger
- [x] `CommandPalette` (`⌘K`) com grupos: Ações / Navegação / Recentes
- [x] Demo: Kanban estático com 4 colunas, 7 demandas reais

### Fase 2 — Auth & Multi-tenant ✅

- [x] **Drizzle ORM** + Postgres (`src/db/schema.ts`, `src/db/index.ts`)
- [x] **Better Auth** server + client (e-mail/senha, Google OAuth, Magic Link)
- [x] **Organization plugin** = workspaces multi-tenant (papéis: admin/leader/member/reviewer/client)
- [x] **Resend** para convites + magic links
- [x] Middleware de proteção de rotas (`src/middleware.ts`)
- [x] Route groups: `(auth)` (login/signup/setup/forgot) + `(app)` (área logada)
- [x] Telas: `/login`, `/signup`, `/setup` (criar workspace), `/forgot`, `/invite/[token]`
- [x] Sidebar com session real + sign out

Schema completo em [src/db/schema.ts](src/db/schema.ts). Detalhes em [AUTH.md](AUTH.md).

### Fase 3 — Funis & Demandas ✅

- [x] Server actions `src/server/funnels.ts` (list/get/create/archive)
- [x] Server actions `src/server/tasks.ts` (list/create/move/delete)
- [x] Sidebar com funis reais da org corrente (`ShellServer` em `src/components/shell/shell-server.tsx`)
- [x] Página `/funnels/new` — criar funil com paleta de 6 cores
- [x] Página `/f/[id]` — board kanban funcional
- [x] Componente `Board` com drag-drop entre colunas (dnd-kit + `useOptimistic`)
- [x] "Adicionar demanda" inline em cada coluna
- [x] Código sequencial WG-NNN por org
- [x] Multi-tenant: toda query filtra por `organizationId` ativo
- [x] Empty state na home + cards de funis ativos

## Próximo (Fase 4)

Detalhe da demanda (drawer), comentários com @mentions, dependências, fluxo de revisão em 2 estágios, Meu Dia, calendário, automações, IA insight com dados reais.

## Branding

- **Logo:** Spark W (W estilizado com faísca luminosa no vértice central)
- **Accent único:** `#7C5CFF` (roxo elétrico)
- **Tipo:** Geist Sans (UI) + Geist Mono (IDs/atalhos)

Detalhes em [DESIGN.md](./DESIGN.md).
