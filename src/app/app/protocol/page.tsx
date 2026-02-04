import { getSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';
// import { redirect } from 'next/navigation'; // DISABLED
import { WorkoutCard } from '@/components/protocol/WorkoutCard';
import { MealCard } from '@/components/protocol/MealCard';
import { ProtocolTabs } from '@/components/protocol/ProtocolTabs';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Protocolo',
  description: 'Visualize e gerencie seu protocolo de treino e dieta',
};

export default async function ProtocolPage() {
  const session = await getSession();

  if (!session?.user?.id) {
    return null; // TESTING MODE
  }

  const protocol = await prisma.protocol.findFirst({
    where: {
      userId: session.user.id,
      isActive: true,
    },
  });

  if (!protocol) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="text-center py-12">
          <CardContent>
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/20 flex items-center justify-center">
              <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Nenhum protocolo ativo
            </h3>
            <p className="text-foreground-muted mb-6">
              Faça upload do seu PDF de treino e dieta para começar
            </p>
            <Link href="/app/protocol/upload">
              <Button>Fazer Upload de PDF</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const workouts = JSON.parse(protocol.workouts);
  const meals = JSON.parse(protocol.meals);

  // Organizar treinos por dia da semana
  const workoutsByDay = workouts.reduce((acc: any, workout: any) => {
    const dayKey = workout.dayOfWeek?.[0] || 'Geral';
    if (!acc[dayKey]) {
      acc[dayKey] = [];
    }
    acc[dayKey].push(workout);
    return acc;
  }, {});

  // Mapeamento de dias para ordenação
  const dayOrder: Record<string, number> = {
    'monday': 1,
    'tuesday': 2,
    'wednesday': 3,
    'thursday': 4,
    'friday': 5,
    'saturday': 6,
    'sunday': 7,
    'Geral': 8,
  };

  const sortedDays = Object.keys(workoutsByDay).sort((a, b) => {
    return (dayOrder[a] || 99) - (dayOrder[b] || 99);
  });

  // Organizar refeições por tipo
  const mealsByType: Record<string, any[]> = {
    'Café da Manhã': [],
    'Lanche da Manhã': [],
    'Almoço': [],
    'Lanche da Tarde': [],
    'Jantar': [],
    'Ceia': [],
    'Outros': [],
  };

  meals.forEach((meal: any) => {
    const mealName = meal.name.toLowerCase();
    if (mealName.includes('café') || mealName.includes('breakfast')) {
      mealsByType['Café da Manhã'].push(meal);
    } else if (mealName.includes('almoço') || mealName.includes('lunch')) {
      mealsByType['Almoço'].push(meal);
    } else if (mealName.includes('jantar') || mealName.includes('dinner') || mealName.includes('janta')) {
      mealsByType['Jantar'].push(meal);
    } else if (mealName.includes('lanche da manhã') || mealName.includes('snack 1')) {
      mealsByType['Lanche da Manhã'].push(meal);
    } else if (mealName.includes('lanche da tarde') || mealName.includes('snack 2')) {
      mealsByType['Lanche da Tarde'].push(meal);
    } else if (mealName.includes('ceia') || mealName.includes('supper')) {
      mealsByType['Ceia'].push(meal);
    } else {
      mealsByType['Outros'].push(meal);
    }
  });

  const tabs = [
    {
      id: 'workouts',
      label: 'Treinos',
      badge: workouts.length,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      content: (
        <div className="space-y-6">
          {workouts.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-foreground-muted">Nenhum treino encontrado</p>
              </CardContent>
            </Card>
          ) : (
            <>
              {sortedDays.map((dayKey) => {
                const dayWorkouts = workoutsByDay[dayKey];
                const dayNames: Record<string, string> = {
                  'monday': 'Segunda-feira',
                  'tuesday': 'Terça-feira',
                  'wednesday': 'Quarta-feira',
                  'thursday': 'Quinta-feira',
                  'friday': 'Sexta-feira',
                  'saturday': 'Sábado',
                  'sunday': 'Domingo',
                  'Geral': 'Treinos Gerais',
                };
                const dayLabel = dayNames[dayKey] || dayKey;

                return (
                  <div key={dayKey} className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
                      <h2 className="text-xl font-bold text-foreground">
                        {dayLabel}
                      </h2>
                      <span className="px-2 py-0.5 bg-surface text-foreground-muted text-xs font-medium rounded-full border border-border">
                        {dayWorkouts.length} treino{dayWorkouts.length > 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 gap-4 pl-3">
                      {dayWorkouts.map((workout: any) => (
                        <WorkoutCard key={workout.id} workout={workout} protocolId={protocol.id} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      ),
    },
    {
      id: 'meals',
      label: 'Dieta',
      badge: meals.length,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      content: (
        <div className="space-y-6">
          {meals.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-foreground-muted">Nenhuma refeição encontrada</p>
              </CardContent>
            </Card>
          ) : (
            <>
              {Object.entries(mealsByType).map(([mealType, typeMeals]) => {
                if (typeMeals.length === 0) return null;

                const mealIcons: Record<string, string> = {
                  'Café da Manhã': '☕',
                  'Lanche da Manhã': '🍎',
                  'Almoço': '🍽️',
                  'Lanche da Tarde': '🥤',
                  'Jantar': '🍴',
                  'Ceia': '🌙',
                  'Outros': '🍱',
                };

                return (
                  <div key={mealType} className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{mealIcons[mealType]}</span>
                      <h2 className="text-xl font-bold text-foreground">
                        {mealType}
                      </h2>
                      <span className="px-2 py-0.5 bg-surface text-foreground-muted text-xs font-medium rounded-full border border-border">
                        {typeMeals.length} refeição{typeMeals.length > 1 ? 'ões' : ''}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pl-3">
                      {typeMeals.map((meal: any) => (
                        <MealCard key={meal.id} meal={meal} protocolId={protocol.id} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      ),
    },
    {
      id: 'notes',
      label: 'Observações',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      content: (
        <div>
          {protocol.notes ? (
            <Card variant="glass">
              <CardContent className="p-6">
                <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                  {protocol.notes}
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-foreground-muted">Nenhuma observação encontrada</p>
              </CardContent>
            </Card>
          )}

          {protocol.originalPdf && (
            <Card className="mt-4">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-foreground-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <span className="text-foreground-muted text-sm">PDF Original</span>
                  </div>
                  <a href={protocol.originalPdf} target="_blank" rel="noopener noreferrer">
                    <Button variant="ghost" size="sm">
                      Baixar PDF
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-4 md:space-y-6">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-foreground-muted">
        <Link href="/app" className="hover:text-foreground transition-colors">
          Dashboard
        </Link>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-foreground font-medium">Protocolo</span>
      </nav>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-1 md:mb-2 break-words">
            {protocol.name}
          </h1>
          <p className="text-sm md:text-base text-foreground-muted">
            {protocol.startDate
              ? `Iniciado em ${new Date(protocol.startDate).toLocaleDateString('pt-BR')}`
              : 'Protocolo ativo'
            }
          </p>
        </div>
        <Link href="/app/protocol/upload" className="w-full sm:w-auto">
          <Button variant="secondary" className="w-full sm:w-auto">Novo Upload</Button>
        </Link>
      </div>

      <ProtocolTabs tabs={tabs} defaultTab="workouts" />
    </div>
  );
}
