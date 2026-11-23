# ADR 0001: Separar a API em camadas, com o padrão Repository

- Status: aceito
- Data: 23/11/2026

## Contexto e problema

A API precisa guardar trilhas e recursos em um banco de dados e aplicar regras de negócio (cálculo de progresso, validações). Se o SQL e as regras ficarem misturados dentro das rotas HTTP, não dá para testar as regras sem subir um banco, e qualquer mudança no armazenamento obriga a mexer em todos os endpoints.

## Fatores de decisão

- Testar as regras de negócio de forma unitária, sem banco e sem HTTP.
- Cada parte do código com uma responsabilidade clara (princípios SOLID).
- Manter o projeto simples, dentro do escopo do Projeto B.

## Opções consideradas

1. Escrever o SQL diretamente nas rotas.
2. Separar em camadas (rotas, domínio e repositório), usando o padrão Repository.
3. Usar um ORM (como o Sequelize ou o Prisma).

## Decisão

Foi escolhida a opção 2. O código fica dividido em:

- `src/dominio`: funções puras com as regras (progresso e validações), sem dependência de banco ou de HTTP.
- `src/repositorio`: único lugar com SQL; expõe operações como `criarTrilha` e `buscarTrilha`.
- `src/rotas`: recebe a requisição, chama o domínio e o repositório e devolve a resposta.

O repositório é passado às rotas por parâmetro (`criarRotasTrilhas(repositorio)`), e o banco é passado à aplicação em `criarApp({ db })`. Nos testes, usa-se um banco SQLite em memória.

## Consequências

Positivas:

- As regras do domínio são testadas sem banco (testes unitários rápidos).
- Trocar o SQLite por outro banco mexe só na camada de repositório e no arquivo de conexão.
- Cada camada tem um motivo só para mudar (responsabilidade única), e as rotas não criam suas dependências (inversão de dependência).

Negativas:

- Mais arquivos e mais código de ligação do que escrever tudo nas rotas.

## Prós e contras das opções

- **SQL nas rotas:** é a mais curta, mas mistura responsabilidades e impede testar as regras isoladamente.
- **Repository e camadas:** exige mais estrutura, mas dá testabilidade e flexibilidade, e cabe bem no tamanho do projeto.
- **ORM:** esconde o SQL, mas adiciona uma dependência pesada e uma curva de aprendizado desnecessária para duas tabelas.

## Sobre o banco

O SQLite foi escolhido por não exigir um serviço separado: o banco é um arquivo, guardado em um volume do Docker, o que mantém o `docker compose up` simples.
