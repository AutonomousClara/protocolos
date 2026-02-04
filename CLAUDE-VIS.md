# CLAUDE.md - Melhorar Visualização de Protocolo

## Contexto
O ProtocolOS permite upload de PDFs de treino/dieta. A IA extrai os dados e salva no banco. Precisamos melhorar a visualização do protocolo na página `/app/protocol`.

## Objetivo
Criar uma interface clara e organizada para visualizar treinos e dieta extraídos.

## Stack
- Next.js 14 (App Router)
- Tailwind CSS
- Prisma (já configurado)
- Componentes em `src/components/ui/`

## Arquivos Relevantes
- `src/app/app/protocol/page.tsx` — página principal (melhorar)
- `src/components/ui/Card.tsx` — componente de card
- `src/lib/prisma.ts` — cliente Prisma
- `prisma/schema.prisma` — modelo Protocol

## Requisitos

### 1. Layout Geral
- Tabs ou seções separadas: "Treinos" | "Dieta" | "Observações"
- Header com nome do protocolo e data de início
- Botão para fazer novo upload

### 2. Visualização de Treinos
- Card por treino (FULLBODY A, FULLBODY B, etc)
- Tabela de exercícios dentro de cada card:
  | Exercício | Séries | Reps | Descanso | Notas |
- Cards colapsáveis (expandir/recolher)
- Cores diferentes por treino

### 3. Visualização de Dieta
- Card por refeição (Café, Almoço, Jantar, etc)
- Lista de alimentos com quantidades
- Horário da refeição (se disponível)
- Totais de macros (se disponível)

### 4. Design
- Seguir o tema dark existente (--background: #0A0A0F)
- Usar gradiente roxo/rosa para destaques
- Mobile-first, responsivo
- Ícones para categorias

## Modelo de Dados (já existe)
```prisma
model Protocol {
  id          String   @id @default(cuid())
  userId      String
  name        String
  originalPdf String
  workouts    String   // JSON stringified
  meals       String   // JSON stringified
  notes       String?
  isActive    Boolean  @default(true)
  startDate   DateTime @default(now())
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

## Estrutura JSON dos Treinos
```json
{
  "id": "w1",
  "name": "FULLBODY A",
  "exercises": [
    {
      "id": "e1",
      "name": "Elevação lateral",
      "sets": 3,
      "reps": "10-12",
      "rest": "60s",
      "notes": "WORKING/TOP"
    }
  ]
}
```

## Estrutura JSON das Refeições
```json
{
  "id": "m1",
  "name": "Café da manhã",
  "time": "07:00",
  "foods": [
    {
      "id": "f1",
      "name": "Ovos",
      "quantity": "3 unidades"
    }
  ]
}
```

## Entregáveis
1. `src/app/app/protocol/page.tsx` — refatorado
2. `src/components/protocol/WorkoutCard.tsx` — novo
3. `src/components/protocol/MealCard.tsx` — novo
4. `src/components/protocol/ProtocolTabs.tsx` — novo (opcional)

## Commits
- Commits atômicos em português
- Prefixos: feat:, fix:, refactor:
- Co-Authored-By: Claude <noreply@anthropic.com>

## Não Fazer
- Não alterar schema do Prisma
- Não alterar API routes
- Não implementar CRUD (será outra issue)
- Não quebrar funcionalidade existente
