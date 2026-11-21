import { describe, expect, it } from "vitest";
import { calcularProgresso } from "../src/dominio/trilha.js";

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
