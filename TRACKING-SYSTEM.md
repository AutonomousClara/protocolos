# Sistema de Tracking - ProtocolOS

> **Decisão:** Usar Notion como fonte da verdade para documentação e GitHub para código/issues técnicas.

**Data da Decisão:** 2026-02-04  
**Decidido por:** Bernardo + Clara  
**Contexto:** Informação estava espalhada (Notion, GitHub, Discord) sem sistema claro de onde documentar o quê.

---

## 🎯 Problema Identificado

**Antes:**
- Informação duplicada em Notion e GitHub
- Não estava claro onde documentar cada coisa
- Docs ficavam desatualizados
- Perda de tracking do que estava acontecendo

**Solução:**
Divisão clara de responsabilidades entre Notion (docs ricos) e GitHub (código + issues técnicas).

---

## 📍 Divisão de Responsabilidades

### GitHub (Fonte da Verdade: Código)

| O que | Por que GitHub |
|-------|----------------|
| **Código-fonte** | Versionamento, review, CI/CD |
| **Pull Requests** | Code review ligado ao código |
| **Issues técnicas** | Bugs, tasks técnicas, integração com commits |
| **Actions/CI** | Automação de build/deploy |
| **Releases** | Tags, changelog automático |

**URL:** https://github.com/AutonomousClara/protocolos

---

### Notion (Fonte da Verdade: Documentação)

| O que | Por que Notion |
|-------|----------------|
| **Roadmap visual** | UI superior, drag & drop, timeline |
| **Specs detalhadas** | Rich text, imagens, embeds, tabelas |
| **Sprint planning** | Kanban visual, relações entre databases |
| **Status reports** | Formatação rica, gráficos |
| **Decisões estratégicas** | Contexto completo, histórico |
| **Ideias futuras** | Database de ideias com score |
| **Tracking de produtos** | Dashboard de todos os produtos |

**URL:** https://notion.so/Dashboard-Clara-2fc6fe090f9d80b3b8e1e20b48d9b514

---

## 🗂️ Estrutura no Notion

### 1. Dashboard Clara (Raiz)
- Overview de todos os produtos
- Links rápidos
- Métricas gerais

### 2. Página ProtocolOS
**Seções:**
- 📊 Status Atual (sempre atualizado)
- 🗺️ Roadmap Visual (timeline das fases)
- 🔗 Links Importantes (repo, deploy, docs)
- 📝 Decisões Recentes

### 3. Database "Sprints"
**Campos:**
- Sprint (título)
- Status (Planejado/Em Andamento/Concluído)
- Progresso (0%, 25%, 50%, 75%, 100%)
- Meta (o que vai ser entregue)
- Início/Fim (datas)

**View:**
- Board por Status
- Timeline por datas

### 4. Database "Tarefas"
**Campos:**
- Tarefa (título)
- Tipo (Feature/Bug/Test/Docs)
- Status (To Do/In Progress/Done)
- Prioridade (Crítica/Alta/Média/Baixa)
- Estimativa (S/M/L/XL)
- Sprint (relation)
- GitHub Issue (URL)

**Sincronização:**
- Issues do GitHub aparecem aqui com link
- Status atualizado manualmente (por enquanto)

### 5. Database "Decisões" (novo)
**Campos:**
- Decisão (título)
- Data
- Contexto (por que?)
- Alternativas Consideradas
- Decisão Final
- Outcome (o que aconteceu)
- Lições Aprendidas

### 6. Database "Produtos" (já existe)
Tracking de todos os produtos Clara (BioGen, TextUp, etc)

### 7. Database "Ideias Futuras" (já existe)
Banco de ideias com score de prioridade

---

## 🔄 Workflow Operacional

### Durante Desenvolvimento (Diário)

