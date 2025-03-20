const { app, BrowserWindow, ipcMain } = require('electron');
const axios = require('axios');

let mainWindow;

app.whenReady().then(() => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    mainWindow.loadFile('index.html');
});

ipcMain.handle('fetch-data', async () => {
    try {
        const response = await axios.get('http://localhost:8080/api/hello');
        return response.data;
    } catch (error) {
        return 'Erro ao buscar dados do backend';
    }
});
