import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

interface Food {
  id: string;
  name: string;
  quantity: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
}

interface Meal {
  id: string;
  name: string;
  time?: string;
  foods: Food[];
}

interface MealCardProps {
  meal: Meal;
}

export function MealCard({ meal }: MealCardProps) {
  const totalNutrients = meal.foods.reduce(
    (acc, food) => ({
      calories: acc.calories + (food.calories || 0),
      protein: acc.protein + (food.protein || 0),
      carbs: acc.carbs + (food.carbs || 0),
      fat: acc.fat + (food.fat || 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const hasNutrients = totalNutrients.calories > 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{meal.name}</CardTitle>
          {meal.time && (
            <span className="text-sm text-foreground-muted bg-surface px-3 py-1 rounded-full border border-border">
              {meal.time}
            </span>
          )}
        </div>
        {hasNutrients && (
          <div className="flex gap-4 mt-3 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-foreground-muted">Cal:</span>
              <span className="font-medium text-foreground">{totalNutrients.calories}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-foreground-muted">Prot:</span>
              <span className="font-medium text-foreground">{totalNutrients.protein}g</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-foreground-muted">Carb:</span>
              <span className="font-medium text-foreground">{totalNutrients.carbs}g</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-foreground-muted">Gord:</span>
              <span className="font-medium text-foreground">{totalNutrients.fat}g</span>
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {meal.foods.map((food) => (
            <div
              key={food.id}
              className="flex items-start justify-between py-2 border-b border-border last:border-0"
            >
              <div className="flex-1">
                <p className="text-foreground font-medium">{food.name}</p>
                <p className="text-sm text-foreground-muted">{food.quantity}</p>
              </div>
              {(food.calories || food.protein) && (
                <div className="flex gap-3 text-sm text-foreground-muted">
                  {food.calories && <span>{food.calories} cal</span>}
                  {food.protein && <span>{food.protein}g prot</span>}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
