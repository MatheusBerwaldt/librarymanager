const { app, BrowserWindow } = require("electron");
const path = require("path");
const db = require("./src/database");

// Desabilita o sandbox para desenvolvimento
app.commandLine.appendSwitch("no-sandbox");
app.commandLine.appendSwitch("disable-gpu");

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });

  // Carrega o arquivo HTML local
  win.loadFile(path.join(__dirname, "index.html"));

  // Abre o DevTools em desenvolvimento
  win.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// Limpa a conexão com o banco de dados quando a aplicação é fechada
app.on("before-quit", () => {
  db.close();
});
