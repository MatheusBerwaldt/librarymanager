# Library Manager

Sistema de gerenciamento de biblioteca — backend Spring Boot + frontend Electron.

## Estrutura

```
librarymanager/
├── backend/          # API REST (Spring Boot + SQLite)
│   ├── src/
│   └── pom.xml
├── frontend/         # Interface desktop (Electron)
│   ├── src/
│   │   ├── index.html
│   │   ├── styles.css
│   │   └── renderer.js
│   ├── main.js
│   └── package.json
└── librarymanager.db # Gerado automaticamente na primeira execução
```

## Pré-requisitos

- Java 17+
- Maven 3.6+
- Node.js 18+

## Como executar

**1. Backend** (em um terminal):
```bash
cd backend
./mvnw spring-boot:run
```

**2. Frontend** (em outro terminal):
```bash
cd frontend
npm install
npm start
```

A interface Electron abre automaticamente e conecta na API em `http://localhost:8081`.

## Endpoints da API

| Método | Caminho | Descrição |
|--------|---------|-----------|
Endpoints disponíveis em `http://localhost:8081`.

| GET | `/livros` | Lista livros (aceita `?search=`) |
| GET | `/livros/disponiveis` | Apenas livros disponíveis |
| GET | `/livros/emprestados` | Apenas livros emprestados |
| POST | `/livros` | Cadastrar livro |
| PUT | `/livros/{id}` | Atualizar livro |
| DELETE | `/livros/{id}` | Excluir livro |
| GET | `/socios` | Lista sócios (aceita `?search=`) |
| POST | `/socios` | Cadastrar sócio |
| PUT | `/socios/{id}` | Atualizar sócio |
| DELETE | `/socios/{id}` | Excluir sócio |
| GET | `/emprestimos` | Lista todos os empréstimos |
| GET | `/emprestimos/ativos` | Empréstimos sem devolução |
| GET | `/emprestimos/atrasados` | Empréstimos com prazo vencido |
| GET | `/emprestimos/socio/{id}` | Empréstimos por sócio |
| POST | `/emprestimos` | Registrar empréstimo |
| PUT | `/emprestimos/{id}/devolver` | Registrar devolução |
