import express from "express";
import { criarRepositorio } from "./repositorio/trilhas.js";
import { criarRotasTrilhas } from "./rotas/trilhas.js";

export function criarApp({ db }) {
  const app = express();
  app.use(express.json());

  app.get("/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.use("/trilhas", criarRotasTrilhas(criarRepositorio(db)));

  return app;
}
