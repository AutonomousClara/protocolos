# QA Checklist - ProtocolOS v1.0

**Data:** 2026-02-04  
**Build:** ✅ Passou (warnings de lint apenas)  
**Deploy:** https://protocolos-two.vercel.app

---

## ✅ Validação Técnica (Feita)

- ✅ **Lint:** Passou (alguns warnings de variáveis não usadas)
- ✅ **Build:** Compilou com sucesso
- ✅ **TypeScript:** Erro corrigido (prop `color`)
- ✅ **Git:** 9 commits pushed (8 do Ralph + 1 fix)

---

## 📋 QA Manual (Você Precisa Testar)

### 1. Mobile Responsive (#27) 🔴 CRÍTICO

**Testar em:**
- [ ] iPhone (Safari)
- [ ] Android (Chrome)
- [ ] Responsive mode no Chrome DevTools (375px, 428px)

**Checklist:**
- [ ] Sidebar mobile (hamburger menu funciona)
- [ ] Upload de PDF funciona no mobile
- [ ] Cards de treino são legíveis (sem scroll horizontal)
- [ ] Cards de dieta são legíveis
- [ ] Dashboard (gráficos) funciona no mobile
- [ ] Formulário de check-in funciona
- [ ] Botões são clicáveis (não muito pequenos)
- [ ] Textos legíveis sem zoom

---

### 2. Visualização Melhorada (#31) 🔴 CRÍTICO

**Abrir:** `/app/protocol`

**Checklist:**
- [ ] Treinos agrupados por dia da semana (Segunda, Terça, Quarta...)
- [ ] Ícones visuais aparecem (💪 treino, 🍽️ dieta)
- [ ] Exercícios organizados claramente
- [ ] Refeições separadas (Café, Almoço, Jantar, Lanches)
- [ ] Breadcrumbs funcionam (navegação clara)
- [ ] Hierarquia visual (fácil de escanear)

---

### 3. CRUD Treinos (#29) 🔴 CRÍTICO

**Abrir:** Qualquer treino

**Checklist:**
- [ ] Botão "Deletar" aparece
- [ ] Clicar "Deletar" abre modal de confirmação
- [ ] Modal pergunta "Tem certeza?"
- [ ] Cancelar fecha modal (treino não é deletado)
- [ ] Confirmar deleta o treino
- [ ] Treino desaparece da página automaticamente
- [ ] Mensagem de sucesso aparece (toast/alert)
- [ ] Deletar no mobile funciona

**Testar edge cases:**
- [ ] Deletar último treino (lista fica vazia)
- [ ] Deletar treino com check-ins (deve funcionar ou avisar)

---

### 4. CRUD Dieta (#30) 🔴 CRÍTICO

**Abrir:** Qualquer refeição

**Checklist:**
- [ ] Botão "Deletar" aparece
- [ ] Clicar "Deletar" abre modal
- [ ] Modal de confirmação funciona
- [ ] Cancelar funciona
- [ ] Confirmar deleta a refeição
- [ ] Refeição desaparece automaticamente
- [ ] Mensagem de sucesso aparece
- [ ] Deletar no mobile funciona

**Testar edge cases:**
- [ ] Deletar última refeição
- [ ] Deletar refeição com dados vinculados

---

### 5. CI/CD (#23) 🔴 CRÍTICO

**Ver GitHub Actions:**  
https://github.com/AutonomousClara/protocolos/actions

**Checklist:**
- [ ] Workflow "CI" existe
- [ ] CI roda em PRs automaticamente
- [ ] CI passa (lint + typecheck + build)
- [ ] Deploy Vercel acontece automaticamente
- [ ] Preview deploy funciona em PRs

**Testar:**
1. [ ] Criar branch de teste
2. [ ] Fazer mudança pequena
3. [ ] Abrir PR
4. [ ] Ver se CI roda
5. [ ] Ver se preview deploy aparece

---

### 6. Loading States (#25)

**Testar navegação:**

**Checklist:**
- [ ] Ir pra `/app/protocol` → skeleton aparece antes do conteúdo
- [ ] Ir pra `/app` (dashboard) → skeleton aparece
- [ ] Upload de PDF → botão mostra spinner durante upload
- [ ] Check-in → botão mostra "Salvando..." durante submit
- [ ] Deletar treino/dieta → botão mostra spinner
- [ ] Skeletons têm animação (pulse)
- [ ] Skeletons desaparecem quando conteúdo carrega

