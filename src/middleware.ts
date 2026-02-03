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
  
  // Skip API routes and static files
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  try {
    // Check our custom auth-token cookie
    const authToken = request.cookies.get('auth-token')?.value;
    const isLoggedIn = authToken ? await verifyAuthToken(authToken) : false;
    
    const isAuthRoute = pathname === '/login';
    const isAppRoute = pathname.startsWith('/app');

    // Not logged in trying to access app → redirect to login
    if (isAppRoute && !isLoggedIn) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Logged in trying to access login → redirect to app
    if (isAuthRoute && isLoggedIn) {
      return NextResponse.redirect(new URL('/app', request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
