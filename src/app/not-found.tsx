import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="max-w-md w-full">
        <CardContent className="p-8 text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-primary/20 flex items-center justify-center">
            <svg
              className="w-10 h-10 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <div>
            <h1 className="text-6xl font-bold gradient-purple-pink bg-clip-text text-transparent mb-4">
              404
            </h1>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Página não encontrada
            </h2>
            <p className="text-foreground-muted">
              A página que você está procurando não existe ou foi movida.
            </p>
          </div>

          <Link href="/">
            <Button className="w-full">Voltar para o Início</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
