import { getSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';
// import { redirect } from 'next/navigation'; // DISABLED
import { WorkoutCard } from '@/components/protocol/WorkoutCard';
import { MealCard } from '@/components/protocol/MealCard';
import { ProtocolTabs } from '@/components/protocol/ProtocolTabs';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

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
        <div>
          {workouts.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-foreground-muted">Nenhum treino encontrado</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {workouts.map((workout: any) => (
                <WorkoutCard key={workout.id} workout={workout} />
              ))}
            </div>
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
        <div>
          {meals.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-foreground-muted">Nenhuma refeição encontrada</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {meals.map((meal: any) => (
                <MealCard key={meal.id} meal={meal} />
              ))}
            </div>
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
