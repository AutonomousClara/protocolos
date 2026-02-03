'use client';

import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/Button';

interface HeaderProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function Header({ user }: HeaderProps) {
  return (
    <header className="bg-surface border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            Bem-vindo, {user.name || user.email?.split('@')[0] || 'Usuário'}!
          </h2>
        </div>

        <div className="flex items-center gap-4">
          {user.image && (
            <img
              src={user.image}
              alt={user.name || 'User'}
              className="w-10 h-10 rounded-full border-2 border-border"
            />
          )}
          {!user.image && (
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
              {(user.name || user.email)?.[0]?.toUpperCase() || 'U'}
            </div>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => signOut({ callbackUrl: '/login' })}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sair
          </Button>
        </div>
      </div>
    </header>
  );
}
