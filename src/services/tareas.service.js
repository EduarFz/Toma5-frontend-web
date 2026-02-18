import api from './api';

const tareasService = {

crearTarea: async (tareaData) => {
  try {
    const response = await api.post('/tareas', tareaData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Error al crear tarea' };
  }
},



  obtenerTareas: async (filtros = {}) => {
    try {
      const params = new URLSearchParams();
      if (filtros.estado) params.append('estado', filtros.estado);
      if (filtros.fechaInicio) params.append('fechaInicio', filtros.fechaInicio);
      if (filtros.fechaFin) params.append('fechaFin', filtros.fechaFin);
      const url = `/tareas${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error al obtener tareas' };
    }
  },

  obtenerTarea: async (tareaId) => {
    try {
      const response = await api.get(`/tareas/${tareaId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error al obtener tarea' };
    }
  },

  cancelarTarea: async (tareaId, motivo) => {
    try {
      const response = await api.put(`/tareas/${tareaId}/cancelar`, { motivo });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error al cancelar tarea' };
    }
  },

  listarTareas: async (params = {}) => {
  try {
    const response = await api.get('/tareas', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Error al listar tareas' };
  }
},


};

export default tareasService;
