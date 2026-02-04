'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProtocolUpload } from '@/components/protocol/ProtocolUpload';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function UploadPage() {
  const router = useRouter();
  const [uploadedData, setUploadedData] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleUploadComplete = (data: any) => {
    setUploadedData(data);
  };

  const handleConfirm = async () => {
    setIsSaving(true);
    // Dados já foram salvos na API de upload
    router.push('/app/protocol');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Upload de Protocolo
        </h1>
        <p className="text-foreground-muted">
          Faça upload do PDF do seu treino e dieta
        </p>
      </div>

      {!uploadedData ? (
        <ProtocolUpload onUploadComplete={handleUploadComplete} />
      ) : (
        <div className="space-y-6">
          <Card variant="glass">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <CardTitle>Protocolo Processado com Sucesso!</CardTitle>
                  <p className="text-foreground-muted text-sm mt-1">
                    Revise os dados extraídos abaixo
                  </p>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Treinos Extraídos</CardTitle>
            </CardHeader>
            <CardContent>
              {uploadedData.protocol.workouts.length === 0 ? (
                <p className="text-foreground-muted">Nenhum treino encontrado</p>
              ) : (
                <div className="space-y-4">
                  {uploadedData.protocol.workouts.map((workout: any) => (
                    <div key={workout.id} className="border border-border rounded-lg p-4">
                      <h4 className="font-semibold text-foreground mb-2">{workout.name}</h4>
                      <p className="text-sm text-foreground-muted mb-3">
                        {workout.exercises.length} exercícios
                      </p>
                      <div className="space-y-2">
                        {workout.exercises.map((ex: any) => (
                          <div key={ex.id} className="text-sm">
                            <span className="text-foreground">{ex.name}</span>
                            {ex.sets && ex.reps && (
                              <span className="text-foreground-muted ml-2">
                                • {ex.sets}x{ex.reps}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Refeições Extraídas</CardTitle>
            </CardHeader>
            <CardContent>
              {uploadedData.protocol.meals.length === 0 ? (
                <p className="text-foreground-muted">Nenhuma refeição encontrada</p>
              ) : (
                <div className="space-y-4">
                  {uploadedData.protocol.meals.map((meal: any) => (
                    <div key={meal.id} className="border border-border rounded-lg p-4">
                      <h4 className="font-semibold text-foreground mb-2">
                        {meal.name}
                        {meal.time && (
                          <span className="text-foreground-muted text-sm ml-2">
                            ({meal.time})
                          </span>
                        )}
                      </h4>
                      <div className="space-y-1">
                        {meal.foods.map((food: any) => (
                          <div key={food.id} className="text-sm">
                            <span className="text-foreground">{food.name}</span>
                            {food.quantity && (
                              <span className="text-foreground-muted ml-2">
                                • {food.quantity}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {uploadedData.protocol.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Observações</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground-muted">{uploadedData.protocol.notes}</p>
              </CardContent>
            </Card>
          )}

          <div className="flex gap-3">
            <Link href="/app/protocol/upload" className="flex-1">
              <Button variant="ghost" className="w-full">
                Fazer Novo Upload
              </Button>
            </Link>
            <Button onClick={handleConfirm} isLoading={isSaving} className="flex-1">
              Confirmar e Ver Protocolo
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
