import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import tareasService from '../services/tareas.service';
import Badge from '../components/common/Badge';
import { FiCheckCircle, FiClock, FiAlertCircle, FiUsers, FiEye, FiPlusCircle } from 'react-icons/fi';
import { ESTADOS_TAREA } from '../utils/constants';

function Dashboard() {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const [tareas, setTareas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    pendientes: 0,
    paraRevisar: 0,
    completadasHoy: 0,
    trabajadoresActivos: 0,
  });

  useEffect(() => {
    cargarDatos();
  }, []);

/**
 * Cargar tareas y calcular estadísticas
 */
const cargarDatos = async () => {
  try {
    setLoading(true);
    
    // Obtener TODAS las tareas (sin filtro de fecha)
    const data = await tareasService.obtenerTareas({});
    const todasLasTareas = data.tareas || [];

    // Obtener fecha de HOY en formato YYYY-MM-DD
    const hoy = new Date();
    const hoyStr = hoy.toISOString().split('T')[0]; // "2026-02-09"
    
    console.log('🔍 Fecha de HOY (string):', hoyStr);
    
    // Filtrar tareas comparando SOLO la parte de la fecha (sin hora ni zona horaria)
    const tareasHoy = todasLasTareas.filter(tarea => {
      const fechaTareaStr = tarea.fechaTarea.split('T')[0]; // "2026-02-09"
      
      console.log('📅 Comparando:', {
        tareaNombre: tarea.descripcion,
        fechaTareaStr: fechaTareaStr,
        fechaHoyStr: hoyStr,
        sonIguales: fechaTareaStr === hoyStr
      });
      
      return fechaTareaStr === hoyStr;
    });

    console.log('✅ Tareas de HOY encontradas:', tareasHoy.length);
    
    setTareas(tareasHoy);

    // Calcular estadísticas
    const pendientes = tareasHoy.filter(
      t => t.estado === ESTADOS_TAREA.PENDIENTE
    ).length;

    const paraRevisar = tareasHoy.filter(
      t => t.estado === ESTADOS_TAREA.TOMA5_ENVIADO || 
           t.estado === ESTADOS_TAREA.EN_REVISION ||
           t.estado === ESTADOS_TAREA.PENDIENTE_ASST
    ).length;

    const completadasHoy = tareasHoy.filter(
      t => t.estado === ESTADOS_TAREA.LISTA_PARA_INICIAR
    ).length;

    // Contar trabajadores únicos
    const trabajadoresSet = new Set();
    tareasHoy.forEach(tarea => {
      // Para tareas individuales
      if (tarea.trabajador?.id) {
        trabajadoresSet.add(tarea.trabajador.id);
      }
      // Para tareas grupales (si existen)
      if (tarea.trabajador1?.id) trabajadoresSet.add(tarea.trabajador1.id);
      if (tarea.trabajador2?.id) trabajadoresSet.add(tarea.trabajador2.id);
    });

    setStats({
      pendientes,
      paraRevisar,
      completadasHoy,
      trabajadoresActivos: trabajadoresSet.size,
    });
  } catch (error) {
    console.error('Error al cargar datos:', error);
  } finally {
    setLoading(false);
  }
};



  /**
   * Obtener variante del badge según el estado
   */
  const getBadgeVariant = (estado) => {
    const variants = {
      [ESTADOS_TAREA.PENDIENTE]: 'warning',
      [ESTADOS_TAREA.TOMA5_ENVIADO]: 'info',
      [ESTADOS_TAREA.EN_REVISION]: 'purple',
      [ESTADOS_TAREA.PENDIENTE_ASST]: 'warning',
      [ESTADOS_TAREA.LISTA_PARA_INICIAR]: 'success',
      [ESTADOS_TAREA.CANCELADA]: 'danger',
      [ESTADOS_TAREA.CANCELADA_AUTOMATICAMENTE]: 'default',
    };
    return variants[estado] || 'default';
  };

  /**
   * Obtener texto amigable del estado
   */
  const getEstadoTexto = (estado) => {
    const textos = {
      [ESTADOS_TAREA.PENDIENTE]: 'Pendiente',
      [ESTADOS_TAREA.TOMA5_ENVIADO]: 'Toma 5 Enviado',
      [ESTADOS_TAREA.EN_REVISION]: 'En Revisión',
      [ESTADOS_TAREA.PENDIENTE_ASST]: 'Pendiente ASST',
      [ESTADOS_TAREA.LISTA_PARA_INICIAR]: 'Lista para Iniciar',
      [ESTADOS_TAREA.CANCELADA]: 'Cancelada',
      [ESTADOS_TAREA.CANCELADA_AUTOMATICAMENTE]: 'Cancelada Automáticamente',
    };
    return textos[estado] || estado;
  };

