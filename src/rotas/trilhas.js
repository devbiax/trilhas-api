import { Router } from "express";
import {
  calcularProgresso,
  validarRecurso,
  validarTrilha,
} from "../dominio/trilha.js";

export function criarRotasTrilhas(repositorio) {
  const rotas = Router();

  function trilhaComProgresso(trilha) {
    const recursos = repositorio.listarRecursos(trilha.id);
    return { ...trilha, progresso: calcularProgresso(recursos), recursos };
  }

  rotas.post("/", (req, res) => {
    const erros = validarTrilha(req.body);
    if (erros.length > 0) {
      return res.status(400).json({ erro: erros.join("; ") });
    }
    const trilha = repositorio.criarTrilha(req.body);
    return res.status(201).json(trilhaComProgresso(trilha));
  });

  rotas.get("/", (req, res) => {
    res.json(repositorio.listarTrilhas().map(trilhaComProgresso));
  });

  rotas.get("/:id", (req, res) => {
    const trilha = repositorio.buscarTrilha(Number(req.params.id));
    if (!trilha) {
      return res.status(404).json({ erro: "Trilha não encontrada" });
    }
    return res.json(trilhaComProgresso(trilha));
  });

  rotas.post("/:id/recursos", (req, res) => {
    const trilha = repositorio.buscarTrilha(Number(req.params.id));
    if (!trilha) {
      return res.status(404).json({ erro: "Trilha não encontrada" });
    }
    const erros = validarRecurso(req.body);
    if (erros.length > 0) {
      return res.status(400).json({ erro: erros.join("; ") });
    }
    const recurso = repositorio.adicionarRecurso(trilha.id, req.body);
    return res.status(201).json(recurso);
  });

  rotas.post("/:id/recursos/:recursoId/concluir", (req, res) => {
    const trilhaId = Number(req.params.id);
    const recurso = repositorio.buscarRecurso(
      trilhaId,
      Number(req.params.recursoId),
    );
    if (!recurso) {
      return res.status(404).json({ erro: "Recurso não encontrado" });
    }
    if (recurso.concluido) {
      return res.status(409).json({ erro: "Recurso já concluído" });
    }
    repositorio.concluirRecurso(recurso.id);
    return res.json(trilhaComProgresso(repositorio.buscarTrilha(trilhaId)));
  });

  return rotas;
}
