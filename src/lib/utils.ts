/**
 * Formata peso em kg com 1 casa decimal
 * @param weight Peso em kg (pode ser string ou número)
 * @returns String formatada "XX.X kg"
 */
export function formatWeight(weight: string | number): string {
  const numWeight = typeof weight === 'string' ? parseFloat(weight) : weight;
  
  if (isNaN(numWeight)) {
    return '0.0 kg';
  }
  
  return `${numWeight.toFixed(1)} kg`;
}

/**
 * Calcula percentual de progresso
 * @param current Valor atual
 * @param total Valor total
 * @returns Percentual de 0 a 100
 */
export function calculateProgress(current: number, total: number): number {
  if (total === 0) return 0;
  
  const progress = (current / total) * 100;
  return Math.min(Math.max(progress, 0), 100);
}

/**
 * Formata data no formato brasileiro (DD/MM/YYYY)
 * @param date Data ISO string ou Date object
 * @returns Data formatada
 */
export function formatDateBR(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const year = dateObj.getFullYear();
  
  return `${day}/${month}/${year}`;
}
