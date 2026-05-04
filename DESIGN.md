# DESIGN — WebGenios Command Center

Direção visual, tokens e regras de uso. Este doc é a autoridade — se algo conflitar com código novo, o código se ajusta.

---

## 1. Princípios

1. **Quiet Tech** — Linear encontra Dark Glassmorphism contido. Nada de cassino, nada de neon piscando.
2. **Funcional minimalismo** — pouca coisa visível, muita coisa a um atalho (`⌘K`).
3. **Densidade configurável** — `confortável | compacto | denso`. Nunca forçar uma escolha.
4. **Animação com propósito** — toda transição responde a uma ação real. Latência percebida < 100ms.
5. **Acessibilidade não-negociável** — WCAG AA mínimo, foco visível, teclado-first, `prefers-reduced-motion`.

## 2. Paleta

Tokens em `src/app/globals.css` via `@theme`. Use sempre via `var(--color-*)`, nunca hardcoded.

### Backgrounds

| Token | Hex | Uso |
|---|---|---|
| `--color-bg-base` | `#08090C` | Fundo do app |
| `--color-bg-elevated` | `#0F1116` | Sidebar, painéis fixos |
| `--color-bg-overlay` | `#14171F` | Modais, popovers |
| `--color-surface-glass` | `rgba(20,22,28,0.55)` | + `backdrop-blur(20px)` em cards |
| `--color-surface-raised` | `rgba(255,255,255,0.03)` | Inputs, botões secundários |

### Bordas

| Token | Uso |
|---|---|
| `--color-border-subtle` | Padrão de tudo |
| `--color-border-strong` | Hover de elementos interativos |
| `--color-border-focus` | Anel de foco (com offset 2px) |

### Texto

| Token | Hex | Uso |
|---|---|---|
| `--color-text-primary` | `#F5F6F8` | Títulos, conteúdo principal |
| `--color-text-secondary` | `#9BA1AD` | Labels, descrições |
| `--color-text-muted` | `#5F6672` | Metadata, IDs, timestamps |

### Accent (único, identitário)

`--color-accent: #7C5CFF` — usado com **parcimônia**: CTAs primários, badges "IA", logo, foco. Nunca em backgrounds grandes.

### Semânticos

| Tom | Token | Quando usar |
|---|---|---|
| Success | `#34D399` | Aprovado, entregue, métricas positivas |
| Warning | `#F5B544` | Aguardando revisão, prazo em 1-3d |
| Danger | `#F26B6B` | Atrasada, urgente, erro |
| Info | `#60A5FA` | Em produção, neutro informativo |

### Prazo (gradient temporal)

Cor do badge muda conforme aproxima:

- `> 7d` → muted (`--color-due-far`)
- `1-3d` → warning amarelado
- `Hoje / atrasada` → danger

## 3. Tipografia

- **UI:** Geist Sans (peso 400/500/600)
- **Mono:** Geist Mono (IDs `WG-247`, atalhos, números tabulares)
- **Tamanhos canônicos:** `10px` micro / `11px` chips / `12.5px` corpo dense / `13px` corpo / `15px` títulos / `18-28px` heroes
- **Tracking:** títulos com `tracking-tight`. Tabular-nums em métricas.

Sem sublinhado decorativo. Sem `text-transform: uppercase` exceto em group headings (10px, letter-spacing 0.08em).

## 4. Espaçamento

Grid de **4px** (Tailwind default). Padding interno de cards: `16px (p-4)`. Gap entre cards: `10px (gap-2.5)`. Toolbar: `8px (gap-2)`.

Densidade de linha:
- Comfy: `56px`
- Compact: `44px` (mínimo touch — mobile default)
- Dense: `36px` (desktop power user)

## 5. Raios

| Token | Px | Uso |
|---|---|---|
| `--radius-xs` | 4 | Kbd, chips minúsculos |
| `--radius-sm` | 6 | Inputs pequenos, focus ring |
| `--radius-md` | 8 | Botões, badges |
| `--radius-lg` | 12 | Cards |
| `--radius-xl` | 16 | Modais, command palette |

## 6. Sombras

Apenas duas:

- `--shadow-glass` — eleva painéis vidro com inset claro no topo + drop sombra abaixo
- `--shadow-pop` — modais e dropdowns

Não usar `box-shadow` arbitrário.

## 7. Componentes-chave

### Button

Variantes: `primary | secondary | ghost | danger | glass`. Tamanhos: `sm | md | lg | icon`.
- `primary` é roxo, glow sutil. Limite 1 por tela em ações principais.
- `ghost` para toolbars.
- `glass` para flutuar sobre fundos ricos (apenas no shell).

### Card

Sempre com `glass`. `PriorityRail` é uma faixa lateral fina (3px) à esquerda, NÃO um badge. Cor pela prioridade.

### Avatar

Gradient determinístico por hash do nome — mesmo nome sempre mesma cor. `AvatarStack` empilha com ring no `--color-bg-base` (encaixe limpo).

### Command Palette

Trigger: `⌘K` global. Grupos sempre nesta ordem: **Ações → Navegação → Recentes → Demandas/Pessoas/Funis (busca semântica)**. Nada de submenus.

### Sidebar

- Larga: 248px. Colapsada: 64px (só ícones).
- Estado persistido por usuário (próx fase).
- Funis com bolinha colorida, não badge.

## 8. Animação

- Entradas: `fade-in zoom-in-95 duration-150`
- Hover de card: `translate-y-[-1px]` + borda mais forte
- Active: `scale-[0.98]`
- Drag: física via Framer/dnd-kit (próx fase)

Tudo respeita `prefers-reduced-motion`.

## 9. Microcopy (PT-BR)

- **Imperativos curtos:** "Nova demanda", "Aplicar sugestão", "Dispensar"
- **Sem "Submit" ou "Add cru"** → "Criar", "Adicionar revisor"
- **Estado:** "Aguardando revisão" (não "Pending review")
- **Tom:** profissional-direto, sem gírias, sem "vamos lá!"

## 10. Não fazer

- ❌ Glow exagerado, neon piscando, gradientes arco-íris
- ❌ Emojis na UI core (só em reações de comentário)
- ❌ Material UI, Chakra, Ant — nada de admin genérico
- ❌ Esconder funcionalidade em > 2 níveis de menu
- ❌ Onboarding > 3 passos
