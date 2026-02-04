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
  // Auth desabilitado - retorna usuário padrão
  return {
    user: {
      id: 'default-user',
      email: 'user@protocolos.app',
      name: 'Usuário',
    },
  };
}
