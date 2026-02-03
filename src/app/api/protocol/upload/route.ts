import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { parseProtocolPdf } from '@/lib/pdf-parser';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 });
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Apenas arquivos PDF são aceitos' }, { status: 400 });
    }

    // Limitar tamanho (10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'Arquivo muito grande (máx 10MB)' }, { status: 400 });
    }

    // Salvar arquivo
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const filename = `${uuidv4()}-${file.name}`;
    const filepath = join(process.cwd(), 'public', 'uploads', filename);

    await writeFile(filepath, buffer);

    // Buscar API key do usuário
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { apiKey: true },
    });

    // Parsear PDF
    let parsedData;
    try {
      parsedData = await parseProtocolPdf(buffer, user?.apiKey || undefined);
    } catch (error: any) {
      if (error.message === 'PDF_IS_IMAGE') {
        return NextResponse.json(
          { error: 'PDF parece ser uma imagem. Por favor, use um PDF com texto.' },
          { status: 400 }
        );
      }
      if (error.message === 'API_KEY_REQUIRED') {
        return NextResponse.json(
          { error: 'API key do Groq necessária. Configure nas configurações.' },
          { status: 400 }
        );
      }
      throw error;
    }

    // Desativar protocolos anteriores
    await prisma.protocol.updateMany({
      where: {
        userId: session.user.id,
        isActive: true,
      },
      data: {
        isActive: false,
      },
    });

    // Criar novo protocolo
    const protocol = await prisma.protocol.create({
      data: {
        userId: session.user.id,
        name: file.name.replace('.pdf', ''),
        originalPdf: `/uploads/${filename}`,
        workouts: JSON.stringify(parsedData.workouts),
        meals: JSON.stringify(parsedData.mealPlan.meals),
        notes: parsedData.notes,
        isActive: true,
        startDate: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      protocol: {
        id: protocol.id,
        name: protocol.name,
        workouts: parsedData.workouts,
        meals: parsedData.mealPlan.meals,
        notes: parsedData.notes,
      },
    });
  } catch (error: any) {
    console.error('Error uploading protocol:', error);
    return NextResponse.json(
      { error: 'Erro ao processar PDF: ' + error.message },
      { status: 500 }
    );
  }
}
