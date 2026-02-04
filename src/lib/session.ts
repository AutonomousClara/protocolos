import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || 'fallback-secret-change-me'
);

export interface SessionUser {
  id: string;
  email: string;
  name: string | null;
}

export interface Session {
  user: SessionUser;
}

export async function getSession(): Promise<Session | null> {
  // MODO TESTE - retorna usuário fake
  // TODO: remover depois de testar
  return {
    user: {
      id: 'test-user-123',
      email: 'test@test.com',
      name: 'Test User',
    },
  };
  
  /* ORIGINAL - reativar depois
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
      return null;
    }

    const { payload } = await jwtVerify(token, SECRET);

    return {
      user: {
        id: payload.sub as string,
        email: payload.email as string,
        name: (payload.name as string) || null,
      },
    };
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
  */
}
