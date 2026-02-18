import api from './api';

/**
 * Servicio de notificaciones
 */
const notificacionesService = {
  /**
   * Obtener todas las notificaciones del usuario
   * @returns {Promise} Lista de notificaciones
   */
  obtenerNotificaciones: async () => {
    try {
      const response = await api.get('/notificaciones');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error al obtener notificaciones' };
    }
  },

  /**
   * Marcar una notificación como leída
   * @param {number} notificacionId - ID de la notificación
   * @returns {Promise} Respuesta
   */
  marcarComoLeida: async (notificacionId) => {
    try {
      const response = await api.put(`/notificaciones/${notificacionId}/leer`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error al marcar notificación' };
    }
  },

  /**
   * Marcar todas las notificaciones como leídas
   * @returns {Promise} Respuesta
   */
  marcarTodasComoLeidas: async () => {
    try {
      const response = await api.put('/notificaciones/leer-todas');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error al marcar notificaciones' };
    }
  },
};

export default notificacionesService;
