import { createContext, useState, useEffect } from 'react';
import authService from '../services/auth.service';
import { ROLES } from '../utils/constants';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar usuario desde localStorage al iniciar
  useEffect(() => {
    const cargarUsuario = () => {
      try {
        const token = localStorage.getItem('token');
        const usuarioGuardado = localStorage.getItem('usuario');

        if (token && usuarioGuardado) {
          setUsuario(JSON.parse(usuarioGuardado));
        }
      } catch (error) {
        console.error('Error al cargar usuario:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
      } finally {
        setLoading(false);
      }
    };

    cargarUsuario();
  }, []);

  /**
   * Login de usuario
   */
  const login = async (cedula, contrasena) => {
    try {
      setError(null);
      const data = await authService.login(cedula, contrasena);

      // Verificar que sea un supervisor
      if (data.usuario.rol !== ROLES.SUPERVISOR) {
        throw { 
          error: 'Acceso denegado', 
          mensaje: 'Solo los supervisores pueden acceder a esta aplicación' 
        };
      }

      // Guardar token y usuario en localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('usuario', JSON.stringify(data.usuario));

      // Actualizar estado
      setUsuario(data.usuario);

      return data;
    } catch (error) {
      setError(error.mensaje || error.error || 'Error al iniciar sesión');
      throw error;
    }
  };

  /**
   * Logout de usuario
   */
  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      // Limpiar localStorage y estado
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      setUsuario(null);
    }
  };

  /**
   * Actualizar datos del usuario en el contexto
   */
  const actualizarUsuario = (datosActualizados) => {
    const usuarioActualizado = { ...usuario, ...datosActualizados };
    setUsuario(usuarioActualizado);
    localStorage.setItem('usuario', JSON.stringify(usuarioActualizado));
  };

  const value = {
    usuario,
    loading,
    error,
    login,
    logout,
    actualizarUsuario,
    isAuthenticated: !!usuario,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
