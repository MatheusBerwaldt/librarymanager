# Library Manager

Sistema de Gerenciamento de Biblioteca com arquitetura moderna e bem estruturada.

## 🏗️ Arquitetura

O projeto utiliza uma arquitetura híbrida com:
- **Backend**: Spring Boot (Java) para APIs REST
- **Frontend**: Electron (Node.js) para interface desktop
- **Banco de Dados**: SQLite para persistência

## 📁 Estrutura do Projeto

```
librarymanager/
├── backend/                    # Aplicação Spring Boot
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/librarymanager/
│   │   │   │   ├── controller/       # Controladores REST
│   │   │   │   ├── service/          # Lógica de negócio
│   │   │   │   ├── repository/       # Repositórios JPA
│   │   │   │   ├── model/            # Entidades JPA
│   │   │   │   └── LibrarymanagerApplication.java
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/
│   ├── pom.xml
│   ├── mvnw
│   ├── mvnw.cmd
│   └── README.md
├── frontend/                   # Aplicação Electron
│   ├── src/
│   │   ├── assets/            # Recursos estáticos
│   │   ├── components/        # Componentes da interface
│   │   ├── services/          # Serviços de comunicação
│   │   │   └── database.js    # Serviço de banco de dados
│   │   ├── utils/             # Utilitários
│   │   ├── index.html         # Interface principal
│   │   ├── styles.css         # Estilos CSS
│   │   ├── script.js          # Script principal
│   │   └── renderer.js        # Script do renderer
│   ├── main.js                # Processo principal do Electron
│   ├── package.json           # Dependências e scripts
│   ├── package-lock.json      # Lock das dependências
│   └── README.md
├── docs/                      # Documentação
│   └── ARCHITECTURE.md        # Documentação da arquitetura
├── scripts/                   # Scripts de inicialização
│   ├── start-backend.bat      # Script Windows para backend
│   ├── start-frontend.bat     # Script Windows para frontend
│   ├── start-backend.sh       # Script Linux/Mac para backend
│   └── start-frontend.sh      # Script Linux/Mac para frontend
├── librarymanager.db          # Banco de dados SQLite
├── HELP.md                    # Ajuda do Spring Boot
├── start.sh                   # Script de inicialização
└── README.md                  # Este arquivo
```

## 🚀 Como Executar

### Opção 1: Scripts Automatizados

**Windows:**
```bash
# Backend
scripts/start-backend.bat

# Frontend (em outro terminal)
scripts/start-frontend.bat
```

**Linux/Mac:**
```bash
# Backend
chmod +x scripts/start-backend.sh
./scripts/start-backend.sh

# Frontend (em outro terminal)
chmod +x scripts/start-frontend.sh
./scripts/start-frontend.sh
```

### Opção 2: Manual

**Backend:**
```bash
cd backend
mvn spring-boot:run
```

**Frontend:**
```bash
cd frontend
npm install
npm start
```

## 📋 Pré-requisitos

### Backend
- Java 17 ou superior
- Maven 3.6 ou superior

### Frontend
- Node.js 16 ou superior
- npm ou yarn

## 🔧 Tecnologias Utilizadas

### Backend
- **Spring Boot 3.4.3**: Framework principal
- **Spring Data JPA**: Persistência de dados
- **SQLite**: Banco de dados
- **Lombok**: Redução de boilerplate
- **Thymeleaf**: Template engine

### Frontend
- **Electron**: Framework desktop
- **Bootstrap 5**: Framework CSS
- **jQuery**: Manipulação DOM
- **Axios**: Cliente HTTP
- **SQLite3**: Banco de dados local

## 📚 Funcionalidades

- **Gestão de Livros**: Cadastro, edição, exclusão e consulta
- **Gestão de Sócios**: Cadastro e gerenciamento de membros
- **Gestão de Empréstimos**: Controle de empréstimos e devoluções
- **Interface Desktop**: Aplicação nativa multiplataforma
- **Banco de Dados Local**: Funcionamento offline

## 🌐 Endpoints da API

- **Livros**: `http://localhost:8080/livros`
- **Sócios**: `http://localhost:8080/socios`
- **Empréstimos**: `http://localhost:8080/emprestimos`

## 📖 Documentação

- [Arquitetura do Sistema](docs/ARCHITECTURE.md)
- [Backend README](backend/README.md)
- [Frontend README](frontend/README.md)

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👨‍💻 Desenvolvimento

Para desenvolvimento, recomenda-se:
- **Backend**: IntelliJ IDEA ou Eclipse com suporte a Spring Boot
- **Frontend**: VS Code com extensões para Electron
- **Banco de Dados**: SQLite Browser para visualização dos dados 