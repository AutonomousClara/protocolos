# Documentation Process - ProtocolOS

> **Regra de ouro:** Documentação é código. Se não está documentado, não existe.

---

## 📋 Fontes da Verdade

### 1. DISCOVERY.md
**O que:** Visão de produto, roadmap de alto nível, decisões estratégicas  
**Quando atualizar:** Mudanças de escopo, novas fases, decisões importantes  
**Dono:** Clara + Berna (decisões conjuntas)

**Seções principais:**
- Status atual (sempre no topo!)
- Problema e solução
- Roadmap de fases
- Competidores e diferencial
- Decisões tomadas

**Frequência:** Atualizar no final de cada sprint ou quando roadmap mudar

---

### 2. GitHub Issues
**O que:** Trabalho granular, bugs, tasks, stories, epics  
**Quando criar:** Sempre que identificar trabalho necessário  
**Dono:** Clara cria, Berna prioriza

**Padrão de nomenclatura:**
- 🟣 Epic: Grandes iniciativas (1-2 semanas)
- 🔵 Story: Entrega valor ao usuário
- 🟢 Task: Tarefa técnica
- 🔴 Bug: Defeito

**Labels obrigatórias:**
- `type:*` (epic/story/task/bug)
- `priority:*` (p0/p1/p2/p3)
- `area:*` (auth/api/ui/infra/trainer/video)

**Milestones:**
- Toda issue precisa ter milestone
- v1.0, v2.0, v3.0, v4.0

**Sprints:**
- Issues de sprint ativa têm label `sprint:N`
- Remover label ao fechar sprint

---

### 3. GitHub Projects (Kanban)
**O que:** Status visual do trabalho em andamento  
**URL:** https://github.com/users/AutonomousClara/projects/1

**Colunas:**
- 📥 Backlog — Priorizado mas não iniciado
- 🚀 Todo — Próximo a fazer
- 🔄 In Progress — Sendo trabalhado agora
- ✅ Done — Concluído

**Regras:**
- Só mover issue quando status mudar de verdade
- Done = merged + deployed (não só "código pronto")
- Limpar Done a cada sprint (arquivar)

---

### 4. Commits e PRs
**O que:** Histórico técnico granular  
**Padrão:** Conventional Commits

**Formato:**
```
<tipo>: <descrição curta>

<corpo opcional>

Co-authored-by: Claude <noreply@anthropic.com>
Refs: #123
```

**Tipos:**
- `feat:` — Nova feature
- `fix:` — Correção de bug
- `docs:` — Documentação
- `test:` — Testes
- `ci:` — CI/CD
- `refactor:` — Refatoração
- `style:` — Formatação

**Sempre incluir:**
- Issue relacionada (`Refs: #123`)
- Co-authored-by se foi o Ralph

---

## 🔄 Workflow de Atualização

### Quando começar uma sprint
1. **Criar sprint no kanban** (view personalizada ou coluna)
2. **Selecionar issues** do milestone atual
3. **Adicionar label** `sprint:N` nas issues escolhidas
4. **Mover pra Todo** no kanban
5. **Atualizar DISCOVERY.md** → seção "Sprint Atual"

### Durante a sprint
1. **Mover issues** conforme progresso (Todo → In Progress → Done)
2. **Atualizar issues** com comentários se necessário
3. **Fechar issues** quando merged + deployed

### Quando terminar uma sprint
1. **Arquivar issues Done** do kanban
2. **Remover label** `sprint:N` das issues concluídas
3. **Atualizar DISCOVERY.md:**
   - Marcar sprint como concluída
   - Atualizar stats de issues
   - Atualizar % da fase
4. **Criar próxima sprint** (se houver)

### Quando mudar de fase
1. **Fechar milestone anterior** se 100% concluído
2. **Atualizar DISCOVERY.md:**
   - Marcar fase como concluída
   - Mover próxima fase pra "Atual"
   - Atualizar timeline estimado
3. **Criar issues detalhadas** pro próximo milestone
4. **Comunicar** progresso (blog post, Twitter, etc.)

---

## 📊 Status Report Semanal

**Frequência:** Toda sexta-feira ou fim de sprint

**Template:**
```markdown
## Status Report - YYYY-MM-DD

### Progresso da Semana
- ✅ Issues fechadas: #X, #Y, #Z
- 🚀 Issues iniciadas: #A, #B
- 🔄 Issues em progresso: #C

### Próxima Semana
- Sprint X: [nome]
- Issues planejadas: #D, #E, #F

### Bloqueios
- [se houver]

### Decisões Necessárias
- [se houver]
```

**Salvar em:** `./projects/protocolos/status-reports/YYYY-MM-DD.md`

---

## ✅ Checklist de Documentação

### Ao criar issue
- [ ] Título descritivo com emoji
- [ ] Labels: type, priority, area
- [ ] Milestone atribuído
- [ ] Corpo com descrição clara
- [ ] Critérios de aceitação (se story)

### Ao fechar issue
- [ ] Código merged
- [ ] Deployed em preview/prod
- [ ] Testado manualmente
- [ ] Issue marcada como Done no kanban

### Ao terminar sprint
- [ ] Todas as issues Done arquivadas
- [ ] DISCOVERY.md atualizado
- [ ] Status report criado
- [ ] Próxima sprint planejada

### Ao mudar de fase
- [ ] Milestone anterior fechado
- [ ] DISCOVERY.md atualizado
- [ ] Issues da próxima fase criadas
- [ ] Roadmap revisado

---

## 🚨 Quando NÃO Documentar

**Não criar issues para:**
- Typos triviais (fix direto)
- Ajustes de estilo CSS pequenos
- Refatorações internas (< 30min)

**Mas sempre documentar:**
- Decisões de arquitetura
- Mudanças de escopo
- Bugs que afetam usuários
- Features novas (qualquer tamanho)

---

## 🛠️ Ferramentas

| Ferramenta | Comando | Uso |
|------------|---------|-----|
| **GitHub CLI** | `gh issue list` | Ver issues |
| **GitHub CLI** | `gh issue create` | Criar issue |
| **GitHub CLI** | `gh issue edit #N` | Editar issue |
| **GitHub CLI** | `gh pr status` | Ver PRs |
| **GitHub Projects** | Web UI | Mover issues no kanban |

---

## 📝 Responsabilidades

| Quem | O que |
|------|-------|
| **Clara** | Criar issues, atualizar docs, status reports |
| **Berna** | Priorizar, validar, aprovar mudanças de escopo |
| **Ralph** | Implementar, commitar com convenções |

---

## 🎯 Meta

**Objetivo:** Qualquer pessoa (ou IA) deve conseguir entender o estado do projeto lendo:
1. DISCOVERY.md (visão geral + roadmap)
2. GitHub Issues (trabalho granular)
3. Kanban (status atual)

Se não conseguir, **a documentação falhou**.

---

*Última atualização: 2026-02-04*
