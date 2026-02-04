import { Sidebar } from './Sidebar';
import { Header } from './Header';

// Usuário padrão (auth desabilitado)
const defaultUser = {
  id: 'default-user',
  email: 'user@protocolos.app',
  name: 'Usuário',
  image: null,
};

export async function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header user={defaultUser} />
        <main className="flex-1 p-4 sm:p-6 overflow-auto pt-16 lg:pt-6">
          {children}
        </main>
      </div>
    </div>
  );
}
