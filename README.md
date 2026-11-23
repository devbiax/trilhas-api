# API de Trilhas de Estudo

![CI](https://github.com/devbiax/trilhas-api/actions/workflows/ci.yml/badge.svg)

**Nível: B (simples).** API REST de domínio único, com um fluxo principal funcionando de ponta a ponta: criar uma trilha de estudo, adicionar recursos (artigos, vídeos e cursos), concluí-los e acompanhar o progresso em porcentagem.

## Stack

| Ferramenta              | Uso                                                  |
| ----------------------- | ---------------------------------------------------- |
| Node.js 22 e Express    | Servidor HTTP                                        |
| SQLite (better-sqlite3) | Banco de dados                                       |
| Docker Compose          | Sobe a API com 1 comando                             |
| Vitest e Supertest      | Testes unitários e de integração, com cobertura      |
| ESLint                  | Lint                                                 |
| GitHub Actions          | CI: instala, faz lint e roda os testes com cobertura |
| pino e prom-client      | Logs estruturados e métrica                          |
| k6                      | Teste de carga (smoke test)                          |

## Como subir

Com Docker (só precisa do Docker Desktop):

```sh
docker compose up --build
```

A API fica em http://localhost:3000. Para conferir: http://localhost:3000/health. Para parar: `docker compose down` (os dados ficam no volume `dados`; `docker compose down -v` apaga tudo).

Sem Docker (Node.js 22 ou superior):

```sh
npm install
npm start
```

Opcional: copie `.env.example` para `.env` para mudar a porta (`PORT`) e o arquivo do banco (`DB_PATH`). O `.env` não vai para o repositório.

## Como testar

```sh
npm test                # testes unitários e de integração
npm run test:coverage   # testes com cobertura
npm run lint            # ESLint
k6 run testes/k6/smoke.js   # teste de carga (com a API no ar)
```

A cobertura mínima declarada é de **80%** (linhas, funções e instruções) e **70%** (ramos), configurada em `vitest.config.js` e verificada no CI.

## Regras de negócio

- Progresso da trilha = recursos concluídos ÷ total de recursos, em porcentagem arredondada. Trilha sem recursos tem 0%.
- Um recurso não pode ser concluído duas vezes (responde `409`).
- O `link` do recurso precisa ser uma URL `http` ou `https` válida.
- Níveis aceitos: `iniciante`, `intermediario`, `avancado`. Tipos de recurso: `artigo`, `video`, `curso`.

## Endpoints

| Rota                                               | Descrição                                             |
| -------------------------------------------------- | ----------------------------------------------------- |
| `GET /health`                                      | Verifica se a API está no ar                          |
| `GET /metrics`                                     | Métrica no formato Prometheus                         |
| `POST /trilhas`                                    | Cria uma trilha                                       |
| `GET /trilhas`                                     | Lista as trilhas com o progresso                      |
| `GET /trilhas/{id}`                                | Consulta uma trilha com os recursos                   |
| `POST /trilhas/{id}/recursos`                      | Adiciona um recurso à trilha                          |
| `POST /trilhas/{id}/recursos/{recursoId}/concluir` | Conclui um recurso e devolve a trilha com o progresso |

Contrato completo: [`docs/openapi.yaml`](docs/openapi.yaml) (dá para visualizar colando o arquivo em https://editor.swagger.io).

## Observabilidade

- **Logs:** JSON no terminal, uma linha por requisição (pino). O nível vem da variável `LOG_LEVEL`, com padrão `info`.
- **Métrica:** `GET /metrics` expõe o histograma `http_request_duration_seconds`, por método, rota e status.
- **SLO:** 95% das requisições em menos de 300 ms, em 30 dias. Detalhes em [`docs/slo.md`](docs/slo.md).
- **Desempenho medido:** [`docs/desempenho.md`](docs/desempenho.md).

## Documentação

- [`docs/openapi.yaml`](docs/openapi.yaml): contrato da API
- [`docs/adr/0001-decisao.md`](docs/adr/0001-decisao.md): decisão de arquitetura
- [`docs/slo.md`](docs/slo.md): SLO
- [`docs/desempenho.md`](docs/desempenho.md): relatório do teste de carga

## Estrutura

```
src/
  dominio/       regras de negócio (progresso e validações)
  repositorio/   acesso ao banco (SQL)
  rotas/         endpoints HTTP
  infra/         banco, logger e métricas
  app.js         monta a aplicação
  server.js      liga o servidor na porta
testes/          testes unitários, de integração e do k6
docs/            OpenAPI, ADR, SLO e desempenho
.github/workflows/ci.yml
```
