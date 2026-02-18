import api from './api';

const toma5Service = {

  obtenerToma5PorTarea: async (tareaId) => {
    try {
      const response = await api.get(`/toma5/tarea/${tareaId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error al obtener Toma 5' };
    }
  },

  aprobarToma5: async (toma5Id) => {
    try {
      const response = await api.put(`/toma5/${toma5Id}/aprobar`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error al aprobar Toma 5' };
    }
  },

  rechazarToma5: async (toma5Id, observaciones) => {
    try {
      const response = await api.put(`/toma5/${toma5Id}/rechazar`, { observaciones });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error al rechazar Toma 5' };
    }
  },

};

export default toma5Service;
