import api from './api';

/**
 * Servicio de autenticación
 */
const authService = {
  /**
   * Login de usuario
   * @param {string} cedula - Número de cédula
   * @param {string} contrasena - Contraseña
   * @returns {Promise} Respuesta con token y datos del usuario
   */
  login: async (cedula, contrasena) => {
    try {
      const response = await api.post('/auth/login', {
        cedula,
        contrasena,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error de conexión' };
    }
  },

  /**
   * Logout de usuario
   * @returns {Promise} Respuesta del logout
   */
  logout: async () => {
    try {
      const response = await api.post('/auth/logout');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error de conexión' };
    }
  },

  /**
   * Obtener perfil del usuario actual
   * @returns {Promise} Datos del usuario
   */
  obtenerPerfil: async () => {
    try {
      const response = await api.get('/auth/perfil');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error de conexión' };
    }
  },

  /**
   * Cambiar contraseña
   * @param {string} contrasenaActual - Contraseña actual
   * @param {string} contrasenaNueva - Nueva contraseña
   * @returns {Promise} Respuesta del cambio
   */
  cambiarContrasena: async (contrasenaActual, contrasenaNueva) => {
    try {
      const response = await api.post('/auth/cambiar-contrasena', {
        contrasenaActual,
        contrasenaNueva,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error de conexión' };
    }
  },
};

export default authService;
