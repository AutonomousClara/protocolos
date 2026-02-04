'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';

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
  protocolId?: string;
  onUpdate?: () => void;
}

export function MealCard({ meal, protocolId, onUpdate }: MealCardProps) {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
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

  const handleDelete = async () => {
    if (!protocolId) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/protocol/diet/${meal.id}?protocolId=${protocolId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Erro ao deletar refeição');
      }

      setIsDeleteModalOpen(false);
      router.refresh();
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error deleting meal:', error);
      alert('Erro ao deletar refeição');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Card className="border-l-4 border-secondary/30 bg-secondary/5">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex-1 text-left flex items-center justify-between group min-w-0"
            >
              <div className="flex-1 min-w-0">
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
            className="w-5 h-5 text-secondary transition-transform flex-shrink-0"
            style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
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
              aria-label="Deletar refeição"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </Button>
          </div>
        )}
      </div>
        {isExpanded && hasNutrients && (
          <div className="grid grid-cols-2 sm:flex sm:gap-4 gap-3 mt-3 pt-3 border-t border-border text-sm">
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

    {/* Delete Modal */}
    <Modal
      isOpen={isDeleteModalOpen}
      onClose={() => setIsDeleteModalOpen(false)}
      title="Confirmar Exclusão"
      size="sm"
    >
      <div className="space-y-4">
        <p className="text-foreground">
          Tem certeza que deseja deletar a refeição <strong>{meal.name}</strong>?
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
