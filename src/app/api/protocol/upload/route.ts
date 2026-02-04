import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { parseProtocolPdf } from '@/lib/pdf-parser';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// ID fixo do usuário padrão (auth desabilitado)
const DEFAULT_USER_ID = 'default-user';

export async function POST(request: Request) {
  try {
    // 1. Parse form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 });
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Apenas arquivos PDF são aceitos' }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'Arquivo muito grande (máx 10MB)' }, { status: 400 });
    }

    // 2. Garantir usuário padrão existe
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

    // 3. Ler arquivo
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 4. Parsear PDF
    const apiKey = user.apiKey || process.env.GROQ_API_KEY;
    
    let parsedData;
    try {
      parsedData = await parseProtocolPdf(buffer, apiKey || undefined);
    } catch (error: any) {
      if (error.message === 'PDF_IS_IMAGE') {
        return NextResponse.json(
          { error: 'PDF parece ser uma imagem escaneada. Por favor, use um PDF com texto selecionável.' },
          { status: 400 }
        );
      }
      if (error.message === 'API_KEY_REQUIRED') {
        return NextResponse.json(
          { error: 'API key do Groq necessária. Adicione em Configurações.' },
          { status: 400 }
        );
      }
      console.error('PDF parse error:', error);
      return NextResponse.json(
        { error: 'Erro ao analisar PDF: ' + error.message },
        { status: 500 }
      );
    }

    // 5. Desativar protocolos anteriores
    await prisma.protocol.updateMany({
      where: { userId: DEFAULT_USER_ID, isActive: true },
      data: { isActive: false },
    });

    // 6. Criar protocolo
    const protocol = await prisma.protocol.create({
      data: {
        userId: DEFAULT_USER_ID,
        name: file.name.replace('.pdf', ''),
        originalPdf: '',
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
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Erro no upload: ' + error.message },
      { status: 500 }
    );
  }
}
