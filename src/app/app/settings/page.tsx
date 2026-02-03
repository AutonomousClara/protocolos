'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [userData, setUserData] = useState({
    name: '',
    email: '',
    hasApiKey: false,
  });

  const [formData, setFormData] = useState({
    name: '',
    apiKey: '',
  });

  const [showApiKey, setShowApiKey] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const res = await fetch('/api/user');
      if (!res.ok) throw new Error('Erro ao carregar dados');

      const data = await res.json();
      setUserData(data.user);
      setFormData({
        name: data.user.name || '',
        apiKey: '',
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erro ao salvar');
      }

      const data = await res.json();
      setUserData(data.user);
      setSuccess('Configurações salvas com sucesso!');

      // Limpar campo de API key após salvar
      setFormData({ ...formData, apiKey: '' });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardContent className="py-12 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Configurações</h1>
        <p className="text-foreground-muted">Gerencie seu perfil e integrações</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informações do Perfil</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Nome"
              placeholder="Seu nome"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Email
              </label>
              <p className="text-foreground-muted bg-surface px-4 py-2 rounded-lg border border-border">
                {userData.email}
              </p>
              <p className="text-xs text-foreground-muted mt-1">
                O email não pode ser alterado
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Groq API Key</CardTitle>
            <p className="text-sm text-foreground-muted mt-1">
              Necessária para processar PDFs automaticamente
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <label className="text-sm font-medium text-foreground">
                  API Key
                </label>
                {userData.hasApiKey && (
                  <span className="text-xs bg-success/20 text-success px-2 py-0.5 rounded-full">
                    Configurada
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  placeholder={userData.hasApiKey ? '••••••••••••••••' : 'gsk_...'}
                  value={formData.apiKey}
                  onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                  className="w-full px-4 py-2 pr-12 rounded-lg bg-surface border border-border text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-foreground"
                >
                  {showApiKey ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              <p className="text-xs text-foreground-muted mt-2">
                Deixe em branco para manter a chave atual. Para remover, salve com campo vazio.
              </p>
            </div>

            <div className="bg-surface/50 border border-border rounded-lg p-4">
              <p className="text-sm text-foreground-muted mb-2">
                <strong className="text-foreground">Como obter sua API key:</strong>
              </p>
              <ol className="text-sm text-foreground-muted space-y-1 list-decimal list-inside">
                <li>Acesse <a href="https://console.groq.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">console.groq.com</a></li>
                <li>Crie uma conta ou faça login</li>
                <li>Vá em API Keys e crie uma nova chave</li>
                <li>Cole a chave acima e salve</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        {error && (
          <Card variant="glass">
            <CardContent className="p-4 bg-error/10 border border-error">
              <p className="text-error text-sm">{error}</p>
            </CardContent>
          </Card>
        )}

        {success && (
          <Card variant="glass">
            <CardContent className="p-4 bg-success/10 border border-success">
              <p className="text-success text-sm">{success}</p>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-end">
          <Button type="submit" isLoading={isSaving}>
            Salvar Configurações
          </Button>
        </div>
      </form>
    </div>
  );
}
