import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    // Teste simples primeiro
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'Nenhum arquivo' }, { status: 400 });
    }

    return NextResponse.json({ 
      message: 'Arquivo recebido!',
      filename: file.name,
      size: file.size,
      type: file.type 
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Erro: ' + error.message },
      { status: 500 }
    );
  }
}
