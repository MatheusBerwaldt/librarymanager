#!/bin/bash

# Configura o diretório do projeto
export PROJECT_DIR="/home/matheus-berwaldt/projects/librarymanager"

# Configura as permissões do sandbox
sudo chown root:root "$PROJECT_DIR/node_modules/electron/dist/chrome-sandbox"
sudo chmod 4755 "$PROJECT_DIR/node_modules/electron/dist/chrome-sandbox"

# Inicia o aplicativo
cd "$PROJECT_DIR"
ELECTRON_ENABLE_LOGGING=true npm start 