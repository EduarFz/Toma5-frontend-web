import api from './api';

/**
 * Servicio de trabajadores
 */
const trabajadoresService = {
  /**
   * Obtener todos los trabajadores con filtros opcionales
   * @param {Object} filtros - { turno, disponible }
   * @returns {Promise} Lista de trabajadores
   */
  obtenerTrabajadores: async (filtros = {}) => {
    try {
      const params = new URLSearchParams();
      
      if (filtros.turno) {
        params.append('turno', filtros.turno);
      }
      
      if (filtros.disponible !== undefined) {
        params.append('disponible', filtros.disponible);
      }

      const url = `/trabajadores${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error al obtener trabajadores' };
    }
  },

  /**
   * Obtener trabajadores disponibles
   * @returns {Promise} Lista de trabajadores disponibles
   */
  obtenerDisponibles: async () => {
    try {
      const response = await api.get('/trabajadores/disponibles');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error al obtener trabajadores disponibles' };
    }
  },

  /**
   * Obtener trabajador por ID
   * @param {number} trabajadorId - ID del trabajador
   * @returns {Promise} Datos del trabajador
   */
  obtenerTrabajador: async (trabajadorId) => {
    try {
      const response = await api.get(`/trabajadores/${trabajadorId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error al obtener trabajador' };
    }
  },

  /**
   * Cambiar disponibilidad de un trabajador
   * @param {number} trabajadorId - ID del trabajador
   * @param {boolean} disponible - Nuevo estado de disponibilidad
   * @returns {Promise} Respuesta
   */
 cambiarDisponibilidad: async (trabajadorId, disponible) => {
  try {
    const response = await api.put(`/trabajadores/${trabajadorId}/disponibilidad`, {
      disponible: disponible,  // Cambio aquí: usar "disponible" en lugar de "disponibleHoy"
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Error al cambiar disponibilidad' };
  }
},
};

export default trabajadoresService;
