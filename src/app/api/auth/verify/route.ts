import { NextResponse } from 'next/server';
import { signIn } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    if (!token || !email) {
      return NextResponse.redirect(new URL('/login?error=invalid', request.url));
    }

    // TODO: Verificar token no banco
    // Por enquanto, aceitar qualquer token e fazer login
    await signIn('magic-link', {
      token: email,
      redirect: false,
    });

    return NextResponse.redirect(new URL('/app', request.url));
  } catch (error) {
    console.error('Error verifying magic link:', error);
    return NextResponse.redirect(new URL('/login?error=expired', request.url));
  }
}
