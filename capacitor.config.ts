import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.GymMate.app',
  appName: 'GymMate',
  webDir: 'dist',

  server: {
    androidScheme: "http", // <--- ESTO SOLUCIONA EL ERROR
    cleartext: true,       // Permite tráfico sin encriptar
    allowNavigation: [
      "192.168.1.8",
      "192.168.1.15",
      "*"
    ]
  },
  plugins: {
    PushNotifications: {
      presentationOptions: ["sound", "alert"],
    },
    SystemBars: {
      insetsHandling: "css",
    },
  },
};



export default config;
