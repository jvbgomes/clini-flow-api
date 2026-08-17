# CliniFlow API

REST API para gerenciamento de clínica médica, com autenticação JWT, controle de pacientes e agendamentos.

## Tecnologias

- **Node.js** com **Express 5**
- **Sequelize ORM** + **PostgreSQL**
- **JWT** para autenticação
- **bcryptjs** para hash de senhas
- **express-validator** para validação de entrada
- **express-rate-limit** para rate limiting
- **Swagger / OpenAPI** para documentação

## Requisitos

- Node.js 18+
- PostgreSQL

## Instalação

```bash
npm install
```

Crie o arquivo `.env` na raiz:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=cliniflow
DB_USER=postgres
DB_PASSWORD=sua_senha
JWT_SECRET=seu_segredo_jwt
CORS_ORIGIN=http://localhost:5173
```

Execute as migrations:

```bash
npx sequelize-cli db:migrate
```

## Rodando

```bash
npm run dev
```

A API ficará disponível em `http://localhost:3000`.

Documentação Swagger: `http://localhost:3000/api-docs`

## Endpoints

### Auth — `/auth`

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| `POST` | `/auth/register` | Cadastrar usuário | — |
| `POST` | `/auth/login` | Login, retorna JWT | — |
| `POST` | `/auth/logout` | Revogar token atual | ✓ |
| `GET`  | `/auth/me` | Dados do usuário logado | ✓ |
| `POST` | `/auth/change-password` | Alterar senha | ✓ |

### Pacientes — `/patients`

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET`  | `/patients` | Listar com paginação (`?page=&limit=&search=&sortBy=&sortDir=`) |
| `POST` | `/patients` | Criar paciente |
| `GET`  | `/patients/:id` | Buscar paciente com consultas |
| `GET`  | `/patients/:id/appointments` | Consultas do paciente |
| `PUT`  | `/patients/:id` | Atualizar paciente |
| `DELETE` | `/patients/:id` | Soft delete |

### Consultas — `/appointments`

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET`  | `/appointments` | Listar com paginação e filtros |
| `POST` | `/appointments` | Criar consulta (valida conflito de horário) |
| `GET`  | `/appointments/today` | Consultas de hoje |
| `GET`  | `/appointments/upcoming` | Próximas consultas (`?days=7`) |
| `GET`  | `/appointments/:id` | Buscar consulta |
| `PUT`  | `/appointments/:id` | Atualizar consulta |
| `PATCH`| `/appointments/:id/status` | Atualizar só o status |
| `DELETE` | `/appointments/:id` | Soft delete |

### Dashboard — `/dashboard`

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET`  | `/dashboard/stats` | Estatísticas agregadas + dados mensais para gráfico |

## Funcionalidades

- **Soft delete** em pacientes e consultas (campo `deleted_at`, mantém histórico)
- **Paginação server-side** com suporte a busca e ordenação
- **Detecção de conflito** — impede duas consultas do mesmo paciente em menos de 30 minutos
- **Validação de CPF** com algoritmo de dígitos verificadores
- **Validação de telefone** — 10 ou 11 dígitos
- **Token blacklist** — logout invalida o token imediatamente
- **Rate limiting** — 20 requests por 15 min nas rotas de auth
- **CORS** configurável via variável de ambiente
