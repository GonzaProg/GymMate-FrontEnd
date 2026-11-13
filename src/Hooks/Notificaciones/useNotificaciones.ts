import { useState, useEffect, useCallback } from "react";
import { NotificacionesApi, type Notificacion } from "../../API/Notificaciones/NotificacionesApi";
import { showError, showSuccess } from "../../Helpers/Alerts";

export const useNotificaciones = () => {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [gymNotificaciones, setGymNotificaciones] = useState<Notificacion[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Cargar notificaciones
  const fetchNotificaciones = useCallback(async () => {
    try {
      const data = await NotificacionesApi.getMyNotifications();
      setNotificaciones(data);
      // Contar no leídas (solo de las que aplican)
      setUnreadCount(data.filter((n) => !n.leida).length);
    } catch (error) {
      console.error("Error cargando notificaciones", error);
    }
  }, []);

  // Cargar notificaciones del gimnasio (Para entrenador/admin)
  const fetchGymNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const data = await NotificacionesApi.getGymNotifications();
      setGymNotificaciones(data);
    } catch (error) {
      console.error("Error cargando notificaciones del gym", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Marcar como leída
  const markAsRead = async (id: number) => {
    try {
      // Optimistic update: Actualizamos la UI antes de que responda el server
      setNotificaciones((prev) =>
        prev.map((n) => (n.id === id ? { ...n, leida: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));

      await NotificacionesApi.markAsRead(id);
    } catch (error) {
      console.error("Error al marcar como leída", error);
      fetchNotificaciones(); // Revertir si falla
    }
  };

  // Crear notificación (Broadcast)
  const sendBroadcast = async (titulo: string, mensaje: string, duracionDias?: number) => {
    setLoading(true);
    try {
      await NotificacionesApi.broadcast(titulo, mensaje, duracionDias);
      showSuccess("✅ Notificación enviada a los usuarios del gimnasio.");
      await fetchGymNotifications();
      return true;
    } catch (error: any) {
      showError("❌ Error al enviar: " + (error.response?.data?.error || "Desconocido"));
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Crear notificación global (Broadcast Global - Solo Admin)
  const sendBroadcastGlobal = async (titulo: string, mensaje: string, duracionDias?: number) => {
    setLoading(true);
    try {
      await NotificacionesApi.broadcastGlobal(titulo, mensaje, duracionDias);
      showSuccess("✅ Notificación global enviada a todos los usuarios de la plataforma.");
      await fetchGymNotifications();
      return true;
    } catch (error: any) {
      showError("❌ Error al enviar global: " + (error.response?.data?.error || "Desconocido"));
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Activar/Desactivar
  const toggleNotification = async (id: number) => {
    try {
      setGymNotificaciones(prev => prev.map(n => n.id === id ? { ...n, activa: !n.activa } : n));
      await NotificacionesApi.toggleActiva(id);
      showSuccess("Estado actualizado");
    } catch (error) {
      console.error("Error al cambiar estado", error);
      fetchGymNotifications();
      showError("Error al cambiar estado");
    }
  };

  // Eliminar
  const deleteNotification = async (id: number) => {
    try {
      await NotificacionesApi.deleteNotification(id);
      setGymNotificaciones(prev => prev.filter(n => n.id !== id));
      showSuccess("Notificación eliminada");
    } catch (error) {
      console.error("Error al eliminar", error);
      showError("Error al eliminar");
    }
  };

  // Cargar al montar el hook y escuchar evento de push recibido
  useEffect(() => {
    fetchNotificaciones();
    const handlePushReceived = () => fetchNotificaciones();
    window.addEventListener("push-notification-received", handlePushReceived);
    return () => {
      window.removeEventListener("push-notification-received", handlePushReceived);
    };
  }, [fetchNotificaciones]);

  return {
    notificaciones,
    gymNotificaciones,
    unreadCount,
    loading,
    markAsRead,
    sendBroadcast,
    sendBroadcastGlobal,
    refresh: fetchNotificaciones,
    fetchGymNotifications,
    toggleNotification,
    deleteNotification
  };
};