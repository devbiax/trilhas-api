function paraRecurso(linha) {
  return linha ? { ...linha, concluido: linha.concluido === 1 } : undefined;
}

export function criarRepositorio(db) {
  const inserirTrilha = db.prepare(
    "INSERT INTO trilhas (titulo, nivel) VALUES (?, ?)",
  );
  const selecionarTrilha = db.prepare(
    "SELECT id, titulo, nivel FROM trilhas WHERE id = ?",
  );
  const selecionarTrilhas = db.prepare(
    "SELECT id, titulo, nivel FROM trilhas ORDER BY id",
  );
  const inserirRecurso = db.prepare(
    "INSERT INTO recursos (trilha_id, titulo, link, tipo) VALUES (?, ?, ?, ?)",
  );
  const selecionarRecursoPorId = db.prepare(
    "SELECT id, trilha_id, titulo, link, tipo, concluido FROM recursos WHERE id = ?",
  );
  const selecionarRecurso = db.prepare(
    "SELECT id, trilha_id, titulo, link, tipo, concluido FROM recursos WHERE id = ? AND trilha_id = ?",
  );
  const selecionarRecursos = db.prepare(
    "SELECT id, trilha_id, titulo, link, tipo, concluido FROM recursos WHERE trilha_id = ? ORDER BY id",
  );
  const atualizarConcluido = db.prepare(
    "UPDATE recursos SET concluido = 1 WHERE id = ?",
  );

  return {
    criarTrilha({ titulo, nivel }) {
      const { lastInsertRowid } = inserirTrilha.run(titulo, nivel);
      return selecionarTrilha.get(lastInsertRowid);
    },
    listarTrilhas() {
      return selecionarTrilhas.all();
    },
    buscarTrilha(id) {
      return selecionarTrilha.get(id);
    },
    listarRecursos(trilhaId) {
      return selecionarRecursos.all(trilhaId).map(paraRecurso);
    },
    adicionarRecurso(trilhaId, { titulo, link, tipo }) {
      const { lastInsertRowid } = inserirRecurso.run(
        trilhaId,
        titulo,
        link,
        tipo,
      );
      return paraRecurso(selecionarRecursoPorId.get(lastInsertRowid));
    },
    buscarRecurso(trilhaId, recursoId) {
      return paraRecurso(selecionarRecurso.get(recursoId, trilhaId));
    },
    concluirRecurso(recursoId) {
      atualizarConcluido.run(recursoId);
    },
  };
}
