import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { SOCKET_URL } from '../utils/constants';

/**
 * Hook personalizado para manejar Socket.io
 * @param {string} usuarioId - ID del usuario para registrar en Socket.io
 * @param {Object} handlers - Objeto con handlers para eventos específicos
 */
export const useSocket = (usuarioId, handlers = {}) => {
  const socketRef = useRef(null);

  useEffect(() => {
    // No conectar si no hay usuarioId
    if (!usuarioId) return;

    // Crear conexión con Socket.io
    socketRef.current = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    const socket = socketRef.current;

    // Evento: Conexión exitosa
    socket.on('connect', () => {
      console.log('✅ Socket.io conectado:', socket.id);
      
      // Registrar el usuario en Socket.io
      socket.emit('registrar-usuario', usuarioId);
      console.log('📡 Usuario registrado en Socket.io:', usuarioId);
    });

    // Evento: Error de conexión
    socket.on('connect_error', (error) => {
      console.error('❌ Error de conexión Socket.io:', error);
    });

    // Evento: Desconexión
    socket.on('disconnect', (reason) => {
      console.log('🔌 Socket.io desconectado:', reason);
    });

    // Registrar handlers personalizados
    Object.keys(handlers).forEach((event) => {
      socket.on(event, handlers[event]);
    });

    // Cleanup al desmontar
    return () => {
      console.log('🔌 Cerrando conexión Socket.io');
      socket.disconnect();
    };
  }, [usuarioId, handlers]);

  return socketRef.current;
};
