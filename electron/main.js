import { app, BrowserWindow } from 'electron';
import path, { dirname } from 'path';
import setupLSP from './lspSetup.js';
import { fileURLToPath } from 'url';

const isDev = true;

function createWindow() {

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);

  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      // preload: path.join(__dirname, 'preload.js'), // Optional: if using preload scripts
      nodeIntegration: true, // Enable Node.js integration
      contextIsolation: false, // Disable context isolation (for simplicity; consider security implications)
    },
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
    // mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/dist/index.html'));
  }
}

app.whenReady().then(() => {
  createWindow();
  setupLSP();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
