import { useContext } from 'react';
import { NotificacionesContext } from '../context/NotificacionesContext';

/**
 * Hook personalizado para acceder al contexto de notificaciones
 */
export const useNotificaciones = () => {
  const context = useContext(NotificacionesContext);

  if (!context) {
    throw new Error('useNotificaciones debe ser usado dentro de un NotificacionesProvider');
  }

  return context;
};
