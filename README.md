# ProtocolOS

App de acompanhamento de treino e dieta com extração automática de PDF usando IA.

## Funcionalidades

- **Upload Inteligente**: Faça upload do PDF do seu treino/dieta e deixe a IA extrair automaticamente
- **Check-in Diário**: Registre suas atividades, peso e energia
- **Acompanhamento**: Visualize progresso com calendário de consistência e gráficos
- **Gestão de Perfil**: Configure sua API key do Groq e personalize seu perfil

## Stack Tecnológica

- **Frontend**: Next.js 14 (App Router), React, Tailwind CSS
- **Backend**: Next.js API Routes, NextAuth v5
- **Database**: SQLite (dev) / Supabase Postgres (prod)
- **ORM**: Prisma 6
- **IA**: Groq API (llama-3.3-70b-versatile)
- **PDF**: pdf-parse

## Instalação

```bash
# Instale as dependências
npm install

# Configure as variáveis de ambiente (já está configurado)
# .env já contém DATABASE_URL="file:./dev.db"

# Execute as migrations
npx prisma migrate dev

# Inicie o servidor de desenvolvimento
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## Variáveis de Ambiente

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="seu-secret-aqui"
```

## Uso

1. **Primeiro Acesso**
   - Acesse `/login`
   - Entre com seu email
   - Clique no magic link enviado (por enquanto, veja o console)

2. **Upload de Protocolo**
   - Vá em "Protocolo" → "Fazer Upload"
   - Arraste ou selecione seu PDF de treino/dieta
   - Configure sua API key do Groq em Settings (necessária para parsing automático)
   - Revise os dados extraídos
   - Confirme para salvar

3. **Check-in Diário**
   - Acesse "Check-in" no menu
   - Marque se treinou e seguiu a dieta
   - Adicione observações, peso e nível de energia
   - Salve para manter seu streak

4. **Acompanhe Progresso**
   - Veja seu calendário de consistência
   - Acompanhe evolução de peso
   - Visualize estatísticas gerais

## Scripts

```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build para produção
npm run start        # Inicia servidor de produção
npm run lint         # Lint do código
npx prisma studio    # Abrir Prisma Studio (GUI do banco)
```

## Próximos Passos

- [ ] Implementar envio real de emails (magic link)
- [ ] Adicionar testes (unit, integration, e2e)
- [ ] Implementar PWA para uso offline
- [ ] Migrar para Supabase em produção
- [ ] Adicionar suporte a fotos de progresso
- [ ] Melhorar extração de PDF com regex patterns

## Licença

MIT

## Autor

Clara - 2026-02-03
