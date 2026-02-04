import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';

// POST /api/protocol/diet - Criar nova refeição
export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { protocolId, name, time, foods } = body;

    if (!protocolId || !name || !foods) {
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

    // Parse meals existentes
    const meals = JSON.parse(protocol.meals);

    // Criar nova refeição
    const newMeal = {
      id: `meal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      time: time || '',
      foods,
    };

    // Adicionar nova refeição ao array
    meals.push(newMeal);

    // Atualizar protocolo
    await prisma.protocol.update({
      where: { id: protocolId },
      data: {
        meals: JSON.stringify(meals),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ meal: newMeal }, { status: 201 });
  } catch (error) {
    console.error('Error creating meal:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
