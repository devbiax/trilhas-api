import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  vus: 10,
  duration: "30s",
  thresholds: {
    http_req_failed: ["rate<0.01"],
    http_req_duration: ["p(95)<300"],
  },
};

const BASE_URL = "http://localhost:3000";

export function setup() {
  const resposta = http.post(
    `${BASE_URL}/trilhas`,
    JSON.stringify({ titulo: "Trilha de carga", nivel: "iniciante" }),
    { headers: { "Content-Type": "application/json" } },
  );
  return { id: resposta.json("id") };
}

export default function (dados) {
  const saude = http.get(`${BASE_URL}/health`);
  check(saude, { "health responde 200": (r) => r.status === 200 });

  const trilha = http.get(`${BASE_URL}/trilhas/${dados.id}`);
  check(trilha, { "trilha responde 200": (r) => r.status === 200 });

  sleep(1);
}
