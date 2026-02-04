import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';

// POST /api/protocol/workout - Criar novo treino
export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { protocolId, name, exercises, dayOfWeek } = body;

    if (!protocolId || !name || !exercises) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Buscar protocolo ativo
    const protocol = await prisma.protocol.findFirst({
      where: {
        id: protocolId,
        userId: session.user.id,
        isActive: true,
      },
    });

    if (!protocol) {
      return NextResponse.json({ error: 'Protocol not found' }, { status: 404 });
    }

    // Parse workouts existentes
    const workouts = JSON.parse(protocol.workouts);

    // Criar novo workout
    const newWorkout = {
      id: `workout-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      exercises,
      dayOfWeek: dayOfWeek || [],
    };

    // Adicionar novo workout ao array
    workouts.push(newWorkout);

    // Atualizar protocolo
    await prisma.protocol.update({
      where: { id: protocolId },
      data: {
        workouts: JSON.stringify(workouts),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ workout: newWorkout }, { status: 201 });
  } catch (error) {
    console.error('Error creating workout:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
