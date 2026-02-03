# 📋 Setup do Kanban - ProtocolOS

## 1. Criar o Project

1. Acesse: https://github.com/AutonomousClara/protocolos/projects
2. Click **"New project"**
3. Selecione **"Board"**
4. Nome: **"ProtocolOS"**

---

## 2. Configurar Colunas (Status)

Delete as colunas padrão e crie:

| # | Nome | Descrição |
|---|------|-----------|
| 1 | 📥 Backlog | Tudo que ainda não foi refinado |
| 2 | 📋 Ready | Refinado, pronto para começar |
| 3 | 🚧 In Progress | Sendo trabalhado agora (WIP: 3) |
| 4 | 👀 Review | Em code review ou QA |
| 5 | ✅ Done | Concluído e deployado |

### Configurar WIP Limits

No header de cada coluna, click no **⚙️** e adicione:
- **In Progress:** "WIP: 3 max"
- **Review:** "WIP: 2 max"

---

## 3. Adicionar Custom Fields

Vá em **Settings ⚙️** → **Fields** → **New field**

### Type (Single Select)
- Nome: `Type`
- Opções:
  - 🟣 Epic (cor: #7B68EE)
  - 🔵 Story (cor: #0075CA)
  - 🟢 Task (cor: #28A745)
  - 🔴 Bug (cor: #D73A4A)

### Priority (Single Select)
- Nome: `Priority`
- Opções:
  - P0-Critical (cor: #B60205)
  - P1-High (cor: #D93F0B)
  - P2-Medium (cor: #FBCA04)
  - P3-Low (cor: #0E8A16)

### Estimate (Single Select)
- Nome: `Estimate`
- Opções:
  - XS (1h)
  - S (2-4h)
  - M (1 dia)
  - L (2-3 dias)
  - XL (1 semana)

### Sprint (Iteration)
- Nome: `Sprint`
- Duração: 2 semanas
- Criar sprints:
  - Sprint 1: Foundation (2026-02-10 → 2026-02-21)
  - Sprint 2: Core Feature 1 (2026-02-24 → 2026-03-07)
  - Sprint 3: Core Feature 2 (2026-03-10 → 2026-03-21)

### Due Date (Date)
- Nome: `Due Date`

---

## 4. Criar Views

### Board View (default)
- Agrupa por: Status
- Campos visíveis: Type, Priority, Estimate, Assignee

### Backlog View
- Tipo: Table
- Filtro: Status = "Backlog" OR Status = "Ready"
- Ordena por: Priority (desc)
- Campos: Title, Type, Priority, Estimate, Sprint

### Roadmap View
- Tipo: Roadmap
- Campo de data: Sprint
- Agrupa por: Sprint
- Campos: Title, Type, Status

### My Work View
- Tipo: Table
- Filtro: Assignee = @me
- Ordena por: Status, Priority

---

## 5. Configurar Automações

Vá em **...** → **Workflows** → Ativar:

### Auto-add to project
- Quando: Issue/PR criado no repo
- Ação: Adicionar ao projeto com Status = "📥 Backlog"

### Item closed
- Quando: Issue/PR fechado
- Ação: Mover para "✅ Done"

### Pull request merged
- Quando: PR merged
- Ação: Mover para "✅ Done"

### Code review requested
- Quando: Review solicitado
- Ação: Mover para "👀 Review"

---

## 6. Definition of Ready (DoR)

Antes de mover para **📋 Ready**:

- [ ] Título claro e acionável
- [ ] Descrição completa (o quê + por quê)
- [ ] Acceptance Criteria definidos
- [ ] Estimate preenchido
- [ ] Sem dependências bloqueando
- [ ] Labels corretas (type + priority + area)

---

## 7. Definition of Done (DoD)

Antes de mover para **✅ Done**:

### Para Stories
- [ ] Todos os Acceptance Criteria atendidos
- [ ] Código implementado e commitado
- [ ] Testes unitários passando (coverage >= 80%)
- [ ] Code review aprovado
- [ ] Deploy em preview/staging
- [ ] QA aprovado
- [ ] Documentação atualizada (se necessário)

### Para Tasks
- [ ] Definition of Done da task atendido
- [ ] Verificado por Clara ou Berna

### Para Bugs
- [ ] Bug corrigido
- [ ] Teste de regressão adicionado
- [ ] Não introduziu novos bugs
- [ ] Deploy em preview testado

---

## 8. Labels (já criadas!)

As labels foram criadas automaticamente:

**Type:** `type:epic`, `type:story`, `type:task`, `type:bug`
**Priority:** `priority:p0`, `priority:p1`, `priority:p2`, `priority:p3`
**Status:** `status:blocked`, `status:needs-info`
**Area:** `area:auth`, `area:api`, `area:ui`, `area:db`, `area:infra`

---

## 9. Métricas a Acompanhar

| Métrica | Como medir | Meta |
|---------|------------|------|
| **Lead Time** | Backlog → Done | < 7 dias |
| **Cycle Time** | In Progress → Done | < 3 dias |
| **Throughput** | Cards done/semana | 5-8 |
| **WIP Age** | Tempo em In Progress | < 3 dias |
| **Bug Rate** | Bugs / Total Stories | < 20% |

Use **Insights** do GitHub Projects para visualizar.

---

## 10. Fluxo de Trabalho

```
1. Ideia surge
   ↓
2. Clara cria Issue (template correto)
   ↓
3. Issue vai pro 📥 Backlog
   ↓
4. Refinement: Clara preenche DoR
   ↓
5. Move para 📋 Ready
   ↓
6. Ralph/Clara pega para trabalhar
   ↓
7. Move para 🚧 In Progress
   ↓
8. PR aberto → Move para 👀 Review
   ↓
9. Clara revisa + Berna aprova
   ↓
10. Merge → Move para ✅ Done
```

---

## Pronto! 🎉

Agora você tem um Kanban profissional seguindo práticas de mercado.

**Links úteis:**
- Board: https://github.com/orgs/AutonomousClara/projects/
- Issues: https://github.com/AutonomousClara/protocolos/issues
- Labels: https://github.com/AutonomousClara/protocolos/labels
