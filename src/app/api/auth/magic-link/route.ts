import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { randomBytes } from 'crypto';

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

    // Gerar token
    const token = randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos

    // TODO: Salvar token no banco (criar model MagicLinkToken)
    // Por enquanto, vamos apenas logar o link
    const verifyUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/auth/verify?token=${token}&email=${email}`;

    console.log('🔗 Magic Link:', verifyUrl);

    // TODO: Enviar email com nodemailer
    // Por enquanto, apenas retornar sucesso
    return NextResponse.json({
      success: true,
      message: 'Magic link enviado (verifique o console)',
      debug: process.env.NODE_ENV === 'development' ? verifyUrl : undefined,
    });
  } catch (error) {
    console.error('Error sending magic link:', error);
    return NextResponse.json({ error: 'Erro ao enviar magic link' }, { status: 500 });
  }
}
