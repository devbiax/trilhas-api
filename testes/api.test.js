import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import { criarApp } from "../src/app.js";
import { criarBanco } from "../src/infra/banco.js";

const recursoValido = {
  titulo: "Guia de HTML",
  link: "https://developer.mozilla.org/pt-BR/docs/Learn/HTML",
  tipo: "artigo",
};

describe("API de trilhas", () => {
  let app;

  beforeEach(() => {
    app = criarApp({ db: criarBanco(":memory:") });
  });

  it("percorre o fluxo principal: cria trilha, adiciona recurso, conclui e mostra o progresso", async () => {
    const trilha = await request(app)
      .post("/trilhas")
      .send({ titulo: "HTML e CSS", nivel: "iniciante" });
    expect(trilha.status).toBe(201);
    expect(trilha.body.progresso).toBe(0);

    const recurso = await request(app)
      .post(`/trilhas/${trilha.body.id}/recursos`)
      .send(recursoValido);
    expect(recurso.status).toBe(201);

    const concluido = await request(app).post(
      `/trilhas/${trilha.body.id}/recursos/${recurso.body.id}/concluir`,
    );
    expect(concluido.status).toBe(200);
    expect(concluido.body.progresso).toBe(100);

    const consulta = await request(app).get(`/trilhas/${trilha.body.id}`);
    expect(consulta.status).toBe(200);
    expect(consulta.body.progresso).toBe(100);
    expect(consulta.body.recursos[0].concluido).toBe(true);
  });

  it("não deixa concluir o mesmo recurso duas vezes", async () => {
    const trilha = await request(app)
      .post("/trilhas")
      .send({ titulo: "HTML e CSS", nivel: "iniciante" });
    const recurso = await request(app)
      .post(`/trilhas/${trilha.body.id}/recursos`)
      .send(recursoValido);
    const url = `/trilhas/${trilha.body.id}/recursos/${recurso.body.id}/concluir`;

    await request(app).post(url);
    const segunda = await request(app).post(url);

    expect(segunda.status).toBe(409);
  });

  it("recusa uma trilha com dados inválidos", async () => {
    const resposta = await request(app)
      .post("/trilhas")
      .send({ titulo: "", nivel: "mestre" });

    expect(resposta.status).toBe(400);
    expect(resposta.body.erro).toBeDefined();
  });
});
