import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';

// PUT /api/protocol/workout/:id - Editar treino
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const workoutId = params.id;
    const body = await req.json();
    const { protocolId, name, exercises, dayOfWeek } = body;

    if (!protocolId) {
      return NextResponse.json(
        { error: 'Missing protocolId' },
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

    // Encontrar índice do workout
    const workoutIndex = workouts.findIndex((w: any) => w.id === workoutId);

    if (workoutIndex === -1) {
      return NextResponse.json({ error: 'Workout not found' }, { status: 404 });
    }

    // Atualizar workout
    workouts[workoutIndex] = {
      ...workouts[workoutIndex],
      name: name || workouts[workoutIndex].name,
      exercises: exercises || workouts[workoutIndex].exercises,
      dayOfWeek: dayOfWeek !== undefined ? dayOfWeek : workouts[workoutIndex].dayOfWeek,
    };

    // Salvar no banco
    await prisma.protocol.update({
      where: { id: protocolId },
      data: {
        workouts: JSON.stringify(workouts),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ workout: workouts[workoutIndex] });
  } catch (error) {
    console.error('Error updating workout:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/protocol/workout/:id - Deletar treino
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const workoutId = params.id;
    const { searchParams } = new URL(req.url);
    const protocolId = searchParams.get('protocolId');

    if (!protocolId) {
      return NextResponse.json(
        { error: 'Missing protocolId' },
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

    // Filtrar workout a ser deletado
    const filteredWorkouts = workouts.filter((w: any) => w.id !== workoutId);

    if (filteredWorkouts.length === workouts.length) {
      return NextResponse.json({ error: 'Workout not found' }, { status: 404 });
    }

    // Salvar no banco
    await prisma.protocol.update({
      where: { id: protocolId },
      data: {
        workouts: JSON.stringify(filteredWorkouts),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting workout:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
