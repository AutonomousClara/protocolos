import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

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
    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET
    });
    
    const isLoggedIn = !!token;
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
    // On error, allow the request to proceed
    return NextResponse.next();
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
