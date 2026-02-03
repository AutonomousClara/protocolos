# ProtocolOS - Spec Técnica

> App de acompanhamento de treino e dieta com extração automática de PDF.

**Leia primeiro:** `DISCOVERY.md`

---

## Visão Geral

ProtocolOS é um app web onde o usuário faz upload do PDF de treino/dieta que recebeu do personal trainer. O app usa IA para extrair e estruturar o conteúdo automaticamente. O usuário faz check-in diário e acompanha sua evolução.

---

## Stack

| Camada | Tecnologia |
|--------|------------|
| Framework | Next.js 14 (App Router) |
| Linguagem | TypeScript |
| Styling | Tailwind CSS |
| Auth | NextAuth.js v5 (credentials + magic link) |
| Database | **SQLite (dev) → Supabase Postgres (prod)** |
| ORM | Prisma |
| Storage | Local filesystem (dev) → Supabase Storage (prod) |
| PDF Parsing | pdf-parse |
| AI | Groq API (llama3) - BYOK |
| Deploy | Vercel |

### Database Strategy

**Fase 1 (MVP Local):**
- SQLite via Prisma (`file:./dev.db`)
- PDFs salvos em `/public/uploads/`
- Roda 100% local

**Fase 2 (Produção):**
- Migrar para Supabase Postgres (só muda connection string)
- PDFs no Supabase Storage
- Zero mudança no código

---

## Database Schema

```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  image         String?
  apiKey        String?   // Groq API key (encrypted)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  protocols     Protocol[]
  checkins      Checkin[]
}

model Protocol {
  id            String    @id @default(cuid())
  userId        String
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  name          String    // "Protocolo Janeiro 2026"
  originalPdf   String    // URL do PDF no storage
  
  // Dados extraídos
  workouts      Json      // Array de workouts estruturados
  meals         Json      // Array de refeições estruturadas
  notes         String?   // Observações gerais
  
  startDate     DateTime?
  endDate       DateTime?
  isActive      Boolean   @default(true)
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  checkins      Checkin[]
}

model Checkin {
  id            String    @id @default(cuid())
  userId        String
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  protocolId    String
  protocol      Protocol  @relation(fields: [protocolId], references: [id], onDelete: Cascade)
  
  date          DateTime  @default(now())
  
  // Check-in data
  trainedToday  Boolean
  followedDiet  Boolean
  workoutNotes  String?
  dietNotes     String?
  
  // Opcional
  weight        Float?
  photos        String[]  // URLs das fotos
  
  // Mood/Energy (1-5)
  energyLevel   Int?
  
  createdAt     DateTime  @default(now())
  
  @@unique([userId, protocolId, date])
}
```

---

## Estrutura de Dados Extraídos

### Workout (JSON)

```typescript
interface Workout {
  id: string;
  name: string;           // "Treino A - Peito e Tríceps"
  dayOfWeek?: string[];   // ["monday", "thursday"]
  exercises: Exercise[];
}

interface Exercise {
  id: string;
  name: string;           // "Supino Reto"
  sets: number;           // 4
  reps: string;           // "8-12" ou "15"
  rest: string;           // "60s"
  notes?: string;         // "Foco na descida controlada"
  weight?: string;        // "70kg" (se especificado)
}
```

### Meal Plan (JSON)

```typescript
interface MealPlan {
  id: string;
  totalCalories?: number;
  totalProtein?: number;
  meals: Meal[];
}

interface Meal {
  id: string;
  name: string;           // "Café da manhã"
  time?: string;          // "07:00"
  foods: Food[];
}

interface Food {
  id: string;
  name: string;           // "Ovos inteiros"
  quantity: string;       // "3 unidades"
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
}
```

---

## Páginas e Rotas

```
/                       Landing page
/login                  Login (magic link)
/app                    Dashboard principal (redirect se não logado)
/app/protocol           Protocolo ativo (treino + dieta)
/app/protocol/upload    Upload de novo PDF
/app/checkin            Check-in do dia
/app/history            Histórico de check-ins
/app/progress           Gráficos de evolução
/app/settings           Configurações (API key, perfil)
```

---

## User Flows

### Flow 1: Primeiro Acesso

