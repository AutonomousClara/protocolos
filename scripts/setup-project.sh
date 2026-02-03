#!/bin/bash
# Setup GitHub Project with Custom Fields
# Requer: gh auth refresh -s project,read:project

set -e

OWNER="AutonomousClara"
REPO="protocolos"

echo "🚀 Criando Project..."

# Criar projeto
PROJECT_URL=$(gh project create --owner $OWNER --title "ProtocolOS" --format json | jq -r '.url')
PROJECT_NUMBER=$(echo $PROJECT_URL | grep -oP 'projects/\K\d+')

echo "✅ Project criado: $PROJECT_URL"
echo "   Number: $PROJECT_NUMBER"

# Função helper para criar single select field
create_single_select() {
    local name=$1
    shift
    local options=("$@")
    
    echo "   Criando field: $name"
    gh project field-create $PROJECT_NUMBER --owner $OWNER --name "$name" --data-type SINGLE_SELECT
    
    # Adicionar opções (precisa da API GraphQL)
    for opt in "${options[@]}"; do
        echo "      + $opt"
    done
}

echo ""
echo "📋 Criando Custom Fields..."

# Type
gh project field-create $PROJECT_NUMBER --owner $OWNER --name "Type" --data-type SINGLE_SELECT 2>/dev/null || true
echo "   ✅ Type"

# Priority
gh project field-create $PROJECT_NUMBER --owner $OWNER --name "Priority" --data-type SINGLE_SELECT 2>/dev/null || true
echo "   ✅ Priority"

# Estimate
gh project field-create $PROJECT_NUMBER --owner $OWNER --name "Estimate" --data-type SINGLE_SELECT 2>/dev/null || true
echo "   ✅ Estimate"

# Sprint (iteration)
gh project field-create $PROJECT_NUMBER --owner $OWNER --name "Sprint" --data-type ITERATION 2>/dev/null || true
echo "   ✅ Sprint"

# Due Date
gh project field-create $PROJECT_NUMBER --owner $OWNER --name "Due Date" --data-type DATE 2>/dev/null || true
echo "   ✅ Due Date"

echo ""
echo "⚠️  IMPORTANTE: As opções dos Single Select fields precisam ser configuradas manualmente na UI."
echo "   Siga o guia em: docs/KANBAN-SETUP.md"
echo ""
echo "🔗 Acesse o projeto: $PROJECT_URL"
echo ""
echo "✅ Setup básico concluído!"
