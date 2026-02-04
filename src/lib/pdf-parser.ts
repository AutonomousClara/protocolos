import { extractText } from 'unpdf';
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
      "id": "w1",
      "name": "Nome do Treino",
      "exercises": [
        {
          "id": "e1",
          "name": "Nome do Exercício",
          "sets": 4,
          "reps": "8-12",
          "rest": "60s"
        }
      ]
    }
  ],
  "mealPlan": {
    "id": "mp1",
    "meals": [
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
    ]
  },
  "notes": "Observações gerais"
}

Se alguma informação não estiver presente, retorne array vazio.
Mantenha os nomes em português.`;

export async function parseProtocolPdf(
  buffer: Buffer,
  apiKey?: string
): Promise<ParsedProtocol> {
  // 1. Extrair texto do PDF usando unpdf (funciona em serverless)
  let rawText = '';
  try {
    const { text } = await extractText(buffer, { mergePages: true });
    rawText = text;
  } catch (err: any) {
    console.error('PDF parse error:', err);
    throw new Error('Erro ao ler PDF: ' + err.message);
  }

  // 2. Verificar se há texto suficiente
  if (rawText.length < 50) {
    throw new Error('PDF_IS_IMAGE');
  }

  // 3. Usar AI para extrair dados estruturados
  if (!apiKey) {
    throw new Error('API_KEY_REQUIRED');
  }

  try {
    const groq = new Groq({ apiKey });
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: EXTRACTION_PROMPT },
        { role: 'user', content: rawText.slice(0, 10000) }, // Limitar tamanho
      ],
      response_format: { type: 'json_object' },
      temperature: 0.1,
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error('IA não retornou conteúdo');
    }

    const parsed = JSON.parse(content);
    
    return {
      workouts: Array.isArray(parsed.workouts) ? parsed.workouts : [],
      mealPlan: parsed.mealPlan || { id: 'mp1', meals: [] },
      notes: parsed.notes || undefined,
    };
  } catch (error: any) {
    console.error('AI parsing error:', error);
    throw new Error('Erro na análise com IA: ' + error.message);
  }
}
