import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateMagicLinkToken } from '@/lib/magic-link';
import { sendMagicLinkEmail } from '@/lib/resend';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Email inválido' }, { status: 400 });
    }

    // Buscar ou criar usuário
    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      user = await prisma.user.create({
        data: { email },
      });
    }

    // Gerar token JWT
    const token = await generateMagicLinkToken(email);
    
    // Construir URL de verificação
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const verifyUrl = `${baseUrl}/api/auth/verify?token=${token}`;

    // Enviar email
    if (process.env.RESEND_API_KEY) {
      await sendMagicLinkEmail(email, verifyUrl);
      console.log('📧 Email enviado para:', email);
    } else {
      // Dev mode: log no console
      console.log('🔗 Magic Link (dev mode):', verifyUrl);
    }

    return NextResponse.json({
      success: true,
      message: 'Link de acesso enviado para seu email',
      // Em dev, retornar o link para facilitar testes
      ...(process.env.NODE_ENV === 'development' && !process.env.RESEND_API_KEY
        ? { debug: verifyUrl }
        : {}),
    });
  } catch (error) {
    console.error('Error sending magic link:', error);
    return NextResponse.json(
      { error: 'Erro ao enviar link de acesso' },
      { status: 500 }
    );
  }
}
