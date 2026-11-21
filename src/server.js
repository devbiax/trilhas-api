import { criarApp } from "./app.js";
import { criarBanco } from "./infra/banco.js";

const PORTA = process.env.PORT || 3000;
const db = criarBanco();

criarApp({ db }).listen(PORTA, () => {
  console.log(`API rodando em http://localhost:${PORTA}`);
});
