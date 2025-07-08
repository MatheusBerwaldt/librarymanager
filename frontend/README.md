# Library Manager - Frontend

Frontend da aplicação Library Manager desenvolvido com Electron.

## Tecnologias Utilizadas

- **Electron**: Framework para aplicações desktop
- **Bootstrap 5**: Framework CSS
- **jQuery**: Manipulação DOM
- **Axios**: Cliente HTTP
- **SQLite3**: Banco de dados local

## Estrutura do Projeto

```
frontend/
├── src/
│   ├── assets/            # Recursos estáticos
│   ├── components/        # Componentes da interface
│   ├── services/          # Serviços de comunicação
│   │   └── database.js    # Serviço de banco de dados
│   ├── utils/             # Utilitários
│   ├── index.html         # Página principal
│   ├── styles.css         # Estilos CSS
│   ├── script.js          # Script principal
│   └── renderer.js        # Script do renderer
├── main.js                # Processo principal do Electron
├── package.json           # Dependências e scripts
└── package-lock.json      # Lock das dependências
```

## Como Executar

### Pré-requisitos
- Node.js 16 ou superior
- npm ou yarn

### Instalando dependências

1. **Navegue para a pasta do frontend:**
   ```bash
   cd frontend
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

### Executando a aplicação

```bash
npm start
```

### Scripts Disponíveis

- `npm start`: Inicia a aplicação Electron
- `npm run start:dev`: Inicia com logs habilitados
- `npm run start:abs`: Inicia com caminho absoluto
- `npm run start:safe`: Inicia com logs e caminho seguro

## Desenvolvimento

### Estrutura de Arquivos

- **`main.js`**: Processo principal do Electron
- **`src/index.html`**: Interface principal
- **`src/script.js`**: Lógica da interface
- **`src/renderer.js`**: Processo de renderização
- **`src/services/database.js`**: Serviço de banco de dados

### Banco de Dados

A aplicação utiliza SQLite local para armazenamento de dados. O arquivo do banco está localizado em `../librarymanager.db`.

## Integração com Backend

Para integração completa, certifique-se de que o backend Spring Boot esteja rodando na porta 8080. 