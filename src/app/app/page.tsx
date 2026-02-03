import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  // Buscar protocolo ativo
  const activeProtocol = await prisma.protocol.findFirst({
    where: {
      userId: session.user.id,
      isActive: true,
    },
  });

  // Buscar check-ins recentes
  const recentCheckins = await prisma.checkin.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      date: 'desc',
    },
    take: 7,
  });

  // Calcular streak
  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < recentCheckins.length; i++) {
    const checkinDate = new Date(recentCheckins[i].date);
    checkinDate.setHours(0, 0, 0, 0);

    const expectedDate = new Date(today);
    expectedDate.setDate(today.getDate() - i);

    if (checkinDate.getTime() === expectedDate.getTime()) {
      streak++;
    } else {
      break;
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-foreground-muted">
          Acompanhe seu progresso e mantenha sua consistência
        </p>
      </div>

      {!activeProtocol ? (
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
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Protocolo Ativo</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-foreground mb-1">
                  {activeProtocol.name}
                </p>
                <Link href="/app/protocol">
                  <Button variant="ghost" size="sm" className="mt-2">
                    Ver Detalhes →
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Sequência Atual</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <p className="text-4xl font-bold gradient-purple-pink bg-clip-text text-transparent">
                    {streak}
                  </p>
                  <p className="text-foreground-muted">dias</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Check-ins Total</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <p className="text-4xl font-bold text-success">
                    {recentCheckins.length}
                  </p>
                  <p className="text-foreground-muted">realizados</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Ação Rápida</CardTitle>
            </CardHeader>
            <CardContent>
              <Link href="/app/checkin">
                <Button size="lg" className="w-full md:w-auto">
                  Fazer Check-in de Hoje
                </Button>
              </Link>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
