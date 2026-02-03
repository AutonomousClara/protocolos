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

export function WorkoutCard({ workout }: WorkoutCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{workout.name}</CardTitle>
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
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {workout.exercises.map((exercise, idx) => (
            <div
              key={exercise.id}
              className="border border-border rounded-lg p-4 hover:bg-surface/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-semibold text-sm">{idx + 1}</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">{exercise.name}</h4>
                    {exercise.notes && (
                      <p className="text-sm text-foreground-muted mt-1">{exercise.notes}</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="ml-11 flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-foreground-muted">Séries:</span>
                  <span className="font-medium text-foreground">{exercise.sets}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-foreground-muted">Reps:</span>
                  <span className="font-medium text-foreground">{exercise.reps}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-foreground-muted">Descanso:</span>
                  <span className="font-medium text-foreground">{exercise.rest}</span>
                </div>
                {exercise.weight && (
                  <div className="flex items-center gap-2">
                    <span className="text-foreground-muted">Carga:</span>
                    <span className="font-medium text-foreground">{exercise.weight}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