```
[Landing] → [Login] → [Magic Link enviado] → [Clica no email]
    → [Redirect /app] → [Sem protocolo] → [Prompt upload PDF]
    → [Upload] → [Processando...] → [Preview do que foi extraído]
    → [Confirma/Edita] → [Protocolo salvo] → [Dashboard]
```

**Estados:**
- Loading: Spinner com "Analisando seu protocolo..."
- Success: Preview dos dados extraídos com opção de editar
- Error: "Não consegui extrair. Verifique se o PDF contém treino/dieta."
- Empty: "PDF parece vazio ou é uma imagem. Tente outro arquivo."

### Flow 2: Check-in Diário

```
[Dashboard] → [Botão "Check-in"] → [Modal/Page de check-in]
    → [Treinou hoje? Y/N] → [Seguiu dieta? Y/N]
    → [Notas opcionais] → [Peso opcional] → [Fotos opcionais]
    → [Salvar] → [Animação de sucesso] → [Dashboard atualizado]
```

**Estados:**
- Já fez check-in hoje: Mostra resumo, permite editar
- Não fez: Mostra formulário
- Streak: Mostra sequência de dias

### Flow 3: Ver Progresso

```
[Dashboard] → [Aba Progress] → [Gráficos]
    → Calendário de consistência (estilo GitHub)
    → Gráfico de peso (se registrado)
    → % de treinos completados
    → % de dieta seguida
```

---

## Componentes Principais

### Layout
- `AppLayout` - Sidebar + Header + Content
- `Sidebar` - Navegação (Protocol, Check-in, Progress, Settings)
- `Header` - User menu, notificações

### Protocol
- `ProtocolUpload` - Drag & drop PDF
- `ProtocolPreview` - Mostra dados extraídos, permite editar
- `WorkoutCard` - Exibe um treino com exercícios
- `MealCard` - Exibe uma refeição com alimentos
- `ExerciseList` - Lista de exercícios de um treino
- `FoodList` - Lista de alimentos de uma refeição

### Check-in
- `CheckinForm` - Formulário de check-in
- `CheckinSummary` - Resumo do check-in do dia
- `StreakBadge` - Mostra sequência atual

### Progress
- `ConsistencyCalendar` - Calendário estilo GitHub contributions
- `WeightChart` - Gráfico de linha (peso ao longo do tempo)
- `StatsCards` - Cards com % treino, % dieta, streak

### Settings
- `ApiKeyInput` - Input para Groq API key (masked)
- `ProfileForm` - Nome, email, foto

---

## API Routes

### Auth
- `POST /api/auth/magic-link` - Envia magic link
- `GET /api/auth/verify` - Verifica token do magic link

### Protocol
- `POST /api/protocol/upload` - Upload PDF + processa
- `GET /api/protocol/active` - Retorna protocolo ativo
- `PUT /api/protocol/:id` - Atualiza protocolo (edições manuais)
- `DELETE /api/protocol/:id` - Arquiva protocolo

### Check-in
- `POST /api/checkin` - Cria check-in
- `GET /api/checkin/today` - Check-in de hoje
- `GET /api/checkin/history` - Histórico paginado
- `PUT /api/checkin/:id` - Edita check-in

### Stats
- `GET /api/stats/consistency` - Dados para calendário
- `GET /api/stats/summary` - % treino, % dieta, streak

---

## PDF Parsing Flow

```typescript
async function parseProtocolPdf(file: File, apiKey: string): Promise<ParsedProtocol> {
  // 1. Extrair texto do PDF
  const pdfBuffer = await file.arrayBuffer();
  const pdfData = await pdfParse(Buffer.from(pdfBuffer));
  const rawText = pdfData.text;
  
  // 2. Se texto muito curto, provavelmente é imagem
  if (rawText.length < 100) {
    throw new Error('PDF_IS_IMAGE');
  }
  
  // 3. Tentar REGEX primeiro (padrões comuns)
  const regexResult = tryRegexExtraction(rawText);
  if (regexResult.confidence > 0.8) {
    return regexResult.data;
  }
  
  // 4. Fallback para AI
  const groq = new Groq({ apiKey });
  const completion = await groq.chat.completions.create({
    model: 'llama3-70b-8192',
    messages: [
      {
        role: 'system',
        content: EXTRACTION_PROMPT,
      },
      {
        role: 'user',
        content: rawText,
      },
    ],
    response_format: { type: 'json_object' },
  });
  
  // 5. Validar e retornar
  const parsed = JSON.parse(completion.choices[0].message.content);
  return validateAndClean(parsed);
}
```

