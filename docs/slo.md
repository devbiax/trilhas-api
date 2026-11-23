# SLO

## Latência da API

- **SLI:** tempo de resposta das requisições, medido pelo histograma `http_request_duration_seconds`, exposto em `GET /metrics`.
- **SLO:** 95% das requisições respondem em menos de 300 ms, em uma janela de 30 dias.
- **Consulta PromQL:**

```promql
histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[30d])) by (le)) < 0.3
```

## Como medir

O `docker-compose.yml` não inclui o Prometheus. Para acompanhar o SLO de forma contínua, aponte um Prometheus externo para `/metrics`. A verificação pontual é feita com o teste de carga k6, que registra o p95 em [`desempenho.md`](desempenho.md).

O rótulo `route` traz o padrão da rota (`/trilhas/:id`), e não a URL completa, para manter a quantidade de séries baixa.
