import { SignJWT, jwtVerify } from 'jose';

const SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || 'fallback-secret-change-me'
);

const EXPIRATION = '15m'; // 15 minutos

export interface MagicLinkPayload {
  email: string;
  type: 'magic-link';
}

export async function generateMagicLinkToken(email: string): Promise<string> {
  const token = await new SignJWT({ email, type: 'magic-link' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(EXPIRATION)
    .sign(SECRET);

  return token;
}

export async function verifyMagicLinkToken(token: string): Promise<MagicLinkPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    
    if (payload.type !== 'magic-link') {
      return null;
    }

    return {
      email: payload.email as string,
      type: 'magic-link',
    };
  } catch (error) {
    console.error('Invalid magic link token:', error);
    return null;
  }
}
