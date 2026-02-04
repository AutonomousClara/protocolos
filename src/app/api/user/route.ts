import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// ID fixo do usuário padrão (auth desabilitado)
const DEFAULT_USER_ID = 'default-user';

export async function PUT(request: Request) {
  try {
    const data = await request.json();

    // Garantir que usuário padrão existe
    let user = await prisma.user.findUnique({
      where: { id: DEFAULT_USER_ID },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          id: DEFAULT_USER_ID,
          email: 'user@protocolos.app',
          name: 'Usuário',
        },
      });
    }

    const updateData: any = {};

    if (data.name !== undefined) {
      updateData.name = data.name;
    }

    if (data.apiKey !== undefined) {
      // Salvar API key (sem criptografia por simplicidade)
      updateData.apiKey = data.apiKey === '' ? null : data.apiKey;
    }

    user = await prisma.user.update({
      where: { id: DEFAULT_USER_ID },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        hasApiKey: !!user.apiKey,
      },
    });
  } catch (error: any) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar usuário: ' + error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Garantir que usuário padrão existe
    let user = await prisma.user.findUnique({
      where: { id: DEFAULT_USER_ID },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          id: DEFAULT_USER_ID,
          email: 'user@protocolos.app',
          name: 'Usuário',
        },
      });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        hasApiKey: !!user.apiKey,
      },
    });
  } catch (error: any) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar usuário: ' + error.message },
      { status: 500 }
    );
  }
}
