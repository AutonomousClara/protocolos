import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { parseProtocolPdf } from '@/lib/pdf-parser';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

export const dynamic = 'force-dynamic';

// ID fixo do usuário padrão (auth desabilitado)
const DEFAULT_USER_ID = 'default-user';

export async function POST(request: Request) {
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

    const userId = user.id;

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

    // Criar diretório de uploads se não existir
    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch (e) {
      // Ignora se já existe
    }

    // Parsear PDF (sem API key por enquanto - usar env var se disponível)
    let parsedData;
    try {
      parsedData = await parseProtocolPdf(buffer, process.env.GROQ_API_KEY || undefined);
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
        userId: userId,
        isActive: true,
      },
      data: {
        isActive: false,
      },
    });

    // Criar novo protocolo
    const protocol = await prisma.protocol.create({
      data: {
        userId: userId,
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
