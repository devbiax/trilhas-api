import { describe, expect, it } from "vitest";
import {
  calcularProgresso,
  urlValida,
  validarRecurso,
  validarTrilha,
} from "../src/dominio/trilha.js";

describe("calcularProgresso", () => {
  it("devolve 0 quando a trilha não tem recursos", () => {
    expect(calcularProgresso([])).toBe(0);
  });

  it("devolve 0 quando nenhum recurso foi concluído", () => {
    const recursos = [{ concluido: false }, { concluido: false }];
    expect(calcularProgresso(recursos)).toBe(0);
  });

  it("devolve 50 quando metade dos recursos foi concluída", () => {
    const recursos = [{ concluido: true }, { concluido: false }];
    expect(calcularProgresso(recursos)).toBe(50);
  });

  it("devolve 100 quando todos os recursos foram concluídos", () => {
    const recursos = [{ concluido: true }, { concluido: true }];
    expect(calcularProgresso(recursos)).toBe(100);
  });

  it("arredonda para o inteiro mais próximo (1 de 3 = 33)", () => {
    const recursos = [
      { concluido: true },
      { concluido: false },
      { concluido: false },
    ];
    expect(calcularProgresso(recursos)).toBe(33);
  });
});

describe("urlValida", () => {
  it("aceita um link https", () => {
    expect(
      urlValida("https://developer.mozilla.org/pt-BR/docs/Learn/HTML"),
    ).toBe(true);
  });

  it("aceita um link http", () => {
    expect(urlValida("http://exemplo.com")).toBe(true);
  });

  it("rejeita texto que não é uma URL", () => {
    expect(urlValida("isso não é um link")).toBe(false);
  });

  it("rejeita protocolos que não são http nem https", () => {
    expect(urlValida("ftp://exemplo.com/arquivo")).toBe(false);
  });
});

describe("validarTrilha", () => {
  it("não devolve erros para uma trilha válida", () => {
    expect(validarTrilha({ titulo: "HTML e CSS", nivel: "iniciante" })).toEqual(
      [],
    );
  });

  it("exige título", () => {
    const erros = validarTrilha({ titulo: "   ", nivel: "iniciante" });
    expect(erros).toHaveLength(1);
  });

  it("rejeita nível desconhecido", () => {
    const erros = validarTrilha({ titulo: "HTML e CSS", nivel: "mestre" });
    expect(erros).toHaveLength(1);
  });

  it("não quebra quando o corpo da requisição não existe", () => {
    expect(validarTrilha(undefined)).toHaveLength(2);
  });
});

describe("validarRecurso", () => {
  const recursoValido = {
    titulo: "Guia de HTML",
    link: "https://developer.mozilla.org/pt-BR/docs/Learn/HTML",
    tipo: "artigo",
  };

  it("não devolve erros para um recurso válido", () => {
    expect(validarRecurso(recursoValido)).toEqual([]);
  });

  it("rejeita link inválido", () => {
    const erros = validarRecurso({ ...recursoValido, link: "não é link" });
    expect(erros).toHaveLength(1);
  });

  it("rejeita tipo desconhecido", () => {
    const erros = validarRecurso({ ...recursoValido, tipo: "podcast" });
    expect(erros).toHaveLength(1);
  });

  it("acumula todos os erros de um recurso totalmente inválido", () => {
    expect(validarRecurso({})).toHaveLength(3);
  });
});
