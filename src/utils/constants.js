// URLs de la API
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';

// Estados de las tareas
export const ESTADOS_TAREA = {
  PENDIENTE: 'PENDIENTE',
  TOMA5_ENVIADO: 'TOMA5_ENVIADO',
  EN_REVISION: 'EN_REVISION',
  PENDIENTE_ASST: 'PENDIENTE_ASST',
  LISTA_PARA_INICIAR: 'LISTA_PARA_INICIAR',
  CANCELADA: 'CANCELADA',
  CANCELADA_AUTOMATICAMENTE: 'CANCELADA_AUTOMATICAMENTE'
};

// Colores para los badges de estado
export const COLORES_ESTADO = {
  PENDIENTE: 'bg-yellow-100 text-yellow-800',
  TOMA5_ENVIADO: 'bg-blue-100 text-blue-800',
  EN_REVISION: 'bg-purple-100 text-purple-800',
  PENDIENTE_ASST: 'bg-orange-100 text-orange-800',
  LISTA_PARA_INICIAR: 'bg-green-100 text-green-800',
  CANCELADA: 'bg-red-100 text-red-800',
  CANCELADA_AUTOMATICAMENTE: 'bg-gray-100 text-gray-800'
};

// Textos amigables para los estados
export const TEXTOS_ESTADO = {
  PENDIENTE: 'Pendiente',
  TOMA5_ENVIADO: 'Toma 5 Enviado',
  EN_REVISION: 'En Revisión',
  PENDIENTE_ASST: 'Pendiente ASST',
  LISTA_PARA_INICIAR: 'Lista para Iniciar',
  CANCELADA: 'Cancelada',
  CANCELADA_AUTOMATICAMENTE: 'Cancelada Automáticamente'
};

// Turnos
export const TURNOS = {
  CARDENALES: 'Cardenales',
  VALIENTES: 'Valientes'
};

// Roles
export const ROLES = {
  SUPERVISOR: 'SUPERVISOR',
  TRABAJADOR: 'TRABAJADOR',
  ADMINISTRADOR: 'ADMINISTRADOR'
};
