# Desempenho

Relatório do smoke test de carga com o [k6](https://k6.io), executado em 23/11/2026.

## Ambiente

- Windows 11 Home, Intel Core i7-9750H, 16 GB de RAM
- API rodando em container com `docker compose up`, com o WSL 2 limitado a 4 GB de memória e 4 processadores
- k6 executado na mesma máquina, contra `http://localhost:3000`

## Cenário

Script: [`testes/k6/smoke.js`](../testes/k6/smoke.js)

- 10 usuários virtuais durante 30 segundos
- Antes do teste, uma trilha é criada (`POST /trilhas`)
- Em cada iteração: `GET /health` e `GET /trilhas/{id}`, seguidos de 1 segundo de pausa

## Resultados

| Métrica                            | Valor                   |
| ---------------------------------- | ----------------------- |
| **p95 da duração das requisições** | **6,37 ms**             |
| p90                                | 4,65 ms                 |
| Média                              | 3,5 ms                  |
| Mediana                            | 2,64 ms                 |
| Máximo                             | 104,36 ms               |
| Requisições totais                 | 601 (~19,8 por segundo) |
| Requisições com falha              | 0,00%                   |
| Checks aprovados                   | 600 de 600 (100%)       |

## Conclusão

O SLO de latência definido em [`slo.md`](slo.md) (p95 abaixo de 300 ms) foi atendido com folga: o p95 medido foi de 6,37 ms. Os thresholds do script (p95 abaixo de 300 ms e menos de 1% de falhas) também passaram.

## Limitações

- É um smoke test, uma carga leve para confirmar que a API responde bem, e não um teste de capacidade. A taxa de requisições é limitada pela pausa de 1 segundo entre iterações.
- O k6 e a API rodaram na mesma máquina, então parte dos recursos foi disputada entre os dois.
- O banco é o SQLite, com poucos dados. Os números podem mudar com mais volume.

## Como reproduzir

```sh
docker compose up -d --build
k6 run testes/k6/smoke.js
docker compose down
```
