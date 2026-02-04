import { getSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';
// import { redirect } from 'next/navigation'; // DISABLED
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { ConsistencyCalendar } from '@/components/progress/ConsistencyCalendar';
import { WeightChart } from '@/components/progress/WeightChart';

export const dynamic = 'force-dynamic';

export default async function ProgressPage() {
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
            <p className="text-foreground-muted">
              Você precisa ter um protocolo ativo para ver seu progresso
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Buscar todos os check-ins
  const checkins = await prisma.checkin.findMany({
    where: {
      userId: session.user.id,
      protocolId: protocol.id,
    },
    orderBy: {
      date: 'asc',
    },
  });

  // Calcular estatísticas
  const totalCheckins = checkins.length;
  const trainedCount = checkins.filter((c) => c.trainedToday).length;
  const dietCount = checkins.filter((c) => c.followedDiet).length;

  const trainedPercentage = totalCheckins > 0 ? (trainedCount / totalCheckins) * 100 : 0;
  const dietPercentage = totalCheckins > 0 ? (dietCount / totalCheckins) * 100 : 0;

  // Calcular streak
  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const sortedCheckins = [...checkins].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  for (let i = 0; i < sortedCheckins.length; i++) {
    const checkinDate = new Date(sortedCheckins[i].date);
    checkinDate.setHours(0, 0, 0, 0);

    const expectedDate = new Date(today);
    expectedDate.setDate(today.getDate() - i);

    if (checkinDate.getTime() === expectedDate.getTime()) {
      streak++;
    } else {
      break;
    }
  }

  // Dados de peso
  const weightData = checkins
    .filter((c) => c.weight !== null)
    .map((c) => ({
      date: new Date(c.date),
      weight: c.weight!,
    }));

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Progresso</h1>
        <p className="text-foreground-muted">Acompanhe sua evolução e consistência</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full gradient-purple-pink flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-foreground-muted">Sequência</p>
                <p className="text-2xl font-bold text-foreground">{streak}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-foreground-muted">Check-ins</p>
                <p className="text-2xl font-bold text-foreground">{totalCheckins}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-foreground-muted">Treinos</p>
                <p className="text-2xl font-bold text-foreground">{trainedPercentage.toFixed(0)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-foreground-muted">Dieta</p>
                <p className="text-2xl font-bold text-foreground">{dietPercentage.toFixed(0)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Consistency Calendar */}
      <Card>
        <CardHeader>
          <CardTitle>Calendário de Consistência</CardTitle>
          <p className="text-sm text-foreground-muted mt-1">Últimos 90 dias</p>
        </CardHeader>
        <CardContent>
          <ConsistencyCalendar
            checkins={checkins.map((c) => ({
              date: new Date(c.date),
              trainedToday: c.trainedToday,
              followedDiet: c.followedDiet,
            }))}
          />
        </CardContent>
      </Card>

      {/* Weight Chart */}
      {weightData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Evolução de Peso</CardTitle>
          </CardHeader>
          <CardContent>
            <WeightChart data={weightData} />
          </CardContent>
        </Card>
      )}

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Atividade Recente</CardTitle>
        </CardHeader>
        <CardContent>
          {checkins.length === 0 ? (
            <p className="text-foreground-muted text-center py-8">Nenhum check-in ainda</p>
          ) : (
            <div className="space-y-3">
              {checkins
                .slice(-7)
                .reverse()
                .map((checkin) => (
                  <div
                    key={checkin.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-foreground">
                        {new Date(checkin.date).toLocaleDateString('pt-BR', {
                          weekday: 'long',
                          day: '2-digit',
                          month: 'long',
                        })}
                      </p>
                      <div className="flex gap-3 mt-1 text-sm">
                        {checkin.trainedToday && (
                          <span className="text-success">✓ Treinou</span>
                        )}
                        {checkin.followedDiet && (
                          <span className="text-success">✓ Dieta</span>
                        )}
                        {checkin.weight && (
                          <span className="text-foreground-muted">{checkin.weight}kg</span>
                        )}
                      </div>
                    </div>
                    {checkin.energyLevel && (
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div
                            key={level}
                            className={`w-2 h-6 rounded-full ${
                              level <= checkin.energyLevel!
                                ? 'bg-primary'
                                : 'bg-surface border border-border'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
