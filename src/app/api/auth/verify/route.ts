import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyMagicLinkToken } from '@/lib/magic-link';
import { SignJWT } from 'jose';

export const dynamic = 'force-dynamic';

const SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || 'fallback-secret-change-me'
);

export async function GET(request: Request) {
  const url = new URL(request.url);
  const baseUrl = `${url.protocol}//${url.host}`;
  
  try {
    const token = url.searchParams.get('token');

    if (!token) {
      return NextResponse.redirect(`${baseUrl}/login?error=missing-token`);
    }

    // Verificar token
    const payload = await verifyMagicLinkToken(token);

    if (!payload) {
      return NextResponse.redirect(`${baseUrl}/login?error=invalid-token`);
    }

    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { email: payload.email },
    });

    if (!user) {
      return NextResponse.redirect(`${baseUrl}/login?error=user-not-found`);
    }

    // Criar session token
    const sessionToken = await new SignJWT({
      sub: user.id,
      email: user.email,
      name: user.name,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('30d')
      .sign(SECRET);

    // Redirect para callback com cookie de sessão
    const response = NextResponse.redirect(`${baseUrl}/auth/callback`);
    
    // Set session cookie - importante: sem secure em dev
    response.cookies.set('auth-token', sessionToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 dias
      path: '/',
    });

    console.log('✅ Auth token set, redirecting to /app');
    return response;
  } catch (error) {
    console.error('Error verifying magic link:', error);
    return NextResponse.redirect(`${baseUrl}/login?error=verification-failed`);
  }
}