### Extraction Prompt

```
Você é um assistente que extrai informações de protocolos de treino e dieta.

Dado o texto de um PDF, extraia:
1. Treinos (nome, exercícios com séries, repetições, descanso)
2. Dieta (refeições com alimentos e quantidades)
3. Observações gerais

Retorne um JSON com a estrutura:
{
  "workouts": [...],
  "meals": [...],
  "notes": "..."
}

Se alguma informação não estiver presente, retorne array vazio ou null.
Seja preciso com números (séries, reps, quantidades).
Mantenha os nomes dos exercícios e alimentos em português.
```

---

## Design System

### Cores
- Primary: Purple (#8B5CF6)
- Secondary: Pink (#EC4899)
- Success: Green (#10B981)
- Warning: Yellow (#F59E0B)
- Error: Red (#EF4444)
- Background: Dark (#0A0A0F)
- Surface: (#13131A)
- Border: (#1F1F2E)

### Componentes Base
- Seguir padrão do autonomousclara-ds
- Cards com glassmorphism sutil
- Botões com gradiente purple-pink
- Inputs com borda sutil, foco em purple

---

## Critérios de Aceite

### Funcionais
1. [ ] Usuário consegue criar conta com magic link
2. [ ] Usuário consegue fazer upload de PDF
3. [ ] Sistema extrai treino e dieta do PDF com >80% precisão
4. [ ] Usuário consegue editar dados extraídos
5. [ ] Usuário consegue fazer check-in diário
6. [ ] Sistema mostra streak de dias consecutivos
7. [ ] Usuário vê calendário de consistência
8. [ ] Usuário vê % de treinos e dieta cumpridos
9. [ ] Usuário consegue configurar API key
10. [ ] Sistema funciona sem API key (modo limitado?)

### Não-Funcionais
11. [ ] Tempo de parsing PDF < 30s
12. [ ] Lighthouse Performance >= 80
13. [ ] Lighthouse Accessibility >= 90
14. [ ] Mobile responsive
15. [ ] Funciona offline (PWA - check-in local)

### Segurança
16. [ ] API key armazenada criptografada
17. [ ] PDFs só acessíveis pelo dono
18. [ ] Rate limiting em uploads
19. [ ] Validação de tipo de arquivo (só PDF)

---

## Testes Necessários

### Unit
- `parseProtocolPdf` - diferentes formatos de PDF
- `tryRegexExtraction` - padrões conhecidos
- `validateAndClean` - sanitização de dados

### Integration
- Upload PDF → dados corretos no banco
- Check-in → atualiza stats
- Magic link → cria sessão

### E2E
- Fluxo completo: signup → upload → checkin → ver stats

---

## Não Fazer (Fora do Escopo MVP)

- ❌ App mobile nativo
- ❌ MediaPipe análise de vídeo
- ❌ Multi-idioma
- ❌ Dashboard do treinador
- ❌ Compartilhamento social
- ❌ Integração com wearables
- ❌ Planos pagos / billing

---

## Ordem de Implementação

1. **Setup** - Next.js, Tailwind, Prisma, Supabase
2. **Auth** - NextAuth com magic link
3. **Upload** - Componente + storage
4. **Parsing** - pdf-parse + Groq
5. **Protocol View** - Exibir treino/dieta extraídos
6. **Check-in** - Formulário + persistência
7. **Progress** - Calendário + stats
8. **Settings** - API key + perfil
9. **Polish** - Loading states, errors, mobile
10. **Deploy** - Vercel + domínio

---

## Referências

- [pdf-parse](https://www.npmjs.com/package/pdf-parse)
- [Groq SDK](https://github.com/groq/groq-typescript)
- [NextAuth.js v5](https://authjs.dev/)
- [Supabase](https://supabase.com/docs)
- [Prisma](https://www.prisma.io/docs)

---

*Spec criada em: 2026-02-02 23:15*
*Autor: Clara*
*Status: Pronto para implementação*
