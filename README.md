# Library Manager

Sistema de gerenciamento de biblioteca com API REST em Spring Boot e interface desktop em Electron.

## Tecnologias

- **Backend:** Spring Boot 3.4, Spring Data JPA, SQLite, Lombok
- **Frontend:** Electron, Bootstrap 5
- **Banco:** SQLite (gerado automaticamente em `librarymanager.db`)

## Pré-requisitos

- Java 17+
- Maven 3.6+
- Node.js 18+

## Como executar

**1. Backend** — em um terminal:
```bash
cd backend
mvn spring-boot:run
```

**2. Frontend** — em outro terminal:
```bash
cd frontend
npm install
npm start
```

A janela Electron abre automaticamente e conecta na API em `http://localhost:8081`.

> Na primeira execução o banco é populado automaticamente com dados de exemplo (12 livros, 5 sócios e 5 empréstimos).

## Estrutura

```
librarymanager/
├── backend/
│   ├── src/main/java/com/librarymanager/
│   │   ├── config/       # CORS, Seeder
│   │   ├── controller/   # Endpoints REST
│   │   ├── exception/    # Tratamento global de erros
│   │   ├── model/        # Entidades JPA
│   │   ├── repository/   # Repositórios Spring Data
│   │   └── service/      # Regras de negócio
│   └── pom.xml
└── frontend/
    ├── src/
    │   ├── index.html
    │   ├── renderer.js
    │   └── styles.css
    └── main.js
```

## Endpoints da API

Base URL: `http://localhost:8081`

### Livros

| Método | Caminho | Descrição |
|--------|---------|-----------|
| GET | `/livros` | Lista todos (aceita `?search=`) |
| GET | `/livros/disponiveis` | Apenas disponíveis |
| GET | `/livros/emprestados` | Apenas emprestados |
| GET | `/livros/{id}` | Buscar por ID |
| POST | `/livros` | Cadastrar |
| PUT | `/livros/{id}` | Atualizar |
| DELETE | `/livros/{id}` | Excluir |

### Sócios

| Método | Caminho | Descrição |
|--------|---------|-----------|
| GET | `/socios` | Lista todos (aceita `?search=`) |
| GET | `/socios/{id}` | Buscar por ID |
| POST | `/socios` | Cadastrar |
| PUT | `/socios/{id}` | Atualizar |
| DELETE | `/socios/{id}` | Excluir |

### Empréstimos

| Método | Caminho | Descrição |
|--------|---------|-----------|
| GET | `/emprestimos` | Lista todos |
| GET | `/emprestimos/ativos` | Sem devolução |
| GET | `/emprestimos/atrasados` | Com prazo vencido |
| GET | `/emprestimos/socio/{id}` | Por sócio |
| GET | `/emprestimos/{id}` | Buscar por ID |
| POST | `/emprestimos` | Registrar empréstimo |
| PUT | `/emprestimos/{id}/devolver` | Registrar devolução |
