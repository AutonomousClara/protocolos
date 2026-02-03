'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

interface CheckinFormProps {
  protocolId: string;
  existingCheckin?: any;
}

export function CheckinForm({ protocolId, existingCheckin }: CheckinFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    trainedToday: existingCheckin?.trainedToday ?? false,
    followedDiet: existingCheckin?.followedDiet ?? false,
    workoutNotes: existingCheckin?.workoutNotes || '',
    dietNotes: existingCheckin?.dietNotes || '',
    weight: existingCheckin?.weight?.toString() || '',
    energyLevel: existingCheckin?.energyLevel || 3,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/checkin', {
        method: existingCheckin ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: existingCheckin?.id,
          protocolId,
          ...formData,
          weight: formData.weight ? parseFloat(formData.weight) : null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erro ao salvar check-in');
      }

      router.push('/app');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Atividades do Dia</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <label className="flex items-center gap-3 p-4 border border-border rounded-lg cursor-pointer hover:bg-surface/50 transition-colors">
            <input
              type="checkbox"
              checked={formData.trainedToday}
              onChange={(e) => setFormData({ ...formData, trainedToday: e.target.checked })}
              className="w-5 h-5 rounded border-border text-primary focus:ring-2 focus:ring-primary"
            />
            <div>
              <p className="font-medium text-foreground">Treinei hoje</p>
              <p className="text-sm text-foreground-muted">Completei meu treino do dia</p>
            </div>
          </label>

          <label className="flex items-center gap-3 p-4 border border-border rounded-lg cursor-pointer hover:bg-surface/50 transition-colors">
            <input
              type="checkbox"
              checked={formData.followedDiet}
              onChange={(e) => setFormData({ ...formData, followedDiet: e.target.checked })}
              className="w-5 h-5 rounded border-border text-primary focus:ring-2 focus:ring-primary"
            />
            <div>
              <p className="font-medium text-foreground">Segui a dieta</p>
              <p className="text-sm text-foreground-muted">Cumpri meu plano alimentar</p>
            </div>
          </label>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Observações</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Notas do Treino
            </label>
            <textarea
              value={formData.workoutNotes}
              onChange={(e) => setFormData({ ...formData, workoutNotes: e.target.value })}
              placeholder="Como foi o treino? Alguma observação?"
              className="w-full px-4 py-3 rounded-lg bg-surface border border-border text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Notas da Dieta
            </label>
            <textarea
              value={formData.dietNotes}
              onChange={(e) => setFormData({ ...formData, dietNotes: e.target.value })}
              placeholder="Como foi a alimentação? Alguma mudança?"
              className="w-full px-4 py-3 rounded-lg bg-surface border border-border text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Métricas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="number"
            step="0.1"
            label="Peso (kg) - Opcional"
            placeholder="75.5"
            value={formData.weight}
            onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
          />

          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Nível de Energia (1-5)
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setFormData({ ...formData, energyLevel: level })}
                  className={`
                    flex-1 py-3 rounded-lg border transition-all
                    ${formData.energyLevel === level
                      ? 'border-primary bg-primary text-white'
                      : 'border-border bg-surface text-foreground-muted hover:border-primary/50'
                    }
                  `}
                >
                  {level}
                </button>
              ))}
            </div>
            <p className="text-xs text-foreground-muted mt-2 text-center">
              1 = Muito Baixa • 5 = Muito Alta
            </p>
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

      <div className="flex gap-3">
        <Button
          type="button"
          variant="ghost"
          className="flex-1"
          onClick={() => router.back()}
        >
          Cancelar
        </Button>
        <Button type="submit" className="flex-1" isLoading={isSubmitting}>
          {existingCheckin ? 'Atualizar Check-in' : 'Salvar Check-in'}
        </Button>
      </div>
    </form>
  );
}
