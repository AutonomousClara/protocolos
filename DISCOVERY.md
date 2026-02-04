# ProtocolOS - Discovery

> App de acompanhamento de treino e dieta com extração automática de PDF e análise de execução por IA.

**Data Discovery:** 2026-02-02  
**Última Atualização:** 2026-02-04  
**Tipo:** `/produto-complexo` (1-2 semanas por fase)

---

## 📊 STATUS ATUAL (2026-02-04)

### Progresso Geral
- **Deployed:** ✅ https://protocolos-two.vercel.app
- **Fase Atual:** Fase 1 (MVP Aluno) — 90% completo
- **Sprint Atual:** Sprint 4 (Polish)
- **Próximo Marco:** v1.0 MVP Aluno (ETA: 1-2 semanas)

### Roadmap de Fases

| Fase | Status | Timeline | Milestones |
|------|--------|----------|------------|
| **Fase 1: MVP Aluno** | 🟡 90% | Sem 1-2 | Sprint 1-5, v1.0 |
| **Fase 2: Treinador View** | ⚪ 0% | Sem 3-4 | v2.0 |
| **Fase 3: MediaPipe** | ⚪ 0% | Sem 5-6 | v3.0 |
| **Fase 4: Mobile** | ⚪ 0% | Futuro | v4.0 |

### Sprints Concluídos
- ✅ Sprint 1: Foundation (Auth + Infra)
- ✅ Sprint 2: Core (Upload + Parsing + View)
- ✅ Sprint 3: Engagement (Check-in + Progress)
- 🟡 Sprint 4: Polish (Responsive + SEO + UX) — in progress

### Issues Stats
- **Total:** 31 issues
- **Fechadas:** 23 (74%)
- **Abertas:** 8
  - P1 (High): 4 issues
  - P2 (Medium): 3 issues
  - P3 (Low): 1 issue

### Próximos Passos
1. Terminar Sprint 4 (polish) — ~2-3 dias
2. Sprint 5: MVP Completion (CRUD + testes) — ~1 semana
3. Beta testing com usuários reais — ~1-2 semanas
4. Decidir: Fase 2 ou Fase 3 baseado em feedback

### Tracking
- **Kanban:** https://github.com/users/AutonomousClara/projects/1
- **Repo:** https://github.com/AutonomousClara/protocolos
- **Milestones:** v1.0, v2.0, v3.0, v4.0

---

## 1. Problema

### Dor do Aluno
- Recebe treino/dieta em PDF do treinador
- Não tem lugar centralizado pra acompanhar
- Check-in é manual (Google Forms, WhatsApp)
- Sem visão de evolução ou consistência
- Não sabe se está executando exercícios corretamente

### Dor do Treinador (Fase 2)
- Recebe check-ins em Google Forms → bagunça
- Sem métricas ou gráficos de evolução dos alunos
- Histórico em PDFs soltos → impossível acompanhar
- Não escala — quanto mais alunos, mais caos

---

## 2. Solução

**ProtocolOS** — O sistema operacional do seu protocolo de treino.

### Para o Aluno (MVP)
> "Faz upload do PDF que seu treinador mandou. O app extrai tudo automaticamente. Check-in diário em 30 segundos. Veja sua evolução."

### Para o Treinador (Fase 2)
> "Tenha todos os seus alunos num só lugar. Veja quem tá treinando, quem tá enrolando, e a evolução de cada um."

---

## 3. Público-Alvo

### Persona Primária: O Aluno Dedicado
- **Quem:** Pessoa que treina com personal trainer
- **Idade:** 25-45 anos
- **Comportamento:** Recebe PDF do treinador, quer acompanhar progresso
- **Dor:** PDF fica perdido, sem visão de consistência
- **Motivação:** Ver evolução, não quebrar sequência

### Persona Secundária: O Treinador (Fase 2)
- **Quem:** Personal trainer com 10-50 alunos
- **Dor:** Não consegue acompanhar todos, sem métricas
- **Motivação:** Escalar sem perder qualidade

---

## 4. Competidores

| App | Preço | Foco | Pontos Fortes | Fraquezas |
|-----|-------|------|---------------|-----------|
| **Trainerize** | $10-250/mês | Trainers pro | Líder de mercado, completo | Caro, complexo |
| **TrueCoach** | $19/mês+ | Trainers | Messaging, simples | Foco no trainer, não no aluno |
| **Everfit** | Free até 5 | Trainers iniciantes | Barreira baixa | Limitado |
| **8fit** | Freemium | Usuário final | Workout + meals | Genérico, sem personalização |
| **Strong** | Freemium | Usuário final | Tracking de treino | Só treino, manual |
| **MyFitnessPal** | Freemium | Usuário final | Nutrição, enorme base | Só dieta, sem treino integrado |

### Gap de Mercado
Nenhum competidor faz:
- ✅ Upload de PDF → extração automática com IA
- ✅ Treino + dieta integrados do SEU treinador
- ✅ Análise de vídeo com feedback de execução (MediaPipe)
- ✅ Simples e barato

---

## 5. Diferencial

| Feature | Competidores | ProtocolOS |
|---------|--------------|------------|
| PDF → estruturado | ❌ Manual | ✅ IA automático |
| Treino personalizado | ⚠️ Só se trainer usar o app | ✅ Qualquer PDF |
| Check-in diário | ⚠️ Alguns | ✅ Core feature |
| Gráficos de evolução | ⚠️ Básico | ✅ Foco principal |
| Análise de vídeo | ❌ Nenhum | ✅ MediaPipe (Fase 2) |
| Preço | $10-250/mês | Free / BYOK |

