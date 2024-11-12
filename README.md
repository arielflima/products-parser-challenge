# Products Parser Challenge

Este projeto é uma API RESTful para importar, armazenar e buscar dados de produtos alimentícios utilizando Node.js, Express, PostgreSQL e Elasticsearch.

## Tecnologias Utilizadas

- **Linguagem**: TypeScript
- **Framework**: Express
- **Banco de Dados**: PostgreSQL
- **Busca**: Elasticsearch
- **Outras Tecnologias**: Prisma, date-fns-tz, Winston

## Instalação e Uso

### Pré-requisitos

- Node.js
- Docker e Docker Compose

### Passos para Instalação

1. Clone o repositório:
   git clone https://github.com/seu-usuario/products-parser-challenge.git
   cd products-parser-challenge

2. Rode o docker-compose:
   docker-compose up --build

3. Caso alteração ou primeiro início, rode o prisma migrate:
   npx prisma migrate dev

### Conclusão

Challenge by Coodesh