/**
 * Formatear fecha sin problema de zona horaria
 */
const formatearFecha = (fechaStr) => {
  try {
    // Extraer solo la parte YYYY-MM-DD del string ISO
    const partesFecha = fechaStr.split('T')[0].split('-');
    const año = parseInt(partesFecha[0]);
    const mes = parseInt(partesFecha[1]) - 1; // Meses en JS van de 0-11
    const dia = parseInt(partesFecha[2]);
    
    // Crear fecha con hora local para evitar cambio de día
    const fecha = new Date(año, mes, dia);
    
    return fecha.toLocaleDateString('es-CO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch (error) {
    return fechaStr;
  }
};


  const statsCards = [
    {
      title: 'Tareas Pendientes',
      value: stats.pendientes,
      icon: FiClock,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-700',
    },
    {
      title: 'Toma 5 para Revisar',
      value: stats.paraRevisar,
      icon: FiAlertCircle,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
    },
    {
      title: 'Tareas Completadas Hoy',
      value: stats.completadasHoy,
      icon: FiCheckCircle,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
    },
    {
      title: 'Trabajadores Activos',
      value: stats.trabajadoresActivos,
      icon: FiUsers,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Bienvenido, {usuario?.nombreCompleto?.split(' ')[0]}
          </h1>
          <p className="text-gray-600 mt-1">
            Resumen de actividades del día - {new Date().toLocaleDateString('es-CO', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
        <button
          onClick={() => navigate('/crear-tarea')}
          className="bg-blue-900 hover:bg-blue-800 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <FiPlusCircle className="w-5 h-5" />
          <span>Nueva Tarea</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {statsCards.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold text-gray-800 mt-2">
                  {stat.value}
                </p>
              </div>
              <div className={`${stat.bgColor} p-3 rounded-lg`}>
                <stat.icon className={`w-8 h-8 ${stat.textColor}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tareas del Día */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">
            Tareas del Día
          </h2>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto"></div>
            <p className="text-gray-500 mt-4">Cargando tareas...</p>
          </div>
        ) : tareas.length === 0 ? (
          <div className="p-12 text-center">
            <FiClock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No hay tareas para hoy</p>
            <button
              onClick={() => navigate('/crear-tarea')}
              className="bg-blue-900 hover:bg-blue-800 text-white px-6 py-2 rounded-lg inline-flex items-center space-x-2"
            >
              <FiPlusCircle className="w-4 h-4" />
              <span>Crear Primera Tarea</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tarea
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trabajador(es)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tareas.map((tarea) => (
                  <tr key={tarea.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {tarea.descripcion}
                      </div>
                      <div className="text-sm text-gray-500">
                        📍 {tarea.lugar}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {/* Trabajador individual */}
                      {tarea.trabajador && (
                        <div className="text-sm text-gray-900">
                          {tarea.trabajador.nombreCompleto}
                        </div>
                      )}
                      {/* Trabajadores grupales */}
                      {tarea.trabajador1 && (
                        <div className="text-sm text-gray-900">
                          {tarea.trabajador1.nombreCompleto}
                        </div>
                      )}
                      {tarea.trabajador2 && (
                        <div className="text-sm text-gray-500">
                          {tarea.trabajador2.nombreCompleto}
                        </div>
                      )}
                      {!tarea.trabajador && !tarea.trabajador1 && (
                        <div className="text-sm text-gray-400">Sin asignar</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatearFecha(tarea.fechaTarea)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={getBadgeVariant(tarea.estado)}>
                        {getEstadoTexto(tarea.estado)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => navigate(`/tareas/${tarea.id}`)}
                        className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                      >
                        <FiEye className="w-4 h-4" />
                        <span>Ver detalle</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
