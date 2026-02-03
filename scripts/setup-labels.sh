#!/bin/bash
# Setup GitHub Labels for Kanban

cd "$(dirname "$0")/.."

# Type labels
gh label create "type:epic" --color "7B68EE" --description "Epic - grande iniciativa" --force
gh label create "type:story" --color "0075CA" --description "Story - entrega valor ao usuário" --force
gh label create "type:task" --color "28A745" --description "Task - tarefa técnica" --force
gh label create "type:bug" --color "D73A4A" --description "Bug - defeito" --force

# Priority labels
gh label create "priority:p0" --color "B60205" --description "P0 - Critical (drop everything)" --force
gh label create "priority:p1" --color "D93F0B" --description "P1 - High (próximo a fazer)" --force
gh label create "priority:p2" --color "FBCA04" --description "P2 - Medium (backlog priorizado)" --force
gh label create "priority:p3" --color "0E8A16" --description "P3 - Low (nice to have)" --force

# Status labels
gh label create "status:blocked" --color "000000" --description "Bloqueado por dependência" --force
gh label create "status:needs-info" --color "BFDADC" --description "Aguardando informação" --force

# Area labels
gh label create "area:auth" --color "C2E0C6" --description "Autenticação e usuários" --force
gh label create "area:api" --color "D4C5F9" --description "Backend e API" --force
gh label create "area:ui" --color "BFD4F2" --description "Interface e UX" --force
gh label create "area:db" --color "FEF2C0" --description "Database e dados" --force
gh label create "area:infra" --color "E6E6E6" --description "Infraestrutura e CI/CD" --force

echo "✅ Labels criadas com sucesso!"
