import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// ID fixo do usuário padrão (auth desabilitado)
const DEFAULT_USER_ID = 'default-user';

export async function POST(request: Request) {
  try {
    const userId = DEFAULT_USER_ID;
    const data = await request.json();

    // Normalizar data para hoje (00:00:00)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Verificar se já existe check-in hoje
    const existingCheckin = await prisma.checkin.findFirst({
      where: {
        userId: userId,
        protocolId: data.protocolId,
        date: {
          gte: today,
          lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
        },
      },
    });

    if (existingCheckin) {
      return NextResponse.json(
        { error: 'Já existe um check-in para hoje' },
        { status: 400 }
      );
    }

    const checkin = await prisma.checkin.create({
      data: {
        userId: userId,
        protocolId: data.protocolId,
        date: today,
        trainedToday: data.trainedToday,
        followedDiet: data.followedDiet,
        workoutNotes: data.workoutNotes || null,
        dietNotes: data.dietNotes || null,
        weight: data.weight || null,
        energyLevel: data.energyLevel || null,
      },
    });

    return NextResponse.json({ success: true, checkin });
  } catch (error: any) {
    console.error('Error creating checkin:', error);
    return NextResponse.json(
      { error: 'Erro ao criar check-in: ' + error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const userId = DEFAULT_USER_ID;
    const data = await request.json();

    if (!data.id) {
      return NextResponse.json({ error: 'ID do check-in não fornecido' }, { status: 400 });
    }

    // Verificar se o check-in pertence ao usuário
    const existingCheckin = await prisma.checkin.findFirst({
      where: {
        id: data.id,
        userId: userId,
      },
    });

    if (!existingCheckin) {
      return NextResponse.json({ error: 'Check-in não encontrado' }, { status: 404 });
    }

    const checkin = await prisma.checkin.update({
      where: { id: data.id },
      data: {
        trainedToday: data.trainedToday,
        followedDiet: data.followedDiet,
        workoutNotes: data.workoutNotes || null,
        dietNotes: data.dietNotes || null,
        weight: data.weight || null,
        energyLevel: data.energyLevel || null,
      },
    });

    return NextResponse.json({ success: true, checkin });
  } catch (error: any) {
    console.error('Error updating checkin:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar check-in: ' + error.message },
      { status: 500 }
    );
  }
}
