'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';

interface ProtocolUploadProps {
  onUploadComplete: (data: any) => void;
}

export function ProtocolUpload({ onUploadComplete }: ProtocolUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/pdf') {
        setFile(file);
        setError('');
      } else {
        setError('Por favor, selecione um arquivo PDF');
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === 'application/pdf') {
        setFile(file);
        setError('');
      } else {
        setError('Por favor, selecione um arquivo PDF');
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/protocol/upload', {
        method: 'POST',
        body: formData,
      });

      // Pegar texto da resposta primeiro
      const text = await res.text();
      
      // Verificar se há resposta
      if (!text) {
        throw new Error('Servidor retornou resposta vazia. Tente novamente.');
      }

      // Tentar parsear JSON
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        console.error('Response text:', text);
        throw new Error('Resposta inválida do servidor: ' + text.slice(0, 100));
      }

      if (!res.ok) {
        throw new Error(data.error || 'Erro ao fazer upload');
      }

      onUploadComplete(data);
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.message || 'Erro ao processar PDF');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-8">
        <div
          className={`
            border-2 border-dashed rounded-lg p-12 text-center transition-all
            ${dragActive ? 'border-primary bg-primary/10' : 'border-border'}
            ${file ? 'border-success bg-success/10' : ''}
          `}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            onChange={handleChange}
            className="hidden"
          />

          {!file ? (
            <>
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/20 flex items-center justify-center">
                <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Arraste seu PDF aqui
              </h3>
              <p className="text-foreground-muted mb-4">
                ou clique para selecionar
              </p>
              <Button onClick={() => fileInputRef.current?.click()}>
                Selecionar PDF
              </Button>
            </>
          ) : (
            <>
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-success/20 flex items-center justify-center">
                <svg className="w-10 h-10 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {file.name}
              </h3>
              <p className="text-foreground-muted mb-4">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
              <div className="flex gap-3 justify-center">
                <Button variant="ghost" onClick={() => setFile(null)}>
                  Cancelar
                </Button>
                <Button onClick={handleUpload} isLoading={isUploading}>
                  {isUploading ? 'Analisando PDF...' : 'Enviar e Processar'}
                </Button>
              </div>
            </>
          )}
        </div>

        {error && (
          <div className="mt-4 p-4 bg-error/10 border border-error rounded-lg">
            <p className="text-error text-sm">{error}</p>
          </div>
        )}

        {isUploading && (
          <div className="mt-4 text-center">
            <p className="text-foreground-muted text-sm">
              Isso pode levar alguns segundos...
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
