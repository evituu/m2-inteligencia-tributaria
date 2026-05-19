# Arquitetura do Projeto — M2 Inteligência Tributária

Documento de referência sobre a arquitetura atual, organização de pastas e stack tecnológica utilizada no projeto.

---

## Visão Geral

O **M2 Inteligência Tributária** é uma aplicação web construída com **Next.js 16** (App Router) e **React 19**, utilizando **TypeScript**, **Tailwind CSS v4** e o sistema de componentes **shadcn/ui** (estilo `radix-nova`). O projeto adota uma arquitetura baseada em **React Server Components (RSC)** por padrão, com renderização híbrida e otimizações de fontes via `next/font`.

---

## Stack Tecnológica

### Núcleo (Framework e Linguagem)

| Tecnologia | Versão | Função |
|------------|--------|--------|
| **Next.js** | `16.2.6` | Framework full-stack React com App Router, SSR/SSG e RSC. |
| **React** | `19.2.4` | Biblioteca de interface (com Server Components). |
| **React DOM** | `19.2.4` | Renderizador do React para a web. |
| **TypeScript** | `^5` | Tipagem estática para JavaScript. |
| **Node Types** | `^20` | Tipos do Node.js para o ambiente de build. |

### Estilização

| Tecnologia | Versão | Função |
|------------|--------|--------|
| **Tailwind CSS** | `^4` | Framework utilitário de CSS (configuração via CSS, sem `tailwind.config`). |
| **@tailwindcss/postcss** | `^4` | Plugin PostCSS para o Tailwind v4. |
| **tw-animate-css** | `^1.4.0` | Animações utilitárias compatíveis com Tailwind. |
| **class-variance-authority** | `^0.7.1` | Criação de variantes de componentes tipadas (`cva`). |
| **clsx** | `^2.1.1` | Composição condicional de classes CSS. |
| **tailwind-merge** | `^3.6.0` | Mescla classes Tailwind sem conflito (usada em `cn()`). |

### UI / Componentes

| Tecnologia | Versão | Função |
|------------|--------|--------|
| **shadcn** | `^4.7.0` | CLI/sistema de componentes copiados para o projeto (estilo `radix-nova`). |
| **radix-ui** | `^1.4.3` | Primitivos acessíveis e sem estilo para construção dos componentes. |
| **lucide-react** | `^1.14.0` | Biblioteca de ícones SVG (configurada em `components.json`). |

### Qualidade de Código

| Tecnologia | Versão | Função |
|------------|--------|--------|
| **ESLint** | `^9` | Linter de código. |
| **eslint-config-next** | `16.2.6` | Regras oficiais do Next.js para ESLint. |

### Fontes

- **Geist Sans** e **Geist Mono** (via `next/font/google`), carregadas em `app/layout.tsx` como variáveis CSS (`--font-geist-sans`, `--font-geist-mono`).

---

## Estrutura de Pastas

```text
m2-inteligencia-tributaria/
├── app/                     # App Router do Next.js (rotas, layouts, páginas)
│   ├── favicon.ico
│   ├── globals.css          # Estilos globais + tokens shadcn (light/dark)
│   ├── layout.tsx           # Root layout (HTML, fontes, providers)
│   └── page.tsx             # Página inicial (rota /)
│
├── components/              # Componentes React reutilizáveis
│   └── ui/                  # Componentes base do shadcn/ui
│       ├── accordion.tsx
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── navigation-menu.tsx
│       ├── separator.tsx
│       ├── sheet.tsx
│       └── textarea.tsx
│
├── lib/                     # Utilitários e helpers compartilhados
│   └── utils.ts             # Função cn() para mesclar classes Tailwind
│
├── public/                  # Arquivos estáticos servidos diretamente
│   ├── images/
│   │   ├── logo/            # Logos da marca
│   │   └── office/          # Fotos/imagens institucionais
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
│
├── .next/                   # Build artifacts do Next.js (gerado, não versionar)
├── node_modules/            # Dependências instaladas (gerenciado pelo npm)
│
├── AGENTS.md                # Diretrizes para agentes de IA (Next.js novo)
├── CLAUDE.md                # Alias do AGENTS.md para o Claude
├── README.md                # Instruções básicas do create-next-app
├── ARQUITETURA.md           # Este documento
│
├── components.json          # Configuração do shadcn/ui (aliases, estilo)
├── eslint.config.mjs        # Configuração do ESLint (flat config)
├── next.config.ts           # Configuração do Next.js
├── next-env.d.ts            # Tipos automáticos do Next.js
├── postcss.config.mjs       # Configuração do PostCSS (Tailwind v4)
├── tsconfig.json            # Configuração do TypeScript
├── package.json             # Dependências e scripts npm
└── package-lock.json        # Lockfile do npm
```

---

## Detalhamento por Camada

### `app/` — Roteamento (App Router)

Utiliza o **App Router** do Next.js 16, onde cada pasta representa um segmento de rota. Os arquivos especiais reconhecidos pelo framework:

- `layout.tsx` — layout raiz, envolve todas as páginas, define `<html>` e `<body>`, carrega fontes e CSS global.
- `page.tsx` — define a UI da rota correspondente (atualmente a home `/`).
- `globals.css` — importa Tailwind, `tw-animate-css` e os estilos do shadcn; define tokens de tema (light/dark) via custom properties em `oklch()`.

