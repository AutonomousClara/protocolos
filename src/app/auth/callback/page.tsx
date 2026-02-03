'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    // Pequeno delay para garantir que o cookie foi setado
    const timer = setTimeout(() => {
      router.replace('/app');
    }, 100);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0F]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
        <p className="text-gray-400">Entrando...</p>
      </div>
    </div>
  );
}
