import { getSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { CheckinForm } from '@/components/checkin/CheckinForm';
import { Card, CardContent } from '@/components/ui/Card';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default async function CheckinPage() {
  const session = await getSession();

  if (!session?.user?.id) {
    // redirect('/login'); // DISABLED FOR TESTING
  }

  const protocol = await prisma.protocol.findFirst({
    where: {
      userId: session.user.id,
      isActive: true,
    },
  });

  if (!protocol) {
    return (
      <div className="max-w-2xl mx-auto">
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
              Você precisa ter um protocolo ativo para fazer check-in
            </p>
            <Link href="/app/protocol/upload">
              <Button>Fazer Upload de PDF</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Verificar se já fez check-in hoje
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayCheckin = await prisma.checkin.findFirst({
    where: {
      userId: session.user.id,
      protocolId: protocol.id,
      date: {
        gte: today,
        lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
      },
    },
  });

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Check-in Diário
        </h1>
        <p className="text-foreground-muted">
          {todayCheckin
            ? 'Edite seu check-in de hoje'
            : 'Como foi seu dia? Registre suas atividades'}
        </p>
      </div>

      {todayCheckin && (
        <Card variant="glass">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-foreground">Você já fez check-in hoje!</p>
                <p className="text-sm text-foreground-muted">
                  Você pode editar suas informações abaixo
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <CheckinForm protocolId={protocol.id} existingCheckin={todayCheckin} />
    </div>
  );
}
