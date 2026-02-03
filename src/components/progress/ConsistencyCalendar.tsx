'use client';

interface Checkin {
  date: Date;
  trainedToday: boolean;
  followedDiet: boolean;
}

interface ConsistencyCalendarProps {
  checkins: Checkin[];
}

export function ConsistencyCalendar({ checkins }: ConsistencyCalendarProps) {
  // Últimos 90 dias
  const days = 90;
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - days);

  // Criar array de datas
  const dates: Date[] = [];
  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    dates.push(date);
  }

  // Mapear check-ins por data
  const checkinMap = new Map<string, Checkin>();
  checkins.forEach((checkin) => {
    const dateKey = new Date(checkin.date).toISOString().split('T')[0];
    checkinMap.set(dateKey, checkin);
  });

  // Agrupar por semanas
  const weeks: Date[][] = [];
  let currentWeek: Date[] = [];

  dates.forEach((date, idx) => {
    currentWeek.push(date);
    if (date.getDay() === 6 || idx === dates.length - 1) {
      weeks.push([...currentWeek]);
      currentWeek = [];
    }
  });

  const getColorClass = (date: Date) => {
    const dateKey = date.toISOString().split('T')[0];
    const checkin = checkinMap.get(dateKey);

    if (!checkin) {
      return 'bg-surface border-border';
    }

    const score = (checkin.trainedToday ? 1 : 0) + (checkin.followedDiet ? 1 : 0);

    if (score === 2) return 'bg-success border-success';
    if (score === 1) return 'bg-warning border-warning';
    return 'bg-error/50 border-error';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 text-xs text-foreground-muted">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-success border border-success" />
          <span>Completo (treino + dieta)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-warning border border-warning" />
          <span>Parcial</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-error/50 border border-error" />
          <span>Não cumprido</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-surface border border-border" />
          <span>Sem check-in</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="inline-grid grid-flow-col gap-1" style={{ gridAutoColumns: 'min-content' }}>
          {weeks.map((week, weekIdx) => (
            <div key={weekIdx} className="grid grid-rows-7 gap-1">
              {week.map((date, dayIdx) => {
                const isToday = date.toDateString() === today.toDateString();
                const isFuture = date > today;

                return (
                  <div
                    key={dayIdx}
                    className={`
                      w-3 h-3 rounded-sm border transition-all
                      ${isFuture ? 'bg-surface/30 border-border/30' : getColorClass(date)}
                      ${isToday ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}
                    `}
                    title={`${date.toLocaleDateString('pt-BR')}`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between text-xs text-foreground-muted">
        <span>{startDate.toLocaleDateString('pt-BR', { month: 'short' })}</span>
        <span>{today.toLocaleDateString('pt-BR', { month: 'short' })}</span>
      </div>
    </div>
  );
}
