import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          {/* Logo */}
          <div className="inline-block">
            <h1 className="text-6xl md:text-7xl font-bold gradient-purple-pink bg-clip-text text-transparent mb-4">
              ProtocolOS
            </h1>
          </div>

          {/* Tagline */}
          <p className="text-xl md:text-2xl text-foreground-muted max-w-2xl mx-auto">
            Transforme seu PDF de treino e dieta em um acompanhamento inteligente
          </p>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
            <div className="glassmorphism rounded-lg p-6 text-left">
              <div className="w-12 h-12 rounded-full gradient-purple-pink flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Upload Inteligente
              </h3>
              <p className="text-foreground-muted text-sm">
                Envie seu PDF e deixe a IA extrair automaticamente treinos e dieta
              </p>
            </div>

            <div className="glassmorphism rounded-lg p-6 text-left">
              <div className="w-12 h-12 rounded-full gradient-purple-pink flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Check-in Diário
              </h3>
              <p className="text-foreground-muted text-sm">
                Registre suas atividades e mantenha a consistência dia após dia
              </p>
            </div>

            <div className="glassmorphism rounded-lg p-6 text-left">
              <div className="w-12 h-12 rounded-full gradient-purple-pink flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Acompanhe Progresso
              </h3>
              <p className="text-foreground-muted text-sm">
                Visualize sua evolução com gráficos e calendário de consistência
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
            <Link href="/login">
              <Button size="lg" className="text-lg px-8">
                Começar Agora
              </Button>
            </Link>
            <Link href="/app">
              <Button variant="secondary" size="lg" className="text-lg px-8">
                Acessar Dashboard
              </Button>
            </Link>
          </div>

          {/* Tech Stack */}
          <div className="pt-16">
            <p className="text-sm text-foreground-muted mb-4">Tecnologias</p>
            <div className="flex flex-wrap justify-center gap-6 text-foreground-muted text-sm">
              <span>Next.js 14</span>
              <span>•</span>
              <span>Prisma</span>
              <span>•</span>
              <span>SQLite</span>
              <span>•</span>
              <span>Groq AI</span>
              <span>•</span>
              <span>NextAuth v5</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-foreground-muted text-sm">
            ProtocolOS • Acompanhamento inteligente de treino e dieta
          </p>
        </div>
      </footer>
    </div>
  );
}
