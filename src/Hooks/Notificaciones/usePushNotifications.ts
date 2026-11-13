import { useState, useEffect, useRef } from 'react';
import { Capacitor, type PluginListenerHandle } from '@capacitor/core';
import { PushNotifications, type Token, type ActionPerformed, type PushNotificationSchema } from '@capacitor/push-notifications';
import { UsuarioApi } from '../../API/Usuarios/UsuarioApi';

const checkUserMissingFcmToken = (user: any): boolean => {
  if (!Capacitor.isNativePlatform()) return false;

  const targetUser = user || (() => {
    try {
      const str = localStorage.getItem('user') || sessionStorage.getItem('user');
      return str ? JSON.parse(str) : null;
    } catch {
      return null;
    }
  })();

  if (!targetUser) return false;
  const tokens = targetUser.fcmTokens;
  return !Array.isArray(tokens) || tokens.length === 0;
};

const persistTokenLocally = (tokenValue: string, backendTokens?: string[]) => {
  const storage = localStorage.getItem('user') ? localStorage : sessionStorage;
  const userStr = storage.getItem('user');
  if (!userStr) return;

  try {
    const parsed = JSON.parse(userStr);
    const currentTokens = Array.isArray(parsed.fcmTokens) ? parsed.fcmTokens : [];
    parsed.fcmTokens =
      Array.isArray(backendTokens) && backendTokens.length > 0
        ? backendTokens
        : Array.from(new Set([...currentTokens, tokenValue]));
    storage.setItem('user', JSON.stringify(parsed));
  } catch (e) {
    console.error('Error actualizando fcmTokens en storage local:', e);
  }
};

export const usePushNotifications = (currentUser: any) => {
  const [pushCheckCompleted, setPushCheckCompleted] = useState<boolean>(() => !checkUserMissingFcmToken(currentUser));
  const lastRegisteredUserIdRef = useRef<number | null>(null);

  const userId = currentUser?.id;
  const needsTokenWait = checkUserMissingFcmToken(currentUser);

  // Si estamos en Android/iOS y el usuario no tiene fcmToken registrado,
  // esperamos unos segundos para generar y guardar el token antes de cargar el resto de la app.
  const isCheckingPush = Capacitor.isNativePlatform() && !pushCheckCompleted && needsTokenWait;

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) {
      setPushCheckCompleted(true);
      return;
    }

    if (!userId) {
      return;
    }

    // Evitar reinicializar listeners si ya están activos para el mismo usuario
    if (lastRegisteredUserIdRef.current === userId) {
      return;
    }
    lastRegisteredUserIdRef.current = userId;

    let isMounted = true;
    let tokenReceived = false;
    let retryTimer: ReturnType<typeof setTimeout> | null = null;
    let postRegisterTimeout: ReturnType<typeof setTimeout> | null = null;
    let globalFailsafeTimeout: ReturnType<typeof setTimeout> | null = null;
    const listenerHandles: PluginListenerHandle[] = [];

    const finishBlockingCheck = () => {
      if (retryTimer) clearTimeout(retryTimer);
      if (postRegisterTimeout) clearTimeout(postRegisterTimeout);
      if (globalFailsafeTimeout) clearTimeout(globalFailsafeTimeout);
      if (isMounted) {
        setPushCheckCompleted(true);
      }
    };

    const saveTokenWithRetry = async (tokenValue: string) => {
      if (!tokenValue) return;
      try {
        const res = await UsuarioApi.saveFcmToken(tokenValue);
        persistTokenLocally(tokenValue, res?.fcmTokens);
      } catch (error) {
        console.warn('Primer intento de guardar FCM token falló, reintentando...', error);
        try {
          await new Promise((resolve) => setTimeout(resolve, 1500));
          const resRetry = await UsuarioApi.saveFcmToken(tokenValue);
          persistTokenLocally(tokenValue, resRetry?.fcmTokens);
        } catch (retryError) {
          console.error('Error guardando FCM token tras reintento:', retryError);
        }
      }
    };

    const setupPush = async () => {
      // Failsafe global por si el sistema operativo demora demasiado en responder permisos
      globalFailsafeTimeout = setTimeout(() => {
        finishBlockingCheck();
      }, 12000);

      try {
        // 1. Limpiamos listeners previos y agregamos los nuevos antes de llamar a register()
        await PushNotifications.removeAllListeners();

        const regHandle = await PushNotifications.addListener('registration', async (token: Token) => {
          console.log('Push registration success, token:', token.value);
          tokenReceived = true;
          await saveTokenWithRetry(token.value);
          finishBlockingCheck();
        });
        listenerHandles.push(regHandle);

        const errHandle = await PushNotifications.addListener('registrationError', (error: any) => {
          console.error('Error on push registration:', error);
          finishBlockingCheck();
        });
        listenerHandles.push(errHandle);

        const recvHandle = await PushNotifications.addListener('pushNotificationReceived', (notification: PushNotificationSchema) => {
          console.log('Push received:', notification);
          window.dispatchEvent(new Event('push-notification-received'));
        });
        listenerHandles.push(recvHandle);

        const actionHandle = await PushNotifications.addListener('pushNotificationActionPerformed', (notification: ActionPerformed) => {
          console.log('Push action performed:', notification);
        });
        listenerHandles.push(actionHandle);

        // 2. Comprobamos y solicitamos permisos (contemplando 'prompt' y 'prompt-with-rationale')
        let permStatus = await PushNotifications.checkPermissions();

        if (permStatus.receive !== 'granted') {
          permStatus = await PushNotifications.requestPermissions();
        }

        // 3. Registramos el dispositivo para obtener el FCM Token
        // En Android, Firebase genera el token incluso si el permiso visual fue denegado;
        // en iOS se registra con APNs/FCM.
        await PushNotifications.register();

        // 4. Si el usuario no tenía token guardado, esperamos unos segundos a que llegue el evento 'registration'
        // con un reintento automático a los 2.5s si aún no respondió.
        retryTimer = setTimeout(async () => {
          if (!tokenReceived && isMounted) {
            try {
              await PushNotifications.register();
            } catch (e) {
              console.warn('Error en reintento de PushNotifications.register():', e);
            }
          }
        }, 2500);

        postRegisterTimeout = setTimeout(() => {
          finishBlockingCheck();
        }, 5500);

      } catch (error) {
        console.error('Error configurando Push Notifications:', error);
        finishBlockingCheck();
      }
    };

    setupPush();

    return () => {
      isMounted = false;
      lastRegisteredUserIdRef.current = null;
      if (retryTimer) clearTimeout(retryTimer);
      if (postRegisterTimeout) clearTimeout(postRegisterTimeout);
      if (globalFailsafeTimeout) clearTimeout(globalFailsafeTimeout);
      listenerHandles.forEach((h) => h.remove());
    };
  }, [userId]);

  return { isCheckingPush };
};
