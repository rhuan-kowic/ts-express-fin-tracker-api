# 💰 FinTracker API

API RESTful desenvolvida para gerenciamento de finanças pessoais. O sistema permite controle de entradas e saídas, categorização de lançamentos e autenticação segura, garantindo que cada usuário tenha acesso apenas aos seus próprios dados.

Esta API foi construída como parte de um desafio de desenvolvimento Fullstack.

## 🚀 Tecnologias

Esse projeto foi desenvolvido com as seguintes tecnologias:

<div align="center">
  <img src="https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB" />
  <img src="https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white" />
  <img src="https://img.shields.io/badge/sqlite-%2307405e.svg?style=for-the-badge&logo=sqlite&logoColor=white" />
  <img src="https://img.shields.io/badge/zod-%233068b7.svg?style=for-the-badge&logo=zod&logoColor=white" />
  <img src="https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens" />
  <img src="https://img.shields.io/badge/NPM-%23000000.svg?style=for-the-badge&logo=npm&logoColor=white" />
</div>

- **[Node.js](https://nodejs.org/en/)** - Runtime JavaScript
- **[Express](https://expressjs.com/)** - Framework para a API
- **[TypeScript](https://www.typescriptlang.org/)** - Superset JavaScript com tipagem estática
- **[Prisma](https://www.prisma.io/)** - ORM para banco de dados (SQLite por padrão)
- **[Zod](https://zod.dev/)** - Validação de dados (Schema Validation)
- **[JWT (JSON Web Token)](https://jwt.io/)** - Autenticação Stateless
- **[Bcryptjs](https://www.npmjs.com/package/bcryptjs)** - Hash de senhas
- **[Cors](https://www.npmjs.com/package/cors)** - Habilitação de Cross-Origin Resource Sharing

---

## ⚙️ Como executar

Siga os passos abaixo para rodar o projeto na sua máquina local:

### 1. Clone o repositório

```bash
git clone https://github.com/rhuan-kowic/ts-express-fin-tracker-api.git
cd ts-express-fin-tracker-api

# 2. Instale as dependências
npm install
```

### 3. Configure as Variáveis de Ambiente

Crie um arquivo .env na raiz do projeto e defina as seguintes variáveis (exemplo):

```bash
# Conexão com o Banco de Dados (SQLite cria o arquivo automaticamente)
DATABASE_URL="file:./dev.db"

# Chave secreta para assinar o Token JWT (Use uma string longa e aleatória)
JWT_SECRET="sua-chave-secreta-aqui"
```

### 4. Execute as Migrations (Banco de Dados)

Isso criará as tabelas no banco de dados SQLite.

```bash
npx prisma migrate dev
```

### 5. Inicie o Servidor

```
npm run dev
```

O servidor iniciará na porta 3333 (ex: http://localhost:3333).

---

# 📚 Documentação da API - FinTracker

Esta API utiliza arquitetura REST. O formato de comunicação é **JSON**.

**Base URL:** `http://localhost:3333`

---

## 🔐 Autenticação

A maioria das rotas são protegidas. Para acessá-las, você deve enviar o Token JWT obtido no Login.

- **Header:** `Authorization`
- **Valor:** `Bearer <seu_token_aqui>`

---

## 👤 Usuários & Sessão

### 1. Criar Usuário

Cria uma conta nova no sistema.

- **Método:** `POST`
- **Rota:** `/users`
- **Autenticação:** ❌ Não necessária (Pública)

**Corpo da Requisição (JSON):**

```json
{
  "name": "Rhuan",
  "email": "rhuan@exemplo.com",
  "password": "senha123segura"
}
```

---

### 2. Login (Autenticar)

Verifica email/senha e retorna o Token de acesso.

- **Método:** `POST`
- **Rota:** `/login`
- **Autenticação:** ❌ Não necessária (Pública)

**Corpo da Requisição (JSON):**

```json
{
  "email": "rhuan@exemplo.com",
  "password": "senha123segura"
}
```

**Resposta de Sucesso (200):**

```json
{
  "user": { "id": 1, "name": "Rhuan", "email": "..." },
  "token": "eyJhbGciOiJIUzI1Ni..."
}
```

---

## 🏷️ Categorias

### 3. Criar Categoria

- **Método:** `POST`
- **Rota:** `/categories`
- **Autenticação:** ✅ Token Obrigatório

**Corpo da Requisição (JSON):**

```json
{
  "name": "Alimentação"
}
```

### 4. Listar Categorias

Retorna todas as categorias cadastradas.

- **Método:** `GET`
- **Rota:** `/categories`
- **Autenticação:** ✅ Token Obrigatório

---

## 💸 Transações

### 5. Criar Transação

Registra uma nova entrada ou saída financeira. O sistema vincula automaticamente ao usuário logado.

- **Método:** `POST`
- **Rota:** `/transactions`
- **Autenticação:** ✅ Token Obrigatório

**Corpo da Requisição (JSON):**

```json
{
  "title": "Salário Mensal",
  "amount": 3500.5,
  "type": "income",
  "categoryId": 1
}
```

_Nota: O campo `type` aceita apenas `"income"` (entrada) ou `"expense"` (saída). O `amount` deve ser numérico (sem aspas)._

---

### 6. Listar Transações

Retorna o histórico do usuário e um resumo financeiro (Soma de entradas, saídas e total).

- **Método:** `GET`
- **Rota:** `/transactions`
- **Autenticação:** ✅ Token Obrigatório

**Exemplo de Resposta:**

```json
{
  "summary": {
    "income": 3500.5,
    "expense": 100,
    "total": 3400.5
  },
  "transactions": [ ... lista de objetos ... ]
}

```

---

### 7. Deletar Transação

Remove uma transação específica pelo ID. Só é permitido apagar transações criadas por você.

- **Método:** `DELETE`
- **Rota:** `/transactions/:id`
- **Autenticação:** ✅ Token Obrigatório

**Exemplo de URL:**
`http://localhost:3333/transactions/42`

**Respostas Possíveis:**

- **204 No Content:** Sucesso (deletado).
- **403 Forbidden:** Você tentou apagar a transação de outro usuário.
- **404 Not Found:** A transação não existe.

---

## 🗂 Estrutura do Projeto

```
src/
├── @types/          # Tipagens personalizadas do Express
├── controllers/     # Lógica das rotas (Regras de negócio)
├── lib/             # Configuração do Prisma Client
├── middleware/      # Interceptadores (Autenticação)
├── routes.ts        # Definição das rotas da API
└── server.ts        # Ponto de entrada da aplicação
```

### 📝 Licença

Este projeto está sob a licença MIT.
