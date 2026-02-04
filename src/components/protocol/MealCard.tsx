'use client';

import { useState } from 'react';
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
  const [isExpanded, setIsExpanded] = useState(true);
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
    <Card className="border-l-4 border-secondary/30 bg-secondary/5">
      <CardHeader>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full text-left flex items-center justify-between group"
        >
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <CardTitle className="text-secondary">{meal.name}</CardTitle>
              {meal.time && (
                <span className="text-sm text-foreground-muted bg-surface px-3 py-1 rounded-full border border-border">
                  {meal.time}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <p className="text-xs text-foreground-muted">
                {meal.foods.length} alimentos
              </p>
              {hasNutrients && (
                <>
                  <span className="text-foreground-muted">•</span>
                  <div className="flex gap-3 text-xs text-foreground-muted">
                    <span>{totalNutrients.calories} cal</span>
                    <span>{totalNutrients.protein}g prot</span>
                  </div>
                </>
              )}
            </div>
          </div>
          <svg
            className="w-5 h-5 text-secondary transition-transform ml-4"
            style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {isExpanded && hasNutrients && (
          <div className="flex gap-4 mt-3 pt-3 border-t border-border text-sm">
            <div className="flex items-center gap-2">
              <span className="text-foreground-muted">Calorias:</span>
              <span className="font-medium text-foreground">{totalNutrients.calories}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-foreground-muted">Proteína:</span>
              <span className="font-medium text-foreground">{totalNutrients.protein}g</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-foreground-muted">Carb:</span>
              <span className="font-medium text-foreground">{totalNutrients.carbs}g</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-foreground-muted">Gordura:</span>
              <span className="font-medium text-foreground">{totalNutrients.fat}g</span>
            </div>
          </div>
        )}
      </CardHeader>
      {isExpanded && (
        <CardContent>
          <div className="space-y-2">
            {meal.foods.map((food) => (
              <div
                key={food.id}
                className="flex items-start justify-between py-2 border-b border-border last:border-0 hover:bg-surface/30 transition-colors rounded px-2"
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
      )}
    </Card>
  );
}
