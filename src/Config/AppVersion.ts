import { Capacitor } from '@capacitor/core';
import { App as CapacitorApp } from '@capacitor/app';

/**
 * Obtiene la versión instalada de la app únicamente en dispositivos nativos (Android e iOS).
 * En Android lee `versionName` de `android/app/build.gradle` y en iOS lee `MARKETING_VERSION` de Xcode.
 * En navegador web o PC devuelve `null` porque no requiere comprobación.
 */
export const getCurrentAppVersion = async (): Promise<string | null> => {
  if (!Capacitor.isNativePlatform()) {
    return null;
  }

      try {
        const info = await CapacitorApp.getInfo();
        return info?.version ? info.version.trim() : null;
      } catch (error) {
        console.warn('No se pudo obtener la versión nativa con CapacitorApp.getInfo():', error);
        return null;
      }
    };

    /**
     * Compara dos versiones (ej: "1.2.5" vs "1.2.6").
     * Devuelve `true` si `currentVersion` es menor (más vieja) que `latestVersion`.
     */
    export const isVersionOutdated = (currentVersion?: string | null, latestVersion?: string | null): boolean => {
      if (!currentVersion || !latestVersion) return false;

      const cleanCurrent = currentVersion.trim().replace(/^v/i, '');
      const cleanLatest = latestVersion.trim().replace(/^v/i, '');

      if (!cleanCurrent || !cleanLatest || cleanCurrent === cleanLatest) return false;

      const currentParts = cleanCurrent.split('.').map((n) => parseInt(n, 10) || 0);
      const latestParts = cleanLatest.split('.').map((n) => parseInt(n, 10) || 0);
      const maxLength = Math.max(currentParts.length, latestParts.length);

      for (let i = 0; i < maxLength; i++) {
        const curr = currentParts[i] || 0;
        const lat = latestParts[i] || 0;
        if (curr < lat) return true;
        if (curr > lat) return false;
      }

      return false;
    };
