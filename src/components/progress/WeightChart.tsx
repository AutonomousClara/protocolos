'use client';

interface WeightChartProps {
  data: Array<{ date: Date; weight: number }>;
}

export function WeightChart({ data }: WeightChartProps) {
  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-foreground-muted">
        <p>Nenhum registro de peso ainda</p>
      </div>
    );
  }

  const weights = data.map((d) => d.weight);
  const minWeight = Math.min(...weights);
  const maxWeight = Math.max(...weights);
  const range = maxWeight - minWeight || 1;
  const padding = range * 0.1;

  const chartMin = minWeight - padding;
  const chartMax = maxWeight + padding;
  const chartRange = chartMax - chartMin;

  const getY = (weight: number) => {
    const percentage = (weight - chartMin) / chartRange;
    return 100 - percentage * 100;
  };

  const points = data
    .map((d, idx) => {
      const x = (idx / (data.length - 1)) * 100;
      const y = getY(d.weight);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="space-y-4">
      <div className="relative h-64">
        <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((y) => (
            <line
              key={y}
              x1="0"
              y1={y}
              x2="100"
              y2={y}
              stroke="currentColor"
              strokeWidth="0.2"
              className="text-border"
            />
          ))}

          {/* Area under curve */}
          <polygon
            points={`0,100 ${points} 100,100`}
            fill="url(#gradient)"
            opacity="0.3"
          />

          {/* Line */}
          <polyline
            points={points}
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Points */}
          {data.map((d, idx) => {
            const x = (idx / (data.length - 1)) * 100;
            const y = getY(d.weight);
            return (
              <circle
                key={idx}
                cx={x}
                cy={y}
                r="2"
                fill="white"
                stroke="url(#lineGradient)"
                strokeWidth="2"
              />
            );
          })}

          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
          </defs>
        </svg>

        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-foreground-muted -ml-12">
          <span>{chartMax.toFixed(1)}kg</span>
          <span>{((chartMax + chartMin) / 2).toFixed(1)}kg</span>
          <span>{chartMin.toFixed(1)}kg</span>
        </div>
      </div>

      {/* X-axis labels */}
      <div className="flex justify-between text-xs text-foreground-muted">
        <span>{new Date(data[0].date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}</span>
        {data.length > 2 && (
          <span>
            {new Date(data[Math.floor(data.length / 2)].date).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: 'short',
            })}
          </span>
        )}
        <span>
          {new Date(data[data.length - 1].date).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short',
          })}
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
        <div className="text-center">
          <p className="text-sm text-foreground-muted">Peso Atual</p>
          <p className="text-xl font-bold text-foreground">{data[data.length - 1].weight.toFixed(1)}kg</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-foreground-muted">Variação</p>
          <p
            className={`text-xl font-bold ${
              data[data.length - 1].weight < data[0].weight ? 'text-success' : 'text-error'
            }`}
          >
            {(data[data.length - 1].weight - data[0].weight).toFixed(1)}kg
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-foreground-muted">Registros</p>
          <p className="text-xl font-bold text-foreground">{data.length}</p>
        </div>
      </div>
    </div>
  );
}