1. **Ralph implementa:**
   - Trabalha no código
   - Commita no GitHub com refs (#issue)
   - Abre PR quando pronto

2. **Clara monitora:**
   - Ve PRs/commits no GitHub
   - Atualiza status no Notion
   - Adiciona notas/contexto

3. **Issues fechadas:**
   - GitHub: merge + close issue
   - Notion: atualizar tarefa pra Done

---

### Sprint Planning (Semanal)

1. **No Notion:**
   - Berna + Clara planejam visualmente
   - Arrastam tarefas pro sprint
   - Definem prioridades

2. **No GitHub:**
   - Clara cria issues correspondentes
   - Adiciona labels, milestone
   - Link bidirecional (Notion ↔ GitHub)

3. **Documentação:**
   - Página de Sprint Report criada no Notion
   - Status report semanal

---

### Fim de Sprint (Semanal/Quinzenal)

1. **Notion:**
   - Atualizar status do sprint pra "Concluído"
   - Criar Sprint Report com:
     - O que foi feito
     - Bloqueios encontrados
     - Métricas (velocity, etc)
     - Lições aprendidas

2. **GitHub:**
   - Fechar milestone se 100% concluído
   - Criar release/tag se houver deploy

3. **Comunicação:**
   - Status report no Notion
   - Post no blog (se relevante)
   - Tweet/Instagram (se lançamento)

---

### Decisões Estratégicas

**Quando tomar uma decisão importante:**

1. **Criar entrada no database "Decisões"** (Notion)
   - Contexto completo
   - Alternativas consideradas
   - Por que escolhemos X

2. **Criar ADR no GitHub** (se decisão técnica)
   - `docs/adr/YYYY-MM-DD-titulo.md`
   - Formato markdown
   - Linkado no Notion

3. **Comunicar:**
   - Atualizar página do projeto
   - Avisar stakeholders (Berna)

---

## 📋 Sincronização Manual (Por Enquanto)

**Clara faz diariamente:**

1. **GitHub → Notion:**
   - Issues fechadas → atualizar tarefas
   - Novos commits → adicionar notas
   - PRs merged → atualizar progresso

2. **Notion → GitHub:**
   - Tarefas planejadas → criar issues
   - Decisões → ADRs (se técnica)
   - Specs → CLAUDE.md no repo

**Frequência:**
- Fim do dia: sincronizar status
- Fim da semana: status report completo
- Fim do sprint: retrospectiva + planning

---

## 🚀 Automação Futura (Opcional)

**Se o projeto crescer, considerar:**

- Zapier/Make: GitHub ↔ Notion sync
- GitHub Actions: Atualizar Notion automaticamente
- Notion API: Criar issues do Notion direto

**Por enquanto:** Sync manual é suficiente e mais confiável.

---

## 🔍 Onde Encontrar Cada Coisa

### "Qual é o roadmap do projeto?"
→ **Notion:** Página ProtocolOS > Seção Roadmap

### "Quais issues estão abertas?"
→ **GitHub Issues:** https://github.com/AutonomousClara/protocolos/issues
→ **Notion:** Database Tarefas (filtrado por Status)

### "O que foi feito na última sprint?"
→ **Notion:** Página Sprint N Report

### "Como funciona o parser de PDF?"
→ **GitHub:** README.md ou docs/
→ **Notion:** Specs técnicas (se houver)

### "Por que decidimos usar Groq?"
→ **Notion:** Database Decisões > "Escolha de AI Provider"

### "Quanto progresso fizemos essa semana?"
→ **Notion:** Status Report semanal

### "Qual o código do componente X?"
→ **GitHub:** src/components/X.tsx

---

## ✅ Checklist de Documentação

### Ao criar nova feature
- [ ] Criar issue no GitHub (técnico)
- [ ] Criar tarefa no Notion (contexto)
- [ ] Linkar os dois
- [ ] Adicionar ao sprint atual

### Ao fechar feature
- [ ] Merge PR no GitHub
- [ ] Fechar issue
- [ ] Atualizar tarefa no Notion (Done)
- [ ] Adicionar notas de implementação

### Ao terminar sprint
- [ ] Criar Sprint Report no Notion
- [ ] Atualizar database de Sprints
- [ ] Sincronizar tarefas Done
- [ ] Planejar próximo sprint

### Ao tomar decisão importante
- [ ] Criar entrada no database Decisões
- [ ] Criar ADR no GitHub (se técnico)
- [ ] Atualizar página do projeto
- [ ] Comunicar ao time

---

## 🎯 Meta

**Objetivo:** Qualquer pessoa (ou IA) deve conseguir:

1. **Ver o estado atual:** Notion > ProtocolOS > Status Atual
2. **Ver o código:** GitHub > repo
3. **Entender decisões:** Notion > Decisões
4. **Saber o que fazer:** Notion > Tarefas (To Do)
5. **Ver histórico:** Notion > Sprint Reports

Se não conseguir, **o sistema falhou**.

---

## 📞 Responsabilidades

| Quem | O que |
|------|-------|
| **Clara** | Manter tudo sincronizado, atualizar docs |
| **Berna** | Priorizar, validar, decidir escopo |
| **Ralph** | Implementar, commitar seguindo convenções |

---

## 🔄 Revisão do Sistema

**Revisar este documento:**
- Fim de cada sprint
- Quando algo não estiver funcionando
- Quando o time crescer

**Última revisão:** 2026-02-04

---

*Este documento é vivo. Se algo não funciona, atualize.*
