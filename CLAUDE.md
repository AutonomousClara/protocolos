# ProtocolOS - Sprint 4+5 Híbrido

> **Objetivo:** Completar v1.0 MVP Aluno implementando core features + polish essencial.

**Prioridade:** Opção 3 (Híbrido) — 7 issues críticas  
**Timeline:** 1 semana (~7 dias)  
**Deploy:** https://protocolos-two.vercel.app

---

## 🎯 Contexto do Projeto

**O que é:** App de acompanhamento de treino e dieta.  
**Stack:** Next.js 14, Prisma, Supabase, Tailwind, NextAuth, Groq  
**Estado atual:** 90% completo (23/34 issues fechadas)  
**Falta:** CRUD completo, mobile responsivo, polish essencial

---

## 📋 Issues a Implementar (Ordem de Prioridade)

### FASE 1: UX Critical (Dia 1-2)

#### Issue #27: Mobile Responsive (P1) 🔴 CRÍTICO
**Por que:** App inutilizável no celular (maioria dos usuários)

**O que fazer:**
- [ ] Layout responsivo em todas as páginas
- [ ] Testar em viewport 375px (iPhone SE) e 428px (iPhone 14 Pro Max)
- [ ] Sidebar mobile (hamburger menu ou bottom nav)
- [ ] Cards de treino/dieta responsivos
- [ ] Forms responsivos (upload, check-in)
- [ ] Dashboard responsivo (gráficos, calendário)

**Acceptance Criteria:**
- [ ] AC1: App funcional em mobile (touch, scroll, navigation)
- [ ] AC2: Textos legíveis sem zoom
- [ ] AC3: Botões clicáveis (min 44x44px)
- [ ] AC4: Forms usáveis (inputs, selects)
- [ ] AC5: Gráficos responsivos (recharts responsive)

**Files afetados:**
- `app/layout.tsx` (sidebar mobile)
- `components/protocol/*` (cards)
- `app/dashboard/page.tsx`
- `app/protocol/page.tsx`

---

#### Issue #31: Melhorar Visualização (P1) 🔴 CRÍTICO
**Por que:** UX atual é confusa, usuário se perde

**O que fazer:**
- [ ] Organizar treinos por dia da semana (A, B, C, etc)
- [ ] Agrupar exercícios por grupo muscular
- [ ] Melhorar layout de refeições (café, almoço, jantar, lanches)
- [ ] Adicionar ícones pra facilitar escaneabilidade
- [ ] Melhorar hierarquia visual (headings, espaçamento)
- [ ] Breadcrumbs ou indicador de onde o usuário está

**Acceptance Criteria:**
- [ ] AC1: Treinos agrupados por dia (Treino A, B, C visível)
- [ ] AC2: Exercícios agrupados por músculo (Peito, Costas, Pernas)
- [ ] AC3: Refeições separadas (Café, Almoço, Jantar, Lanches)
- [ ] AC4: Ícones ajudam a identificar tipo (💪 treino, 🍽️ dieta)
- [ ] AC5: Navegação clara (usuário sabe onde está)

**Files afetados:**
- `components/protocol/WorkoutCard.tsx`
- `components/protocol/DietCard.tsx`
- `app/protocol/page.tsx`

---

### FASE 2: Core Features (Dia 3-5)

#### Issue #29: CRUD para Treinos (P1) 🔴 CRÍTICO
**Por que:** Usuário não consegue editar/deletar treinos

**O que fazer:**
- [ ] API: `PUT /api/protocol/workout/:id` (editar treino)
- [ ] API: `DELETE /api/protocol/workout/:id` (deletar treino)
- [ ] API: `POST /api/protocol/workout` (criar treino manual)
- [ ] UI: Botão "Editar" em cada WorkoutCard
- [ ] UI: Modal/Form de edição
- [ ] UI: Botão "Deletar" com confirmação
- [ ] UI: Botão "+ Adicionar Treino" (criar manual)

**Acceptance Criteria:**
- [ ] AC1: Editar nome do treino, exercícios, séries, reps
- [ ] AC2: Deletar treino com confirmação ("Tem certeza?")
- [ ] AC3: Criar treino manual (sem PDF)
- [ ] AC4: Mudanças salvas no database
- [ ] AC5: UI atualiza sem refresh (optimistic update)

**Files afetados:**
- `app/api/protocol/workout/[id]/route.ts` (novo)
- `app/api/protocol/workout/route.ts` (novo, POST)
- `components/protocol/WorkoutCard.tsx`
- `components/protocol/EditWorkoutModal.tsx` (novo)