**Internet lenta (DevTools):**
- [ ] Throttle: Slow 3G → ver se skeletons aparecem

---

### 7. Error Handling (#26)

**Testar erros:**

**Checklist:**
- [ ] Ir pra `/app/pagina-que-nao-existe` → mostra 404 customizada
- [ ] 404 tem botão "Voltar" que funciona
- [ ] Simular erro de API (desconectar internet) → mostra mensagem amigável
- [ ] Toast de erro aparece (não stack trace)
- [ ] Página não quebra totalmente (error boundary funciona)

**Simular erro:**
1. [ ] DevTools → Network → Offline
2. [ ] Tentar fazer check-in
3. [ ] Ver se mostra erro amigável (não código técnico)

---

### 8. SEO (#28)

**Ferramentas:**
- Chrome DevTools → Elements → `<head>`
- https://metatags.io (preview de OG tags)

**Checklist:**
- [ ] `<title>` tag existe em todas as páginas
- [ ] `<meta description>` existe
- [ ] Open Graph tags existem (og:title, og:description, og:image)
- [ ] Twitter card tags existem
- [ ] `/robots.txt` existe e permite crawlers
- [ ] `/sitemap.xml` existe

**Verificar:**
```bash
curl https://protocolos-two.vercel.app/robots.txt
curl https://protocolos-two.vercel.app/sitemap.xml
```

**Ver no código-fonte:**
- [ ] View Source → ver `<head>` tags
- [ ] Copiar URL → colar no WhatsApp/Discord → ver se preview aparece

---

## 🧪 Testes de Fluxo Completo

### Fluxo 1: Novo Usuário

1. [ ] Acessar site
2. [ ] Fazer login (magic link)
3. [ ] Ver dashboard vazio
4. [ ] Fazer upload de PDF de treino
5. [ ] Ver protocolo extraído
6. [ ] Navegar pelos treinos
7. [ ] Fazer check-in
8. [ ] Ver gráfico de consistência

### Fluxo 2: Editar Protocolo

1. [ ] Abrir protocolo existente
2. [ ] Deletar um treino
3. [ ] Confirmar que sumiu
4. [ ] Deletar uma refeição
5. [ ] Confirmar que sumiu
6. [ ] Ver se check-ins antigos ainda funcionam

### Fluxo 3: Mobile

1. [ ] Abrir no celular
2. [ ] Fazer login
3. [ ] Navegar pelo app
4. [ ] Fazer check-in
5. [ ] Deletar algo
6. [ ] Ver se tudo funciona

---

## 🐛 Bugs Conhecidos

### Warnings de Lint (Não Críticos)

- `SkeletonCard` não usado em `app/loading.tsx`
- `err` não usado em `login/page.tsx`
- `<img>` em vez de `<Image>` no Header
- Variáveis não usadas em `session.ts` e `middleware.ts`

**Ação:** Limpar depois se tiver tempo, não bloqueia v1.0

---

## ✅ Critérios de Aprovação

Para considerar v1.0 pronto:

### Must Have (Bloqueadores)
- [ ] Mobile funciona (375px+)
- [ ] CRUD treinos funciona
- [ ] CRUD dieta funciona
- [ ] CI/CD configurado
- [ ] Não há erros críticos

### Should Have (Importantes)
- [ ] Loading states funcionam
- [ ] Erros mostram mensagem amigável
- [ ] SEO básico presente

### Nice to Have (Não Bloqueia)
- [ ] Todos os warnings de lint corrigidos
- [ ] Testes automatizados

---

## 🚀 Depois da Aprovação

1. [ ] Merge pra main (já feito)
2. [ ] Deploy prod Vercel (automático via CI/CD)
3. [ ] Testar prod uma última vez
4. [ ] Iniciar beta com você + treinador
5. [ ] Coletar feedback
6. [ ] Decidir: Fase 2 (Treinador) ou Fase 3 (MediaPipe)

---

## 📊 Status Atual

- ✅ **Código:** 9 commits (8 features + 1 fix)
- ✅ **Build:** Compila sem erros
- ✅ **Deploy:** Automático configurado
- ⏳ **QA Manual:** Aguardando testes do Berna

**Próximo passo:** Você testar no deploy! 🎯

**Deploy:** https://protocolos-two.vercel.app
