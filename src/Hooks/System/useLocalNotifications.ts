import { useEffect } from 'react';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';

export const useLocalNotifications = () => {
  useEffect(() => {
    // Solo ejecutamos en dispositivos nativos (Android/iOS)
    if (Capacitor.isNativePlatform()) {
      setupNotifications();
    }
  }, []);

  const setupNotifications = async () => {
    try {
      // 1. Crear canal de notificación (Requerido para Android 8+ y evita bugs de Xiaomi)
      await LocalNotifications.createChannel({
        id: 'gymmate_channel_v2', // ID nuevo para reiniciar las configuraciones cacheadas por Android
        name: 'Recordatorios de GymMate',
        description: 'Canal principal para los recordatorios de la aplicación',
        importance: 5, // 5 = High importance (Pop-up en pantalla)
        visibility: 1, // 1 = Public
      });

      // 2. Verificar permisos sin lanzar popup simultáneo que colisione con PushNotifications
      const checkResult = await LocalNotifications.checkPermissions();
      if (checkResult.display !== 'granted') {
        return;
      }

      // 3. Limpiar notificaciones programadas previamente para no duplicar
      const pending = await LocalNotifications.getPending();
      if (pending.notifications.length > 0) {
        await LocalNotifications.cancel(pending);
      }

    } catch (error) {
      console.error('Error configurando LocalNotifications:', error);
    }
  };
};
