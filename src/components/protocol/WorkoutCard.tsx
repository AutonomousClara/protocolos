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
  color?: string;
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
          <div className="overflow-x-auto">
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
        </CardContent>
      )}
    </Card>
  );
}
