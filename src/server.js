import { criarApp } from "./app.js";
import { criarBanco } from "./infra/banco.js";
import { logger } from "./infra/logger.js";

const PORTA = process.env.PORT || 3000;
const db = criarBanco();

criarApp({ db }).listen(PORTA, () => {
  logger.info(`API rodando em http://localhost:${PORTA}`);
});
