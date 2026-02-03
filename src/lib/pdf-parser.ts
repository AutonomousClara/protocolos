// @ts-ignore - pdf-parse não tem tipagem correta para ESM
const pdfParse = require('pdf-parse');
import Groq from 'groq-sdk';

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  rest: string;
  notes?: string;
  weight?: string;
}

export interface Workout {
  id: string;
  name: string;
  dayOfWeek?: string[];
  exercises: Exercise[];
}

export interface Food {
  id: string;
  name: string;
  quantity: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
}

export interface Meal {
  id: string;
  name: string;
  time?: string;
  foods: Food[];
}

export interface MealPlan {
  id: string;
  totalCalories?: number;
  totalProtein?: number;
  meals: Meal[];
}

export interface ParsedProtocol {
  workouts: Workout[];
  mealPlan: MealPlan;
  notes?: string;
}

const EXTRACTION_PROMPT = `Você é um assistente que extrai informações de protocolos de treino e dieta.

Dado o texto de um PDF, extraia:
1. Treinos (nome, exercícios com séries, repetições, descanso)
2. Dieta (refeições com alimentos e quantidades)
3. Observações gerais

Retorne um JSON com a estrutura:
{
  "workouts": [
    {
      "id": "uuid",
      "name": "Nome do Treino",
      "dayOfWeek": ["monday", "wednesday"],
      "exercises": [
        {
          "id": "uuid",
          "name": "Nome do Exercício",
          "sets": 4,
          "reps": "8-12",
          "rest": "60s",
          "notes": "observação",
          "weight": "70kg"
        }
      ]
    }
  ],
  "mealPlan": {
    "id": "uuid",
    "totalCalories": 2500,
    "totalProtein": 180,
    "meals": [
      {
        "id": "uuid",
        "name": "Café da manhã",
        "time": "07:00",
        "foods": [
          {
            "id": "uuid",
            "name": "Ovos",
            "quantity": "3 unidades",
            "calories": 210,
            "protein": 18,
            "carbs": 1,
            "fat": 15
          }
        ]
      }
    ]
  },
  "notes": "Observações gerais"
}

Se alguma informação não estiver presente, retorne array vazio ou null.
Seja preciso com números (séries, reps, quantidades).
Mantenha os nomes dos exercícios e alimentos em português.
IMPORTANTE: Gere IDs únicos para cada item usando timestamps ou números sequenciais.`;

function tryRegexExtraction(text: string): { data: ParsedProtocol | null; confidence: number } {
  // Implementação simplificada - poderia ter padrões mais complexos
  const hasWorkout = /treino|exerc[ií]cio|s[eé]rie|repeti/i.test(text);
  const hasDiet = /dieta|refei[çc][ãa]o|caloria|prote[ií]na/i.test(text);

  if (!hasWorkout && !hasDiet) {
    return { data: null, confidence: 0 };
  }

  // Se detectar padrões, mas não conseguir extrair perfeitamente, retorna baixa confiança
  return { data: null, confidence: 0.3 };
}

function validateAndClean(data: any): ParsedProtocol {
  // Garantir estrutura mínima
  return {
    workouts: Array.isArray(data.workouts) ? data.workouts : [],
    mealPlan: data.mealPlan || { id: 'meal-plan-1', meals: [] },
    notes: data.notes || undefined,
  };
}

export async function parseProtocolPdf(
  buffer: Buffer,
  apiKey?: string
): Promise<ParsedProtocol> {
  // 1. Extrair texto do PDF
  const pdfData = await pdfParse(buffer);
  const rawText = pdfData.text;

  // 2. Verificar se há texto suficiente
  if (rawText.length < 100) {
    throw new Error('PDF_IS_IMAGE');
  }

  // 3. Tentar REGEX primeiro
  const regexResult = tryRegexExtraction(rawText);
  if (regexResult.confidence > 0.8 && regexResult.data) {
    return regexResult.data;
  }

  // 4. Fallback para AI
  if (!apiKey) {
    throw new Error('API_KEY_REQUIRED');
  }

  try {
    const groq = new Groq({ apiKey });
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
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
      temperature: 0.1,
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error('NO_CONTENT');
    }

    const parsed = JSON.parse(content);
    return validateAndClean(parsed);
  } catch (error: any) {
    console.error('Error parsing with AI:', error);
    throw new Error('AI_PARSING_ERROR: ' + error.message);
  }
}
