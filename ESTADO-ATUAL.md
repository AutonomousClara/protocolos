# ProtocolOS - Estado Atual

**Data:** 2026-02-04  
**Autor:** Clara  
**Deploy:** https://protocolos-two.vercel.app

---

## 📊 Resumo Executivo

**Fase:** Fase 1 (MVP Aluno) — 90% completo  
**Sprint:** Sprint 4 (Polish) — em andamento  
**v1.0 ETA:** 2026-02-18 (2 semanas)

---

## ✅ O Que Já Foi Feito

### Sprint 1: Foundation (Auth + Infra) — ✅ 100%
- ✅ NextAuth configurado (email magic link)
- ✅ Resend configurado para emails
- ✅ Database Supabase (Prisma ORM)
- ✅ Auth flow completo (registro, login, logout)

### Sprint 2: Upload & Parsing PDF — ✅ 100%
- ✅ Upload de PDF com drag & drop
- ✅ Parser de PDF com unpdf (funciona no Vercel serverless)
- ✅ Extração via IA (Groq)
- ✅ Preview dos dados extraídos
- ✅ Salvar protocolo no database

### Sprint 3: Check-in & Progress — ✅ 100%
- ✅ Formulário de check-in diário
- ✅ Calendário de consistência
- ✅ Streak de dias consecutivos
- ✅ Cards de estatísticas
- ✅ Gráfico de peso
- ✅ Configuração de API key Groq (BYOK)

