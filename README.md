# Projeto — Loja Fortnite (Next.js + Auth.js + Prisma)

Este projeto é uma aplicação web construída com **Next.js**, focada em autenticação, gerenciamento de compras e exibição de itens da loja.  
Ele foi projetado para ser simples, rápido e seguro, utilizando tecnologias modernas como **Auth.js**, **Prisma**, **TypeScript** e **Docker**.

---

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- [Node.js 18+](https://nodejs.org) com npm
- [Docker](https://www.docker.com/) e Docker Compose
- Git

---

## Como rodar o projeto localmente com Docker

### **1. Clonar o repositório**

```bash
git clone https://github.com/AnthonyMdM/Projeto-Fortnite.git
cd Projeto-Fortnite
```

### **2. Configurar variáveis de ambiente**

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/fortnite_db"
NEXTAUTH_URL="http://localhost:3000"
AUTH_SECRET="sua-chave-secreta-aqui" //Pode gerar uma chave com o comando: npx auth secret
AUTH_TRUST_HOST="true"
AUTH_URL="http://localhost:3000"
NODE_ENV="development"
```

### **3. Instalar dependências**

```bash
npm install
```

### **4. Subir o banco de dados PostgreSQL com Docker**

```bash
npm run docker:up
```

> Aguarde alguns segundos para o PostgreSQL inicializar completamente!

### **5. Executar as migrações do Prisma**

```bash
npm run db:migrate
```

Este comando cria as tabelas no banco de dados baseado no schema do Prisma.

### **6. Popular o banco de dados (Seed)**

```bash
npm run db:seed
```

Este comando insere dados de teste no banco, incluindo usuários e itens da loja.

### **7. Iniciar o servidor de desenvolvimento**

```bash
npm run dev
```

Acesse a aplicação em: [http://localhost:3000](http://localhost:3000)

---

## Credenciais de teste

Após executar o seed, você pode fazer login com:

- **Email:** `player1@fortnite.io` ou `player2@fortnite.io`
- **Senha:** `Fortnite!23`

Cada usuário possui:

- Um bundle (`bundle-<userId>`)
- Três itens (skin, backpack, emote)

---

## Diagrama do Banco de Dados (ER)

O diagrama abaixo ilustra a estrutura do banco de dados e os relacionamentos entre as tabelas:

![Diagrama ER](./diagrama.png)

### Estrutura das tabelas principais:

- **User**: Armazena dados dos usuários (id, email, senha hash)
- **ItemsBuy**: Registro de itens comprados pelos usuários
- **OfferBuy**: Registro de ofertas compradas
- **Relacionamentos**: Many-to-many entre usuários e itens/ofertas, representados pela tabela **OfferBuy_ItemsBuy**

---

## 🛠️ Scripts disponíveis

| Comando               | Descrição                                    |
| --------------------- | -------------------------------------------- |
| `npm run dev`         | Inicia o Next.js em modo de desenvolvimento  |
| `npm run build`       | Gera o build de produção                     |
| `npm run start`       | Inicia o servidor em modo produção           |
| `npm run lint`        | Executa o ESLint                             |
| `npm run db:migrate`  | Aplica as migrações do Prisma                |
| `npm run db:seed`     | Popula o banco com dados de teste            |
| `npm run db:studio`   | Abre o Prisma Studio para visualizar o banco |
| `npm run docker:up`   | Sobe o container PostgreSQL                  |
| `npm run docker:down` | Para e remove o container PostgreSQL         |
| `npm run docker:logs` | Exibe os logs do container                   |

---

## 🔍 Visualizar o banco de dados

Para inspecionar os dados manualmente:

```bash
npm run db:studio
```

O Prisma Studio abrirá automaticamente no navegador, permitindo visualizar e editar:

- Usuários (User)
- Compras de itens (ItemsBuy)
- Ofertas compradas (OfferBuy)
- Tabelas de relacionamento

---

## 🐳 Gerenciamento do Docker

### Parar o container

```bash
npm run docker:down
```

### Ver logs do container

```bash
npm run docker:logs
```

---

## Tecnologias Utilizadas

### Core

- **Next.js** — Framework React full-stack
- **TypeScript** — Tipagem estática
- **Auth.js (NextAuth v5)** — Autenticação e proteção de rotas
- **Prisma ORM** — Abstração do banco e migrações
- **PostgreSQL** — Banco de dados relacional
- **Docker** — Containerização e padronização do ambiente

### UI / UX

- **shadcn/ui** — Componentes prontos e personalizáveis
- **Tailwind CSS** — Estilização e responsividade
- **lucide-react** — Ícones modernos

### Utilidades

- **bcryptjs** — Hash de senhas
- **ESLint + Prettier** — Padronização de código

---

## Decisões técnicas relevantes

### Next.js

Escolhi o Next.js pela familiaridade, versatilidade e eficiência. Ele permite trabalhar com:

- Rotas dinâmicas e estáticas
- Server-side e client-side rendering
- Cache inteligente
- Middleware e edge functions
- Estrutura organizada de pastas

Com isso, tornou-se uma escolha ideal para o projeto.

### Auth.js

Como o projeto não possui um backend separado com JWT tradicional, utilizei o Auth.js para gerenciar autenticação no próprio Next.js.

Ele facilita:

- Controle de sessão
- Proteção de rotas sensíveis
- Middlewares para redirecionamento
- Login e logout com segurança

### shadcn/ui

Optei por usar o shadcn/ui para acelerar o desenvolvimento, oferecendo componentes acessíveis e fáceis de estilizar.

### Prisma

Escolhi o Prisma ORM pela praticidade, documentação excelente e migrações robustas. Ele facilita operações como:

- CRUD de usuários
- Registro de compras
- Relacionamentos entre tabelas

---