**Database:**
```prisma
// Já existe:
model Workout {
  id          String   @id @default(uuid())
  protocolId  String
  name        String
  exercises   Json
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

---

#### Issue #30: CRUD para Dieta (P1) 🔴 CRÍTICO
**Por que:** Usuário não consegue editar/deletar refeições

**O que fazer:**
- [ ] API: `PUT /api/protocol/diet/:id` (editar refeição)
- [ ] API: `DELETE /api/protocol/diet/:id` (deletar refeição)
- [ ] API: `POST /api/protocol/diet` (criar refeição manual)
- [ ] UI: Botão "Editar" em cada DietCard
- [ ] UI: Modal/Form de edição
- [ ] UI: Botão "Deletar" com confirmação
- [ ] UI: Botão "+ Adicionar Refeição" (criar manual)

**Acceptance Criteria:**
- [ ] AC1: Editar nome da refeição, alimentos, quantidades
- [ ] AC2: Deletar refeição com confirmação
- [ ] AC3: Criar refeição manual (sem PDF)
- [ ] AC4: Mudanças salvas no database
- [ ] AC5: UI atualiza sem refresh

**Files afetados:**
- `app/api/protocol/diet/[id]/route.ts` (novo)
- `app/api/protocol/diet/route.ts` (novo, POST)
- `components/protocol/DietCard.tsx`
- `components/protocol/EditDietModal.tsx` (novo)

**Database:**
```prisma
// Já existe:
model Diet {
  id          String   @id @default(uuid())
  protocolId  String
  mealName    String
  foods       Json
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

---

#### Issue #23: CI/CD com GitHub Actions (P1) 🔴 CRÍTICO
**Por que:** Deploy manual = risco de bug em prod

**O que fazer:**
- [ ] Criar `.github/workflows/ci.yml`
- [ ] Workflow: Lint (ESLint)
- [ ] Workflow: Type check (TypeScript)
- [ ] Workflow: Build (next build)
- [ ] Workflow: Deploy preview em PRs
- [ ] Workflow: Deploy prod no merge pra main
- [ ] Branch protection (require CI pass)

**Acceptance Criteria:**
- [ ] AC1: CI roda em todo PR
- [ ] AC2: Lint + Type check + Build passa
- [ ] AC3: Preview deploy automático em PRs
- [ ] AC4: Deploy prod automático no merge
- [ ] AC5: CI falha se houver erro

**Files afetados:**
- `.github/workflows/ci.yml` (novo)
- `.github/workflows/deploy-preview.yml` (novo)
- `.github/workflows/deploy-prod.yml` (novo)

**Exemplo CI:**
```yaml
name: CI
on: [pull_request]
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run lint
  typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run type-check
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build
```

---

### FASE 3: Polish Essencial (Dia 6-7)

#### Issue #25: Loading States e Skeletons (P2)
**Por que:** Usuário não sabe se tá carregando

**O que fazer:**
- [ ] Loading skeleton pra protocol page
- [ ] Loading skeleton pra dashboard
- [ ] Loading spinner em forms (upload, check-in)
- [ ] Loading state em botões (disable + spinner)
- [ ] Usar `loading.tsx` do Next.js onde aplicável

**Acceptance Criteria:**
- [ ] AC1: Skeleton aparece enquanto carrega protocol
- [ ] AC2: Skeleton aparece enquanto carrega dashboard
- [ ] AC3: Botões mostram spinner durante submit
- [ ] AC4: Forms desabilitam durante submit
- [ ] AC5: Transições suaves (não pisca)

**Files afetados:**
- `app/protocol/loading.tsx` (novo)
- `app/dashboard/loading.tsx` (novo)
- `components/ui/Skeleton.tsx` (novo)
- `components/ui/Button.tsx` (adicionar loading state)

---

#### Issue #26: Error Handling Global (P2)
**Por que:** Erros aparecem como texto bruto

**O que fazer:**
- [ ] Criar `app/error.tsx` (error boundary global)
- [ ] Criar `components/ui/ErrorBoundary.tsx`
- [ ] Toast/Alert pra erros de API
- [ ] Página 404 customizada
- [ ] Página 500 customizada
- [ ] Error logging (console.error no mínimo)

**Acceptance Criteria:**
- [ ] AC1: Erros mostram UI amigável (não stack trace)
- [ ] AC2: Erros de API mostram toast com mensagem clara
- [ ] AC3: 404 mostra página customizada ("Página não encontrada")
- [ ] AC4: 500 mostra página customizada ("Algo deu errado")
- [ ] AC5: Erros logados no console (preparar pra Sentry)

**Files afetados:**
- `app/error.tsx` (novo)
- `app/not-found.tsx` (novo)
- `components/ui/ErrorBoundary.tsx` (novo)
- `components/ui/Toast.tsx` (novo, ou usar shadcn/ui)
- `lib/api-client.ts` (adicionar error handling)

---

#### Issue #28: SEO e Meta Tags (P2)
**Por que:** Sem SEO = sem visibilidade

**O que fazer:**
- [ ] Metadata em `app/layout.tsx` (title, description, OG)
- [ ] Metadata por página (protocol, dashboard, etc)
- [ ] `robots.txt` (allow all)
- [ ] `sitemap.xml` (páginas principais)
- [ ] OG image (pode ser simples logo)
- [ ] Favicon (se não tiver ainda)

**Acceptance Criteria:**
- [ ] AC1: Title tag descritivo em todas as páginas
- [ ] AC2: Meta description em todas as páginas
- [ ] AC3: OG tags (title, description, image)
- [ ] AC4: robots.txt permite crawlers
- [ ] AC5: sitemap.xml lista páginas principais

**Files afetados:**
- `app/layout.tsx` (metadata root)
- `app/protocol/page.tsx` (metadata específica)
- `app/dashboard/page.tsx` (metadata específica)
- `public/robots.txt` (novo)
- `app/sitemap.ts` (novo, Next.js 14)

**Exemplo metadata:**
```tsx
export const metadata: Metadata = {
  title: 'ProtocolOS - Seu Protocolo de Treino',
  description: 'Acompanhe seu treino e dieta. Upload de PDF, check-in diário, gráficos de evolução.',
  openGraph: {
    title: 'ProtocolOS',
    description: 'Acompanhe seu protocolo de treino e dieta',
    images: ['/og-image.png'],
  },
}
```

---

## 🏗️ Stack e Convenções

### Stack Atual
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Database:** Supabase (Postgres) via Prisma
- **Auth:** NextAuth.js (email magic link)
- **AI:** Groq (BYOK)
- **Deploy:** Vercel

### Convenções
- **Commits:** Português, conventional commits (`feat:`, `fix:`, etc)
- **Co-Author:** Sempre incluir `Co-authored-by: Claude <noreply@anthropic.com>`
- **Refs:** Incluir `Refs: #123` nos commits
- **TypeScript:** Strict mode, zero erros
- **Testes:** Por enquanto, foco em funcionalidade (testes depois)

---

## 🚨 Constraints e Cuidados

### Vercel Serverless
- ✅ Usar `unpdf` (já funciona, NÃO mudar)
- ❌ Não usar `pdf-parse` (quebra no serverless)
- ✅ Timeouts: 10s (Hobby), 60s (Pro)

### Database
- ✅ Prisma Client já configurado
- ✅ Schema já tem Workout e Diet models
- ❌ NÃO fazer migrations manuais (usar `prisma migrate dev`)

### Auth
- ✅ NextAuth já configurado (magic link via Resend)
- ✅ Session funciona
- ❌ Por enquanto, usuário padrão (sem multi-tenant)

### Responsivo
- ✅ Mobile-first (min 375px)
- ✅ Breakpoints Tailwind: sm (640), md (768), lg (1024), xl (1280)
- ✅ Touch-friendly (botões 44x44px)

---

## 📦 Ordem de Implementação

**Dia 1:**
1. #27 Mobile Responsive (layout, sidebar, forms)

**Dia 2:**
2. #31 Melhorar Visualização (agrupar, ícones, hierarquia)

**Dia 3:**
3. #29 CRUD Treinos (API + UI)

**Dia 4:**
4. #30 CRUD Dieta (API + UI)

**Dia 5:**
5. #23 CI/CD (GitHub Actions)

**Dia 6:**
6. #25 Loading States
7. #26 Error Handling

**Dia 7:**
8. #28 SEO

**Commits atômicos:** Cada issue = múltiplos commits pequenos, não um commit gigante.

---

## ✅ Definition of Done (DoD)

Para cada issue:
- [ ] Código implementado e funcional
- [ ] TypeScript sem erros (`npm run type-check`)
- [ ] Lint passa (`npm run lint`)
- [ ] Build passa (`npm run build`)
- [ ] Testado manualmente (localhost)
- [ ] Testado em mobile (responsive)
- [ ] Commit com mensagem semântica + Refs
- [ ] Pushed pra branch

---

## 🚀 Comandos Úteis

```bash
# Dev
npm run dev

# Build
npm run build

# Lint
npm run lint

# Type check
npm run type-check

# Prisma
npx prisma migrate dev
npx prisma studio
```

---

## 📞 Dúvidas e Decisões

Se encontrar ambiguidade:
1. **Priorize UX** — Se em dúvida, escolha o que é melhor pro usuário
2. **Simplicidade** — Não over-engineer, foco em funcionalidade
3. **Mobile-first** — Sempre testar no mobile primeiro

Se encontrar bloqueio técnico:
1. **Documente** — Adicione TODO ou FIXME com contexto
2. **Continue** — Não trave, implemente o que é possível
3. **Avise** — Mencione no commit ou crie issue

---

**Vamos lá! 🚀**
