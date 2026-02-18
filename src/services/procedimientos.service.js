import api from './api';

/**
 * Servicio de procedimientos
 */
const procedimientosService = {
  /**
   * Obtener todos los procedimientos
   * @returns {Promise} Lista de procedimientos
   */
  obtenerProcedimientos: async () => {
    try {
      const response = await api.get('/procedimientos');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error al obtener procedimientos' };
    }
  },

  /**
   * Obtener procedimiento por ID
   * @param {number} procedimientoId - ID del procedimiento
   * @returns {Promise} Datos del procedimiento
   */
  obtenerProcedimiento: async (procedimientoId) => {
    try {
      const response = await api.get(`/procedimientos/${procedimientoId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error al obtener procedimiento' };
    }
  },
};

export default procedimientosService;
