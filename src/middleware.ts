import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || 'fallback-secret-change-me'
);

async function verifyAuthToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, SECRET);
    return true;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip API routes, static files, home, and auth pages
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/auth') ||
    pathname.includes('.') ||
    pathname === '/' ||
    pathname === '/login'
  ) {
    return NextResponse.next();
  }

  try {
    const authToken = request.cookies.get('auth-token')?.value;
    const isLoggedIn = authToken ? await verifyAuthToken(authToken) : false;
    
    const isAppRoute = pathname.startsWith('/app');

    // Proteger rotas /app - redirecionar para login se não autenticado
    if (isAppRoute && !isLoggedIn) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    // Em caso de erro, redireciona para login por segurança
    if (pathname.startsWith('/app')) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
