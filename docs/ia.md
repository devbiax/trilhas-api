# Uso de IA neste projeto

Usei o Claude como apoio ao longo de todo o projeto. No início, elaboramos juntos um cronograma de etapas como ponto de partida do trabalho, que acompanhei no Habitica. A IA sugeriu alternativas e explicou os passos; os arquivos foram escritos por mim e as decisões foram minhas.

## Prompts que importaram

1. Colei os slides do enunciado e pedi ajuda para entender o que o Projeto B exigia.
2. Pedi para comparar o Projeto A e o B e escolhi o B (menor escopo, entregável).
3. Pedi sugestões de tema e escolhi "API de Trilhas de Estudo".
4. Pedi um cronograma de etapas do projeto, que usei como roteiro.
5. Pedi para explicar a divisão em camadas (dominio, infra, repositorio, rotas) e o padrão Repository.
6. Pedi ajuda para configurar testes, cobertura, ESLint e o CI no GitHub Actions.
7. Pedi ajuda com Dockerfile e docker-compose e testei subindo na minha máquina.
8. Pedi ajuda com logs estruturados, métrica e SLO, e com o teste de carga em k6.
9. Pedi uma conferência final contra os slides do curso.

## Decisões que foram minhas

- Escolher o Projeto B e uma versão enxuta, por causa do prazo.
- Manter SQLite (simples, sem servidor extra).
- Renomear a rota de /saude para /health.
- Manter os nomes das pastas em português.
- Não incluir CONTRIBUTORS.md, por ser projeto individual.

## Como validei

Rodei testes, lint, Docker Compose e o k6 na minha máquina e conferi o CI no GitHub.
