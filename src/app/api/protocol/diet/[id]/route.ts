import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';

// PUT /api/protocol/diet/:id - Editar refeição
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const mealId = params.id;
    const body = await req.json();
    const { protocolId, name, time, foods } = body;

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

    // Parse meals existentes
    const meals = JSON.parse(protocol.meals);

    // Encontrar índice da refeição
    const mealIndex = meals.findIndex((m: any) => m.id === mealId);

    if (mealIndex === -1) {
      return NextResponse.json({ error: 'Meal not found' }, { status: 404 });
    }

    // Atualizar refeição
    meals[mealIndex] = {
      ...meals[mealIndex],
      name: name || meals[mealIndex].name,
      time: time !== undefined ? time : meals[mealIndex].time,
      foods: foods || meals[mealIndex].foods,
    };

    // Salvar no banco
    await prisma.protocol.update({
      where: { id: protocolId },
      data: {
        meals: JSON.stringify(meals),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ meal: meals[mealIndex] });
  } catch (error) {
    console.error('Error updating meal:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/protocol/diet/:id - Deletar refeição
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const mealId = params.id;
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

    // Parse meals existentes
    const meals = JSON.parse(protocol.meals);

    // Filtrar refeição a ser deletada
    const filteredMeals = meals.filter((m: any) => m.id !== mealId);

    if (filteredMeals.length === meals.length) {
      return NextResponse.json({ error: 'Meal not found' }, { status: 404 });
    }

    // Salvar no banco
    await prisma.protocol.update({
      where: { id: protocolId },
      data: {
        meals: JSON.stringify(filteredMeals),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting meal:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
