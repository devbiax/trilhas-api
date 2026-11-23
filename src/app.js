import express from "express";
import pinoHttp from "pino-http";
import { logger } from "./infra/logger.js";
import { duracaoRequisicoes, registro } from "./infra/metricas.js";
import { criarRepositorio } from "./repositorio/trilhas.js";
import { criarRotasTrilhas } from "./rotas/trilhas.js";

export function criarApp({ db }) {
  const app = express();
  app.use(pinoHttp({ logger }));

  app.use((req, res, next) => {
    const fim = duracaoRequisicoes.startTimer();
    res.on("finish", () => {
      const rota = req.route
        ? `${req.baseUrl}${req.route.path}`
        : "desconhecida";
      fim({ method: req.method, route: rota, status: res.statusCode });
    });
    next();
  });

  app.use(express.json());

  app.get("/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/metrics", async (req, res) => {
    res.set("Content-Type", registro.contentType);
    res.send(await registro.metrics());
  });

  app.use("/trilhas", criarRotasTrilhas(criarRepositorio(db)));

  return app;
}
