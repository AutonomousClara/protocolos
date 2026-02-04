'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

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
}

const workoutColors = [
  { bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-400' },
  { bg: 'bg-pink-500/10', border: 'border-pink-500/30', text: 'text-pink-400' },
  { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400' },
  { bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-400' },
  { bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-400' },
  { bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', text: 'text-cyan-400' },
];

export function WorkoutCard({ workout, color }: WorkoutCardProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  // Use a hash of workout.id to consistently pick the same color
  const colorIndex = workout.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % workoutColors.length;
  const colorScheme = workoutColors[colorIndex];

  return (
    <Card className={`${colorScheme.bg} border ${colorScheme.border}`}>
      <CardHeader>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full text-left flex items-center justify-between group"
        >
          <div className="flex-1">
            <CardTitle className={colorScheme.text}>{workout.name}</CardTitle>
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
            className={`w-5 h-5 ${colorScheme.text} transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
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
  );
}