Por padrão, os componentes em `app/` são **Server Components**. Use `"use client"` no topo do arquivo para optar por Client Components.

### `components/ui/` — Design System

Pasta destinada aos componentes do **shadcn/ui** (estilo `radix-nova`), instalados via CLI. Não são uma dependência npm — são código copiado para o projeto, permitindo customização total. Cada componente é composto por:

- Primitivos do **Radix UI** (acessibilidade e comportamento).
- Variantes tipadas com **`class-variance-authority`**.
- Classes mescladas com **`cn()`** (de `lib/utils.ts`).
- Ícones do **lucide-react**.

### `lib/` — Utilitários

Contém helpers compartilhados. Hoje há apenas `utils.ts` com a função `cn()`:

```7:7:components.json
  "iconLibrary": "lucide",
```

```1:7:lib/utils.ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### `public/` — Estáticos

Arquivos servidos diretamente na raiz do domínio. As subpastas `images/logo` e `images/office` já foram criadas para acomodar assets visuais da marca M2 e fotos institucionais.

---

## Aliases de Importação

Definidos em `tsconfig.json` (`paths`) e replicados em `components.json` para o shadcn CLI:

| Alias | Caminho |
|-------|---------|
| `@/*` | `./*` (raiz do projeto) |
| `@/components` | `./components` |
| `@/components/ui` | `./components/ui` |
| `@/lib` | `./lib` |
| `@/lib/utils` | `./lib/utils` |
| `@/hooks` | `./hooks` *(ainda não criada)* |

Exemplo de uso:

```tsx
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
```

---

## Configurações Importantes

### `components.json` (shadcn/ui)

- **Estilo:** `radix-nova` (nova linha visual do shadcn).
- **RSC:** habilitado (`true`) — componentes compatíveis com Server Components.
- **TSX:** habilitado.
- **CSS base:** `app/globals.css`.
- **Variáveis CSS:** habilitadas (tokens em `oklch()`).
- **Cor base:** `neutral`.
- **Biblioteca de ícones:** `lucide`.

### `next.config.ts`

Configuração mínima — sem customizações no momento. Ponto de extensão para futuras integrações (imagens externas, redirects, headers, middleware, etc.).

### `tsconfig.json`

- `target`: `ES2017`.
- `strict`: habilitado.
- `moduleResolution`: `bundler` (recomendado para Next.js moderno).
- Plugin oficial `next` ativado.

---

## Scripts npm

Definidos em `package.json`:

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint"
}
```

- **`npm run dev`** — servidor de desenvolvimento (hot reload).
- **`npm run build`** — build de produção.
- **`npm run start`** — executa o build de produção.
- **`npm run lint`** — análise estática com ESLint.

---

## Convenções e Boas Práticas Adotadas

1. **Server Components por padrão** — só usar `"use client"` quando houver necessidade real (estado, efeitos, eventos do navegador).
2. **Componentes UI isolados em `components/ui`** — fácil reuso e manutenção; novos componentes do shadcn devem ser adicionados via CLI (`npx shadcn@latest add <componente>`).
3. **Estilização exclusiva com Tailwind + tokens CSS** — evitar CSS modules ou styled-components; cores devem usar variáveis (`bg-background`, `text-foreground`, etc.) para suporte automático ao dark mode.
4. **Mesclagem de classes via `cn()`** — sempre usar para evitar conflitos do Tailwind.
5. **Aliases `@/`** em todos os imports internos — manter consistência e portabilidade.
6. **AGENTS.md** — alerta de que esta versão do Next.js possui breaking changes; consultar `node_modules/next/dist/docs/` antes de escrever código novo.

---

## Próximos Passos Sugeridos (Estrutura)

Conforme o projeto evoluir, considerar criar:

- `app/(rotas-agrupadas)/` — agrupamentos de rotas sem afetar a URL.
- `app/api/` — Route Handlers para endpoints serverless.
- `components/` *(fora de `ui/`)* — componentes de domínio (ex.: `Header`, `Footer`, `Hero`, `ContactForm`).
- `hooks/` — hooks customizados React (já mapeado em `components.json`).
- `lib/` — submódulos para integrações (ex.: `lib/api.ts`, `lib/validators.ts`).
- `types/` — definições TypeScript compartilhadas.
- `.env.local` — variáveis de ambiente (lembrar de adicionar ao `.gitignore`).

## Atualiza��o 2026-05-19 - Captacao de Leads
- O formulario da home exibe modal de sucesso apos envio, com CTA para WhatsApp e opcao de fechar para continuar na pagina.
- A API de leads (POST /api/leads) aplica limite de 3 envios por e-mail em janela de 30 minutos, retornando HTTP 429 ao exceder o limite.


## Atualizacao 2026-05-19 - Newsletter
- O componente `app/blog/_components/BlogNewsletterSection.tsx` agora envia assinatura real para `POST /api/newsletter/subscribe`.
- O endpoint `app/api/newsletter/subscribe/route.ts` valida payload com Zod e persiste por `upsert` em `NewsletterSubscriber`, reativando assinante com status `subscribed`.
