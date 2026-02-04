'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  rest: string;
  notes?: string;
  weight?: string;
}

interface Workout {
  id: string;
  name: string;
  dayOfWeek?: string[];
  exercises: Exercise[];
}

interface WorkoutCardProps {
  workout: Workout;
  protocolId?: string;
  onUpdate?: () => void;
}

const workoutColors = [
  { bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-400' },
  { bg: 'bg-pink-500/10', border: 'border-pink-500/30', text: 'text-pink-400' },
  { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400' },
  { bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-400' },
  { bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-400' },
  { bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', text: 'text-cyan-400' },
];

export function WorkoutCard({ workout, color, protocolId, onUpdate }: WorkoutCardProps) {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Use a hash of workout.id to consistently pick the same color
  const colorIndex = workout.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % workoutColors.length;
  const colorScheme = workoutColors[colorIndex];

  const handleDelete = async () => {
    if (!protocolId) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/protocol/workout/${workout.id}?protocolId=${protocolId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Erro ao deletar treino');
      }

      setIsDeleteModalOpen(false);
      router.refresh();
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error deleting workout:', error);
      alert('Erro ao deletar treino');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Card className={`${colorScheme.bg} border ${colorScheme.border}`}>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex-1 text-left flex items-center justify-between group min-w-0"
            >
              <div className="flex-1 min-w-0">
                <CardTitle className={`${colorScheme.text} break-words`}>{workout.name}</CardTitle>
            {workout.dayOfWeek && workout.dayOfWeek.length > 0 && (
              <p className="text-sm text-foreground-muted mt-1">
                {workout.dayOfWeek.map(day => {
                  const days: Record<string, string> = {
                    monday: 'Segunda',
                    tuesday: 'Terça',
                    wednesday: 'Quarta',
                    thursday: 'Quinta',
                    friday: 'Sexta',
                    saturday: 'Sábado',
                    sunday: 'Domingo',
                  };
                  return days[day.toLowerCase()] || day;
                }).join(', ')}
              </p>
            )}
            <p className="text-xs text-foreground-muted mt-1">
              {workout.exercises.length} exercícios
            </p>
          </div>
          <svg
            className={`w-5 h-5 ${colorScheme.text} transition-transform ${isExpanded ? 'rotate-180' : ''} flex-shrink-0`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {protocolId && (
          <div className="flex gap-2 flex-shrink-0">
            <Button
              variant="danger"
              size="sm"
              onClick={() => setIsDeleteModalOpen(true)}
              className="h-9 w-9 p-0 flex items-center justify-center"
              aria-label="Deletar treino"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </Button>
          </div>
        )}
      </div>
      </CardHeader>

      {isExpanded && (
        <CardContent>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-2 text-sm font-medium text-foreground-muted">#</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-foreground-muted">Exercício</th>
                  <th className="text-center py-3 px-2 text-sm font-medium text-foreground-muted">Séries</th>
                  <th className="text-center py-3 px-2 text-sm font-medium text-foreground-muted">Reps</th>
                  <th className="text-center py-3 px-2 text-sm font-medium text-foreground-muted">Descanso</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-foreground-muted">Notas</th>
                </tr>
              </thead>
              <tbody>
                {workout.exercises.map((exercise, idx) => (
                  <tr
                    key={exercise.id}
                    className="border-b border-border/50 last:border-0 hover:bg-surface/30 transition-colors"
                  >
                    <td className="py-3 px-2">
                      <div className={`w-6 h-6 rounded-full ${colorScheme.bg} ${colorScheme.border} border flex items-center justify-center`}>
                        <span className={`${colorScheme.text} font-semibold text-xs`}>{idx + 1}</span>
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <div>
                        <p className="font-medium text-foreground">{exercise.name}</p>
                        {exercise.weight && (
                          <p className="text-xs text-foreground-muted mt-0.5">Carga: {exercise.weight}</p>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-2 text-center">
                      <span className="font-medium text-foreground">{exercise.sets}</span>
                    </td>
                    <td className="py-3 px-2 text-center">
                      <span className="font-medium text-foreground">{exercise.reps}</span>
                    </td>
                    <td className="py-3 px-2 text-center">
                      <span className="font-medium text-foreground">{exercise.rest}</span>
                    </td>
                    <td className="py-3 px-2">
                      {exercise.notes && (
                        <span className="text-sm text-foreground-muted">{exercise.notes}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-3">
            {workout.exercises.map((exercise, idx) => (
              <div
                key={exercise.id}
                className="border border-border/50 rounded-lg p-3 bg-surface/30"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full ${colorScheme.bg} ${colorScheme.border} border flex items-center justify-center flex-shrink-0`}>
                    <span className={`${colorScheme.text} font-semibold text-sm`}>{idx + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground">{exercise.name}</p>
                    {exercise.weight && (
                      <p className="text-xs text-foreground-muted mt-0.5">Carga: {exercise.weight}</p>
                    )}
                    <div className="flex gap-3 mt-2 text-sm">
                      <span className="text-foreground">
                        <span className="text-foreground-muted text-xs">Séries:</span> {exercise.sets}
                      </span>
                      <span className="text-foreground">
                        <span className="text-foreground-muted text-xs">Reps:</span> {exercise.reps}
                      </span>
                      <span className="text-foreground">
                        <span className="text-foreground-muted text-xs">Rest:</span> {exercise.rest}
                      </span>
                    </div>
                    {exercise.notes && (
                      <p className="text-sm text-foreground-muted mt-2 border-t border-border/50 pt-2">
                        {exercise.notes}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      )}
    </Card>

    {/* Delete Modal */}
    <Modal
      isOpen={isDeleteModalOpen}
      onClose={() => setIsDeleteModalOpen(false)}
      title="Confirmar Exclusão"
      size="sm"
    >
      <div className="space-y-4">
        <p className="text-foreground">
          Tem certeza que deseja deletar o treino <strong>{workout.name}</strong>?
        </p>
        <p className="text-sm text-foreground-muted">
          Esta ação não pode ser desfeita.
        </p>
        <div className="flex gap-3 pt-4">
          <Button
            variant="ghost"
            className="flex-1"
            onClick={() => setIsDeleteModalOpen(false)}
            disabled={isDeleting}
          >
            Cancelar
          </Button>
          <Button
            variant="danger"
            className="flex-1"
            onClick={handleDelete}
            isLoading={isDeleting}
          >
            Deletar
          </Button>
        </div>
      </div>
    </Modal>
  </>
  );
}
