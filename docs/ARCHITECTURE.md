# Arquitetura do Library Manager

## Visão Geral

O Library Manager é uma aplicação desktop desenvolvida com arquitetura híbrida, combinando:
- **Backend**: Spring Boot (Java) para APIs REST
- **Frontend**: Electron (Node.js) para interface desktop

## Diagrama da Arquitetura

```
┌─────────────────┐    HTTP/REST    ┌─────────────────┐
│   Frontend      │ ◄─────────────► │    Backend      │
│   (Electron)    │                 │  (Spring Boot)  │
│                 │                 │                 │
│ ┌─────────────┐ │                 │ ┌─────────────┐ │
│ │   UI Layer  │ │                 │ │ Controller  │ │
│ │ (HTML/CSS)  │ │                 │ │    Layer    │ │
│ └─────────────┘ │                 │ └─────────────┘ │
│ ┌─────────────┐ │                 │ ┌─────────────┐ │
│ │ Business    │ │                 │ │  Service    │ │
│ │   Logic     │ │                 │ │   Layer     │ │
│ └─────────────┘ │                 │ └─────────────┘ │
│ ┌─────────────┐ │                 │ ┌─────────────┐ │
│ │   Local     │ │                 │ │ Repository  │ │
│ │  Storage    │ │                 │ │   Layer     │ │
│ │  (SQLite)   │ │                 │ └─────────────┘ │
│ └─────────────┘ │                 │ ┌─────────────┐ │
└─────────────────┘                 │ │    Model    │ │
                                    │ │   Layer     │ │
                                    │ └─────────────┘ │
                                    │ ┌─────────────┐ │
                                    │ │   Database  │ │
                                    │ │   (SQLite)  │ │
                                    │ └─────────────┘ │
                                    └─────────────────┘
```

## Camadas da Aplicação

### Frontend (Electron)

1. **UI Layer**
   - `index.html`: Interface principal
   - `styles.css`: Estilos CSS
   - `script.js`: Lógica da interface

2. **Business Logic Layer**
   - `renderer.js`: Processo de renderização
   - `services/database.js`: Serviço de banco local

3. **Local Storage Layer**
   - SQLite local para cache e dados offline

### Backend (Spring Boot)

1. **Controller Layer**
   - `LivroController`: Endpoints para livros
   - `SocioController`: Endpoints para sócios
   - `EmprestimoController`: Endpoints para empréstimos

2. **Service Layer**
   - `LivroService`: Lógica de negócio para livros
   - `SocioService`: Lógica de negócio para sócios
   - `EmprestimoService`: Lógica de negócio para empréstimos

3. **Repository Layer**
   - `LivroRepository`: Acesso a dados de livros
   - `SocioRepository`: Acesso a dados de sócios
   - `EmprestimoRepository`: Acesso a dados de empréstimos

4. **Model Layer**
   - `Livro`: Entidade de livro
   - `Socio`: Entidade de sócio
   - `Emprestimo`: Entidade de empréstimo

## Fluxo de Dados

1. **Operações Locais**: Frontend → Local SQLite
2. **Sincronização**: Frontend ↔ Backend via REST APIs
3. **Persistência**: Backend → Database SQLite

## Vantagens da Arquitetura

- **Desacoplamento**: Frontend e backend independentes
- **Escalabilidade**: Fácil adição de novas funcionalidades
- **Manutenibilidade**: Código organizado e bem estruturado
- **Flexibilidade**: Pode funcionar offline e online
- **Performance**: Interface desktop responsiva 