---

## 6. Viabilidade Técnica

### PDF Parsing

| Abordagem | Precisão | Custo | Uso |
|-----------|----------|-------|-----|
| AI Cloud (GPT-4, Claude, Groq) | 🟢 Alta | ~$0.01-0.10/PDF | Produção |
| Ollama Local (llama3, mistral) | 🟡 Média | Zero | Dev/testes |
| REGEX/Heurísticas | 🔴 Frágil | Zero | Fallback simples |

**Estratégia:** Híbrida
1. Tentar REGEX primeiro (padrões conhecidos)
2. Se falhar → chamar AI
3. Dev: Ollama local
4. Prod: Groq (rápido e barato) ou BYOK

### MediaPipe (Fase 2)

| Capacidade | Status |
|------------|--------|
| Detectar 33 pontos do corpo | ✅ Funciona bem |
| Calcular ângulos articulações | ✅ Documentado |
| Contar repetições | ✅ Exemplos existem |
| Analisar forma (squat, deadlift) | ✅ Papers validam |
| Real-time no browser | ⚠️ Precisa WebGL |

**Recursos:**
- LearnOpenCV tutorial (squat analysis)
- GitHub RepDetect (Kotlin, referência)
- MediaPipe Pose documentation

### Stack Proposta

| Camada | Tecnologia |
|--------|------------|
| Frontend | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Auth | NextAuth.js (credentials + magic link) |
| Database | Supabase (Postgres + Auth + Storage) |
| PDF Parsing | pdf-parse + Groq/Ollama |
| File Storage | Supabase Storage |
| Deploy | Vercel |
| Domínio | protocolos.autonomousclara.com |

---

## 7. Modelo de Negócio

### MVP (Validação)
- **Grátis** com BYOK (usuário coloca API key)
- Foco em validar se as pessoas usam

### Escala (Depois)
| Plano | Preço | Inclui |
|-------|-------|--------|
| Free | $0 | 3 PDFs/mês, check-in ilimitado |
| Pro | $9/mês | PDFs ilimitados, análise de vídeo |
| Trainer | $29/mês | Dashboard multi-aluno, métricas |

---

## 8. Roadmap

### Fase 1: MVP Aluno (Semana 1-2)
- [ ] Auth (email + magic link)
- [ ] Upload PDF
- [ ] IA extrai treino/dieta
- [ ] Visualização do plano estruturado
- [ ] Check-in diário (treino ✓/✗, dieta ✓/✗)
- [ ] Calendário de consistência
- [ ] Gráficos básicos

### Fase 2: Treinador View (Semana 3-4)
- [ ] Aluno convida treinador
- [ ] Treinador vê dashboard do aluno
- [ ] Múltiplos alunos por treinador
- [ ] Alertas (aluno sumiu)

### Fase 3: MediaPipe (Semana 5-6)
- [ ] Upload de vídeo no check-in
- [ ] Análise de pose
- [ ] Feedback de execução
- [ ] Contador de reps automático

### Fase 4: Mobile (Futuro)
- [ ] PWA otimizado
- [ ] App nativo (React Native?)

---

## 9. Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| PDF parsing falha em formatos estranhos | Média | Alto | Fallback manual, feedback loop |
| Custo de AI alto | Média | Médio | BYOK, free tier limitado |
| Usuários não fazem check-in diário | Alta | Alto | Notificações, gamificação |
| MediaPipe impreciso | Média | Médio | Começar com exercícios simples |
| Treinadores não adotam | Média | Baixo (fase 2) | Foco no aluno primeiro |

---

## 10. Métricas de Sucesso

### MVP
- [ ] 10 usuários ativos em 2 semanas
- [ ] 70%+ de check-ins completados
- [ ] PDF parsing funciona em 80%+ dos casos
- [ ] NPS >= 30

### Escala
- [ ] 100 usuários ativos em 2 meses
- [ ] 10 treinadores usando
- [ ] 5% conversão free → pro

---

## 11. Contexto do Berna

- **Treina em:** Academia
- **Recebe plano:** PDF do treinador
- **Check-in atual:** Quinzenal/mensal, Google Forms, 6 fotos
- **Dor identificada:** Não é escalável pro treinador
- **Preferência:** Web (PWA se precisar)
- **Primeiro usuário:** Ele mesmo + seu treinador

---

## 12. Decisões Tomadas

1. ✅ Começar pelo aluno (mais simples, valida core)
2. ✅ Estrutura preparada pra treinador (fase 2)
3. ✅ PDF parsing com AI (Ollama dev, Groq prod)
4. ✅ BYOK como modelo inicial (sem custo pra gente)
5. ✅ Web first, PWA depois
6. ✅ MediaPipe fica pra fase 2
7. ✅ Nome: **ProtocolOS**

---

## 13. Próximos Passos

1. [ ] Criar CLAUDE.md (spec técnica)
2. [ ] Setup projeto (Next.js + Supabase)
3. [ ] Implementar auth
4. [ ] Implementar upload + parsing PDF
5. [ ] Implementar check-in
6. [ ] Dashboard básico
7. [ ] Deploy preview
8. [ ] Berna testa com próprio treino

---

*Discovery concluído em: 2026-02-02 23:11*
*Autor: Clara*
