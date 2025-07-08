# Library Manager - Backend

Backend da aplicação Library Manager desenvolvido com Spring Boot.

## Tecnologias Utilizadas

- **Spring Boot 3.4.3**: Framework principal
- **Spring Data JPA**: Persistência de dados
- **SQLite**: Banco de dados
- **Lombok**: Redução de boilerplate
- **Thymeleaf**: Template engine

## Estrutura do Projeto

```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/librarymanager/
│   │   │   ├── controller/       # Controladores REST
│   │   │   ├── service/          # Lógica de negócio
│   │   │   ├── repository/       # Repositórios JPA
│   │   │   ├── model/            # Entidades JPA
│   │   │   └── LibrarymanagerApplication.java
│   │   └── resources/
│   │       └── application.properties
│   └── test/
└── pom.xml
```

## Como Executar

### Pré-requisitos
- Java 17 ou superior
- Maven 3.6 ou superior

### Executando a aplicação

1. **Navegue para a pasta do backend:**
   ```bash
   cd backend
   ```

2. **Execute com Maven:**
   ```bash
   mvn spring-boot:run
   ```

3. **Ou compile e execute:**
   ```bash
   mvn clean compile
   mvn spring-boot:run
   ```

### Endpoints Disponíveis

- **Livros**: `http://localhost:8080/livros`
- **Sócios**: `http://localhost:8080/socios`
- **Empréstimos**: `http://localhost:8080/emprestimos`

## Configuração do Banco de Dados

O banco SQLite será criado automaticamente em `librarymanager.db` na raiz do projeto.

## Desenvolvimento

Para desenvolvimento, recomenda-se usar uma IDE como IntelliJ IDEA ou Eclipse com suporte a Spring Boot. 