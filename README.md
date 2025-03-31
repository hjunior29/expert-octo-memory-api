# 🧠 Expert Octo Memory API

Bem-vindo ao repositório **Expert Octo Memory API**! Este projeto é o backend da aplicação de flashcards com suporte a Inteligência Artificial. Foi desenvolvido com 💨 **Bun**, ⚙️ **TypeScript**, 📦 **PostgreSQL**, ⚡️ **Drizzle** e integra com a API Gemini da Google para fornecer recursos inteligentes como geração de flashcards.

O Projeto pode ser acessada via o link(caso ainda esteja em produção): [API](https://expert-octo-memory-api.fly.dev/)


---

## 🏗️ Arquitetura do Projeto

A estrutura foi pensada para escalabilidade, separação de responsabilidades e performance:

```
expert-octo-memory-api/
├── .github/workflows/          # Configurações de CI/CD com GitHub Actions
├── drizzle/                    # Migrations e configurações do ORM Drizzle
├── src/                        # Código-fonte principal da aplicação
│   ├── api/                    # Definições de rotas (handlers HTTP)
│   │   ├── cors.ts             # Configuração de CORS
│   │   ├── middleware.ts       # Middleware global da API
│   │   ├── ping.ts             # Health check da API
│   │   └── server.ts           # Instância do servidor
│   ├── constants/              # Constantes globais
│   │   └── prompts/            # Prompts usados para chamadas à IA (Gemini)
│   ├── core/                   # Núcleo da aplicação
│   │   ├── database/           # Conexão com banco de dados e ORM
│   │   └── security/           # Lógica de segurança (JWT, chaves, etc.)
│   ├── modules/                # Módulos de domínio da aplicação
│   │   ├── auth/               # Autenticação e autorização
│   │   ├── flashcards/         # Lógica e rotas de flashcards
│   │   ├── folders/            # Organização dos flashcards por pastas
│   │   ├── gemini/             # Integração com API Gemini (IA)
│   │   ├── topic/              # Gerenciamento de tópicos
│   │   ├── users/              # Gestão de usuários
│   │   └── utils/              # Funções utilitárias internas
│   └── public/                 # Arquivos públicos
├── .dockerignore               # Arquivos ignorados no contexto do Docker
├── .env                        # Variáveis de ambiente para desenvolvimento
├── .gitignore                  # Arquivos ignorados pelo Git
├── biome.json                  # Configuração do Biome (linter/formatter)
├── bun.lockb                   # Lockfile do Bun
├── docker-compose.yml          # Orquestração com Docker Compose
├── Dockerfile                  # Dockerfile para build da aplicação
├── drizzle.config.ts           # Configuração do Drizzle ORM
├── fly.toml                    # Configuração para deploy com Fly.io
├── index.ts                    # Entry point principal da aplicação
├── package.json                # Scripts e dependências
├── README.md                   # Documentação do projeto
└── tsconfig.json               # Configuração do TypeScript
```

---

## 📦 Tecnologias Usadas

- ⚡ [Bun](https://bun.sh/)
- ⚙️ [TypeScript](https://www.typescriptlang.org/)
- 🐘 [PostgreSQL](https://www.postgresql.org/)
- ⚡️ [Drizzle ORM](https://orm.drizzle.team/)
- 🧠 [Google Gemini API](https://ai.google.dev/)
- 🔐 [JWT](https://jwt.io/introduction)

---

## 🛠️ Como rodar o projeto localmente

### Pré-requisitos

- [Bun](https://bun.sh/)
- [PostgreSQL](https://www.postgresql.org/)
- [pgAdmin (opcional)](https://www.pgadmin.org/)
- [Drizzle](https://orm.drizzle.team/)

### Passos

1. Clone o repositório:

```bash
git clone https://github.com/hjunior29/expert-octo-memory-api.git
cd expert-octo-memory-api
```

2. Configure o arquivo `.env` com base no exemplo abaixo:

```
DATABASE_HOST=localhost
DATABASE_USER=postgres
DATABASE_PASS=postgres
DATABASE_NAME=mydb
DATABASE_PORT=5432

PGADMIN_EMAIL=admin@admin.com
PGADMIN_PASS=admin

GEMINI_API_KEY=sua_chave_api_gemini

PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nSUACHAVEAQUI\n-----END PRIVATE KEY-----\n
PUBLIC_KEY=-----BEGIN PUBLIC KEY-----\nSUACHAVEAQUI\n-----END PUBLIC KEY-----\n

AUTH_BYPASS=false
ORIGIN_URL=http://localhost:5173
```

> 💡 **Dica:** para gerar par de chaves para autenticação JWT:
```bash
openssl genrsa -out private.pem 2048
openssl rsa -in private.pem -pubout -out public.pem
```

> 🔁 Para converter as chaves em string e colar no `.env`:
```bash
awk 'NF {sub(/\r/, ""); printf "%s\\n",$0;}' private.pem
awk 'NF {sub(/\r/, ""); printf "%s\\n",$0;}' public.pem
```

3. Instale as dependências:

```bash
bun install
```

4. Gere os arquivos Drizzle e aplique as migrações:

```bash
bunx --bun drizzle-kit generate
bunx --bun drizzle-kit push
```

5. Rode o servidor:

```bash
bun --watch run index.ts
```

A API estará disponível em `http://localhost:3000` 🚀

---

## 🧪 Testando a API

Você pode utilizar ferramentas como:

- [Insomnia](https://insomnia.rest/)
- [Postman](https://www.postman.com/)
- [Hoppscotch](https://hoppscotch.io/)

---

## 🐳 Rodando com Docker

1. Construa a imagem:

```bash
docker build -t expert-octo-memory-api .
```

2. Rode o container:

```bash
docker run -p 3000:3000 expert-octo-memory-api
```

> ✅ Certifique-se de que o banco de dados também esteja rodando em outro container ou localmente.

---

## 🤖 Integração com Gemini

A API se comunica com o modelo **Gemini** da Google para oferecer funcionalidades como:

- Geração de perguntas/respostas
- Sugestões baseadas em IA
- Traduções e resumos (futuramente)

Configure sua chave da Gemini em `GEMINI_API_KEY` no `.env`.

---

## 🔐 Autenticação

Autenticação baseada em JWT com criptografia RSA:

- As chaves são carregadas do `.env`
- Você pode ativar o bypass para testes locais com `AUTH_BYPASS=true`

---

## 🌍 Deploy com Fly.io

1. Instale o Fly CLI: https://fly.io/docs/hands-on/install-flyctl/
2. Faça login:

```bash
fly auth login
```

3. Crie a aplicação:

```bash
fly launch
```

4. Faça o deploy:

```bash
fly deploy
```

---

## 🤝 Contribuições

Sinta-se livre para abrir issues e pull requests! Sugestões, melhorias e colaborações são sempre bem-vindas 💛

---

Feito com 💻 + 🫶🏾 por [@hjunior29](https://github.com/hjunior29)
