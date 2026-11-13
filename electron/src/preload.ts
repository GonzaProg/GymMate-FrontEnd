import { contextBridge, ipcRenderer } from 'electron';

// Exponemos una API segura llamada "electronAPI" al frontend
contextBridge.exposeInMainWorld('electronAPI', {
  // Función para escuchar eventos del main (como 'update_ready')
  on: (channel: string, func: (...args: any[]) => void) => {
    // Filtramos canales permitidos por seguridad
    const validChannels = ['update_ready', 'update_available', 'download_progress'];
    if (validChannels.includes(channel)) {
      // Importante: Envolver en una nueva función para evitar fugas de memoria
      ipcRenderer.on(channel, (_event, ...args) => func(...args));
    }
  },
  // Función para limpiar listeners
  removeAllListeners: (channel: string) => {
    ipcRenderer.removeAllListeners(channel);
  },
  // Obtener la versión instalada de la app de escritorio (PC)
  getAppVersion: () => ipcRenderer.invoke('get-app-version')
});