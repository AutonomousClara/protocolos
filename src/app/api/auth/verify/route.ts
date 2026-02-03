import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyMagicLinkToken } from '@/lib/magic-link';
import { SignJWT } from 'jose';

export const dynamic = 'force-dynamic';

const SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || 'fallback-secret-change-me'
);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.redirect(new URL('/login?error=missing-token', request.url));
    }

    // Verificar token
    const payload = await verifyMagicLinkToken(token);

    if (!payload) {
      return NextResponse.redirect(new URL('/login?error=invalid-token', request.url));
    }

    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { email: payload.email },
    });

    if (!user) {
      return NextResponse.redirect(new URL('/login?error=user-not-found', request.url));
    }

    // Criar session token para NextAuth
    const sessionToken = await new SignJWT({
      sub: user.id,
      email: user.email,
      name: user.name,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('30d')
      .sign(SECRET);

    // Redirect para app com cookie de sessão
    const response = NextResponse.redirect(new URL('/app', request.url));
    
    // Set session cookie
    response.cookies.set('auth-token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 dias
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Error verifying magic link:', error);
    return NextResponse.redirect(new URL('/login?error=verification-failed', request.url));
  }
}
