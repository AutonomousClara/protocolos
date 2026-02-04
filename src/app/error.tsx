'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="max-w-md w-full">
        <CardContent className="p-8 text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-error/20 flex items-center justify-center">
            <svg
              className="w-10 h-10 text-error"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Algo deu errado
            </h2>
            <p className="text-foreground-muted">
              Desculpe, encontramos um erro inesperado. Por favor, tente novamente.
            </p>
          </div>

          {error.digest && (
            <p className="text-xs text-foreground-muted font-mono bg-surface p-2 rounded border border-border">
              ID do erro: {error.digest}
            </p>
          )}

          <div className="flex gap-3">
            <Button
              variant="ghost"
              className="flex-1"
              onClick={() => (window.location.href = '/')}
            >
              Ir para Início
            </Button>
            <Button className="flex-1" onClick={reset}>
              Tentar Novamente
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