### Sprint 4: Polish — 🟡 40% (em andamento)
- ✅ ProtocolTabs (treinos/dieta)
- ✅ Cards colapsáveis
- ⚠️ Mobile responsive (issue #27 aberta)
- ⚠️ SEO e meta tags (issue #28 aberta)
- ⚠️ Loading states (issue #25 aberta)
- ⚠️ Error handling (issue #26 aberta)
- ⚠️ Sentry (issue #24 aberta)

---

## 🔥 Issues Abertas v1.0 (11 total)

### P1 - High Priority (4 issues) — CRÍTICAS PRO MVP

| # | Issue | Por que é crítica |
|---|-------|-------------------|
| #27 | Mobile responsive | App inutilizável no celular |
| #29 | CRUD treinos | Não dá pra editar/deletar treino |
| #30 | CRUD dieta | Não dá pra editar/deletar dieta |
| #31 | Melhorar visualização | UX atual é confusa |
| #23 | CI/CD | Deploy manual = risco de bug em prod |

### P2 - Medium Priority (4 issues) — IMPORTANTES

| # | Issue | Impacto |
|---|-------|---------|
| #25 | Loading states | UX ruim (usuário não sabe se tá carregando) |
| #26 | Error handling | Bugs sem feedback pro usuário |
| #28 | SEO | Sem SEO = sem visibilidade |
| #24 | Sentry | Sem observability = bugs invisíveis |

### P3 - Low Priority (3 issues) — NICE TO HAVE

| # | Issue | Impacto |
|---|-------|---------|
| #22 | Editar perfil | Nice to have |
| #8 | Epic Configurações | Nice to have |

---

## 🚧 O Que Falta Pro MVP 100%

### Core Features Incompletas
- ❌ **CRUD completo** — Usuário não consegue editar/deletar treinos e dietas
- ❌ **Mobile responsivo** — App não funciona bem no celular (problema grave)
- ❌ **Visualização melhorada** — UX atual é confusa

### Polish Incompleto
- ❌ **Loading states** — Usuário não vê feedback de carregamento
- ❌ **Error handling** — Erros aparecem como texto bruto
- ❌ **SEO** — Sem metadata, sitemap, robots.txt
- ❌ **CI/CD** — Deploy ainda é manual

### Observability Zero
- ❌ **Sentry** — Não tem error tracking
- ❌ **Logs** — Sem visibilidade de erros em prod

---

## 🎯 Proposta de Priorização

### Opção 1: Completar Sprint 4 (Polish) — ~2-3 dias
**Foco:** Resolver P1 do Sprint 4 atual

**Issues:**
1. #27 Mobile responsive (P1) — CRÍTICO
2. #28 SEO (P2)
3. #25 Loading states (P2)
4. #26 Error handling (P2)

**Resultado:** App funcional no mobile + UX melhor, mas CRUD ainda incompleto

---

### Opção 2: Sprint 5 (MVP Completion) — ~1 semana
**Foco:** Completar core features que faltam

**Issues:**
1. #29 CRUD treinos (P1) — CRÍTICO
2. #30 CRUD dieta (P1) — CRÍTICO
3. #31 Melhorar visualização (P1)
4. #23 CI/CD (P1)
5. #22 Editar perfil (P3) — se sobrar tempo

**Resultado:** MVP 100% funcional com core completo

---

### Opção 3: Híbrido (Recomendado) — ~1 semana
**Foco:** P1 de ambos sprints

**Dia 1-2:**
- #27 Mobile responsive (crítico pra usabilidade)
- #31 Melhorar visualização (crítico pra UX)

**Dia 3-5:**
- #29 CRUD treinos (core feature)
- #30 CRUD dieta (core feature)
- #23 CI/CD (infra importante)

**Dia 6-7:**
- #25 Loading states
- #26 Error handling
- #28 SEO

**Resultado:** MVP completo (core + UX + polish básico)

---

## 📋 Recomendação da Clara

### 🎯 Prioridade: Opção 3 (Híbrido)

**Por quê:**
1. **Mobile é crítico** — Maioria dos usuários vai usar no celular
2. **CRUD é core** — Sem editar/deletar, app é read-only
3. **CI/CD é segurança** — Deploy manual = risco de quebrar prod

**Timeline:**
- Semana 1 (esta): Híbrido Sprint 4+5 (7 dias)
- Semana 2: Beta testing (você + treinador)
- Semana 3: Ajustes baseado em feedback
- Semana 4: v1.0 Launch

**Milestone v1.0:** 2026-02-18 (2 semanas)

---

## 🚀 Próximos Passos Imediatos

### Se for Ralph implementar (recomendado):

1. **Criar Sprint 5 no kanban**
   ```bash
   gh issue edit 27 28 25 26 29 30 31 23 --add-label "sprint:5"
   ```

2. **Criar CLAUDE.md pro Ralph**
   - Copiar spec de DISCOVERY.md
   - Adicionar issues #27, #29, #30, #31, #23
   - Prioridade clara: mobile → CRUD → CI/CD

3. **Rodar Ralph em background**
   ```bash
   cd ./projects/protocolos
   exec pty:true background:true timeout:14400 command:"claude --print --dangerously-skip-permissions 'Leia CLAUDE.md. Implemente as issues listadas na ordem de prioridade. Commits atômicos.' < /dev/null 2>&1"
   ```

4. **Monitorar progresso**
   ```bash
   process action:log sessionId:XXX
   ```

### Se for você testar agora:

1. **Acessar:** https://protocolos-two.vercel.app
2. **Testar no celular** (ou responsive mode)
3. **Fazer upload de um PDF de treino**
4. **Ver se consegue editar/deletar** (vai descobrir que não tem CRUD)
5. **Anotar feedback** (o que tá ruim, o que falta)

---

## 💬 Decisões Necessárias

1. **Qual opção?** Sprint 4, Sprint 5, ou Híbrido?
2. **Quem implementa?** Ralph (background) ou você (manual)?
3. **Quando começar beta?** Após Sprint 5 ou já agora?
4. **Fase 2 ou Fase 3?** Treinador View ou MediaPipe depois do v1.0?

---

## 📊 Métricas Atuais

- **Issues totais v1.0:** 34
- **Fechadas:** 23 (68%)
- **Abertas:** 11 (32%)
  - P1: 4 (36%)
  - P2: 4 (36%)
  - P3: 3 (28%)
- **Sprints concluídos:** 3/4
- **Velocity:** ~8 issues/sprint (média)

---

*Estado capturado em: 2026-02-04 12:42*
