import type { CapacitorElectronConfig } from '@capacitor-community/electron';
import { getCapacitorElectronConfig, setupElectronDeepLinking } from '@capacitor-community/electron';
import type { MenuItemConstructorOptions } from 'electron';
import { app, ipcMain, MenuItem, shell } from 'electron';
import electronIsDev from 'electron-is-dev';
import unhandled from 'electron-unhandled';
import { autoUpdater } from 'electron-updater';

import { ElectronCapacitorApp, setupReloadWatcher } from './setup';

// Graceful handling of unhandled errors.
unhandled();

// Define our menu templates (these are optional)
const trayMenuTemplate: (MenuItemConstructorOptions | MenuItem)[] = [new MenuItem({ label: 'Quit App', role: 'quit' })];
const appMenuBarMenuTemplate: (MenuItemConstructorOptions | MenuItem)[] = [
  { role: process.platform === 'darwin' ? 'appMenu' : 'fileMenu' },
  { role: 'viewMenu' },
];

// Get Config options from capacitor.config
const capacitorFileConfig: CapacitorElectronConfig = getCapacitorElectronConfig();

// Initialize our app. You can pass menu templates into the app here.
// const myCapacitorApp = new ElectronCapacitorApp(capacitorFileConfig);
const myCapacitorApp = new ElectronCapacitorApp(capacitorFileConfig, trayMenuTemplate, appMenuBarMenuTemplate);

// If deeplinking is enabled then we will set it up here.
if (capacitorFileConfig.electron?.deepLinkingEnabled) {
  setupElectronDeepLinking(myCapacitorApp, {
    customProtocol: capacitorFileConfig.electron.deepLinkingCustomProtocol ?? 'mycapacitorapp',
  });
}

// If we are in Dev mode, use the file watcher components.
if (electronIsDev) {
  setupReloadWatcher(myCapacitorApp);
}

// --- CONFIGURACIÓN DE AUTO-UPDATER ---
// Esto define cómo se comporta el actualizador
autoUpdater.autoDownload = true; // Descarga la actualización automáticamente
autoUpdater.allowPrerelease = false; // Solo versiones estables

// Eventos para monitorear la actualización (útil para logs)
autoUpdater.on('checking-for-update', () => {
  console.log('Buscando actualizaciones...');
});

autoUpdater.on('update-available', (info) => {
  console.log('Actualización disponible:', info.version);
});

autoUpdater.on('update-not-available', () => {
  console.log('La app está actualizada.');
});

autoUpdater.on('error', (err) => {
  console.error('Error en el actualizador:', err);
});

autoUpdater.on('download-progress', (progressObj) => {
  console.log(`Descargando: ${progressObj.percent.toFixed(2)}%`);
});

// Cuando la actualización ya se descargó aviamos al Front
autoUpdater.on('update-downloaded', (info) => {
  console.log('Actualización descargada. Esperando reinicio...');
  
  // BUSCAMOS LA VENTANA Y ENVIAMOS EL AVISO
  const win = myCapacitorApp.getMainWindow();
  if (win) {
    // Enviamos un evento llamado 'update_ready' al Frontend
    win.webContents.send('update_ready');
  }
});
// Run Application
(async () => {
  // Wait for electron app to be ready.
  await app.whenReady();
  // Security - Set Content-Security-Policy based on whether or not we are in dev mode.
  //setupContentSecurityPolicy(myCapacitorApp.getCustomURLScheme());
  // Initialize our app, build windows, and load content.
  await myCapacitorApp.init();
  // Check for updates if we are in a packaged app.

  // CONFIGURACIÓN DE LA BARRA DE MENÚS
  const win = myCapacitorApp.getMainWindow();
  if (win) {
    win.setAutoHideMenuBar(true); // Oculta la barra pero permite verla con la tecla 'Alt'
    win.setMenuBarVisibility(false); // Asegura que inicie oculta
    
    // Interceptar enlaces con target="_blank" para abrirlos en el navegador del sistema operativo
    win.webContents.setWindowOpenHandler(({ url }) => {
      if (url.startsWith('http') || url.startsWith('https')) {
        shell.openExternal(url);
        return { action: 'deny' };
      }
      return { action: 'allow' };
    });
  }

  if (!electronIsDev) {
    autoUpdater.checkForUpdatesAndNotify();
  }
})();

// Handle when all of our windows are close (platforms have their own expectations).
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// When the dock icon is clicked.
app.on('activate', async function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (myCapacitorApp.getMainWindow().isDestroyed()) {
    await myCapacitorApp.init();
  }
});

// Place all ipc or other electron api calls and custom functionality under this line
ipcMain.handle('get-app-version', () => {
  return app.getVersion();
});
