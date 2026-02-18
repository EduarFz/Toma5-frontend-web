import { createContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useSocket } from '../hooks/useSocket';
import notificacionesService from '../services/notificaciones.service';

export const NotificacionesContext = createContext();

export const NotificacionesProvider = ({ children }) => {
  const { usuario } = useAuth();
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noLeidas, setNoLeidas] = useState(0);

  // Cargar notificaciones iniciales
  useEffect(() => {
    if (usuario) {
      cargarNotificaciones();
    }
  }, [usuario]);

  /**
   * Cargar notificaciones del backend
   */
  const cargarNotificaciones = async () => {
    try {
      setLoading(true);
      const data = await notificacionesService.obtenerNotificaciones();
      setNotificaciones(data.notificaciones || []);
      
      // Contar no leídas
      const count = (data.notificaciones || []).filter(n => !n.leida).length;
      setNoLeidas(count);
    } catch (error) {
      console.error('Error al cargar notificaciones:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handler para nueva notificación desde Socket.io
   */
  const handleNuevaNotificacion = useCallback((data) => {
    console.log('🔔 Nueva notificación recibida:', data);
    
    // Agregar la notificación al inicio de la lista
    setNotificaciones(prev => [data.notificacion, ...prev]);
    setNoLeidas(prev => prev + 1);

    // Mostrar notificación del navegador (opcional)
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Nueva notificación - Sistema Toma 5', {
        body: data.notificacion.mensaje,
        icon: '/favicon.ico',
      });
    }
  }, []);

  /**
   * Handler para actualización de disponibilidad desde Socket.io
   */
  const handleActualizacionDisponibilidad = useCallback((data) => {
    console.log('👷 Actualización de disponibilidad:', data);
    // Aquí podríamos actualizar algún estado si es necesario
  }, []);

  // Configurar Socket.io con los handlers
  const socketHandlers = {
    'nueva-notificacion': handleNuevaNotificacion,
    'disponibilidad-actualizada': handleActualizacionDisponibilidad,
  };

  useSocket(usuario?.id, socketHandlers);

  /**
   * Marcar notificación como leída
   */
  const marcarComoLeida = async (notificacionId) => {
    try {
      await notificacionesService.marcarComoLeida(notificacionId);
      
      // Actualizar estado local
      setNotificaciones(prev =>
        prev.map(n =>
          n.id === notificacionId ? { ...n, leida: true } : n
        )
      );
      
      // Decrementar contador de no leídas
      setNoLeidas(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error al marcar notificación:', error);
    }
  };

  /**
   * Marcar todas como leídas
   */
  const marcarTodasComoLeidas = async () => {
    try {
      await notificacionesService.marcarTodasComoLeidas();
      
      // Actualizar estado local
      setNotificaciones(prev =>
        prev.map(n => ({ ...n, leida: true }))
      );
      
      setNoLeidas(0);
    } catch (error) {
      console.error('Error al marcar todas:', error);
    }
  };

  const value = {
    notificaciones,
    loading,
    noLeidas,
    cargarNotificaciones,
    marcarComoLeida,
    marcarTodasComoLeidas,
  };

  return (
    <NotificacionesContext.Provider value={value}>
      {children}
    </NotificacionesContext.Provider>
  );
};
