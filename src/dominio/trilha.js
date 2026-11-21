export const NIVEIS = ["iniciante", "intermediario", "avancado"];
export const TIPOS = ["artigo", "video", "curso"];

export function calcularProgresso(recursos) {
  if (recursos.length === 0) {
    return 0;
  }
  const concluidos = recursos.filter((recurso) => recurso.concluido).length;
  return Math.round((concluidos / recursos.length) * 100);
}

export function urlValida(texto) {
  try {
    const url = new URL(texto);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function validarTrilha({ titulo, nivel } = {}) {
  const erros = [];
  if (typeof titulo !== "string" || titulo.trim() === "") {
    erros.push("titulo é obrigatório");
  }
  if (!NIVEIS.includes(nivel)) {
    erros.push(`nivel deve ser um destes: ${NIVEIS.join(", ")}`);
  }
  return erros;
}

export function validarRecurso({ titulo, link, tipo } = {}) {
  const erros = [];
  if (typeof titulo !== "string" || titulo.trim() === "") {
    erros.push("titulo é obrigatório");
  }
  if (!urlValida(link)) {
    erros.push("link deve ser uma URL válida (http ou https)");
  }
  if (!TIPOS.includes(tipo)) {
    erros.push(`tipo deve ser um destes: ${TIPOS.join(", ")}`);
  }
  return erros;
}
