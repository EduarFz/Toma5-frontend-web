import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import tareasService from '../services/tareas.service';
import Badge from '../components/common/Badge';
import {
  FiSearch, FiFilter, FiEye, FiCalendar,
  FiUser, FiFileText, FiRefreshCw
} from 'react-icons/fi';
import { ESTADOS_TAREA } from '../utils/constants';

const TODOS_LOS_ESTADOS = [
  { valor: '', etiqueta: 'Todos los estados' },
  { valor: ESTADOS_TAREA.PENDIENTE,               etiqueta: 'Pendiente' },
  { valor: ESTADOS_TAREA.TOMA5_ENVIADO,           etiqueta: 'Toma 5 Enviado' },
  { valor: ESTADOS_TAREA.EN_REVISION,             etiqueta: 'En Revisión' },
  { valor: ESTADOS_TAREA.PENDIENTE_ASST,          etiqueta: 'Pendiente ASST' },
  { valor: ESTADOS_TAREA.LISTA_PARA_INICIAR,      etiqueta: 'Lista para Iniciar' },
  { valor: ESTADOS_TAREA.CANCELADA,               etiqueta: 'Cancelada' },
  { valor: ESTADOS_TAREA.CANCELADA_AUTOMATICAMENTE, etiqueta: 'Cancelada Automáticamente' },
];

function Historial() {
  const navigate = useNavigate();
  const hoy = new Date().toISOString().split('T')[0];

  const [tareas, setTareas]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [filtroFecha, setFiltroFecha]   = useState(hoy);
  const [filtroEstado, setFiltroEstado] = useState('');

  useEffect(() => {
    cargarTareas();
  }, [filtroFecha, filtroEstado]);

  const cargarTareas = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {};
      if (filtroFecha)  params.fecha  = filtroFecha;
      if (filtroEstado) params.estado = filtroEstado;
      const data = await tareasService.listarTareas(params);
      setTareas(data.tareas || []);
    } catch (err) {
      setError('No se pudieron cargar las tareas.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const limpiarFiltros = () => {
    setFiltroFecha(hoy);
    setFiltroEstado('');
  };

  const formatearFecha = (fechaStr) => {
    if (!fechaStr) return '-';
    const partes = fechaStr.split('T')[0].split('-');
    const fecha = new Date(
      parseInt(partes[0]), parseInt(partes[1]) - 1, parseInt(partes[2])
    );
    return fecha.toLocaleDateString('es-CO', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  };

  const getBadgeVariant = (estado) => {
    const variants = {
      [ESTADOS_TAREA.PENDIENTE]:                  'warning',
      [ESTADOS_TAREA.TOMA5_ENVIADO]:              'info',
      [ESTADOS_TAREA.EN_REVISION]:                'purple',
      [ESTADOS_TAREA.PENDIENTE_ASST]:             'warning',
      [ESTADOS_TAREA.LISTA_PARA_INICIAR]:         'success',
      [ESTADOS_TAREA.CANCELADA]:                  'danger',
      [ESTADOS_TAREA.CANCELADA_AUTOMATICAMENTE]:  'default',
    };
    return variants[estado] || 'default';
  };

  const getEstadoTexto = (estado) => {
    const textos = {
      [ESTADOS_TAREA.PENDIENTE]:                  'Pendiente',
      [ESTADOS_TAREA.TOMA5_ENVIADO]:              'Toma 5 Enviado',
      [ESTADOS_TAREA.EN_REVISION]:                'En Revisión',
      [ESTADOS_TAREA.PENDIENTE_ASST]:             'Pendiente ASST',
      [ESTADOS_TAREA.LISTA_PARA_INICIAR]:         'Lista para Iniciar',
      [ESTADOS_TAREA.CANCELADA]:                  'Cancelada',
      [ESTADOS_TAREA.CANCELADA_AUTOMATICAMENTE]:  'Cancelada Automáticamente',
    };
    return textos[estado] || estado;
  };

  return (
    <div className="max-w-6xl mx-auto">

      {/* Encabezado */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Historial de Tareas</h1>
        <p className="text-gray-500 text-sm mt-1">
          Consulta y filtra todas las tareas registradas
        </p>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-end gap-4">

          {/* Filtro fecha */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <FiCalendar className="inline w-4 h-4 mr-1" />
              Fecha
            </label>
            <input
              type="date"
              value={filtroFecha}
              onChange={(e) => setFiltroFecha(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-400"
            />
          </div>

          {/* Filtro estado */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <FiFilter className="inline w-4 h-4 mr-1" />
              Estado
            </label>
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-400"
            >
              {TODOS_LOS_ESTADOS.map((e) => (
                <option key={e.valor} value={e.valor}>{e.etiqueta}</option>
              ))}
            </select>
          </div>

          {/* Botón limpiar */}
          <button
            onClick={limpiarFiltros}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 text-sm transition-colors"
          >
            <FiRefreshCw className="w-4 h-4" />
            <span>Hoy</span>
          </button>

        </div>
      </div>

      {/* Contenido */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-900" />
          <p className="ml-3 text-gray-500">Cargando tareas...</p>
        </div>

      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-500">{error}</p>
          <button onClick={cargarTareas} className="mt-3 text-blue-600 underline text-sm">
            Reintentar
          </button>
        </div>

      ) : tareas.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg shadow-md">
          <FiSearch className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-lg font-medium">No hay tareas para mostrar</p>
          <p className="text-gray-400 text-sm mt-1">
            Prueba cambiando los filtros de búsqueda
          </p>
        </div>

      ) : (
        <>
          <p className="text-sm text-gray-500 mb-3">
            {tareas.length} tarea{tareas.length !== 1 ? 's' : ''} encontrada{tareas.length !== 1 ? 's' : ''}
          </p>

          {/* Lista de tarjetas */}
          <div className="space-y-3">
            {tareas.map((tarea) => (
              <div
                key={tarea.id}
                className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">

                  {/* Info izquierda */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-gray-400 font-mono">#{tarea.id}</span>
                      <Badge variant={getBadgeVariant(tarea.estado)}>
                        {getEstadoTexto(tarea.estado)}
                      </Badge>
                    </div>

                    <p className="text-gray-800 font-semibold truncate">
                      {tarea.descripcion}
                    </p>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <FiUser className="w-3 h-3" />
                        {tarea.trabajador?.nombreCompleto || 'Sin asignar'}
                      </span>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <FiCalendar className="w-3 h-3" />
                        {formatearFecha(tarea.fechaTarea)}
                      </span>
                      {tarea.lugar && (
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          📍 {tarea.lugar}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Botón detalle */}
                  <button
                    onClick={() => navigate(`/tareas/${tarea.id}`)}
                    className="flex-shrink-0 flex items-center space-x-1 bg-blue-900 hover:bg-blue-800 text-white px-3 py-2 rounded-lg text-sm transition-colors"
                  >
                    <FiEye className="w-4 h-4" />
                    <span>Ver detalle</span>
                  </button>

                </div>
              </div>
            ))}
          </div>
        </>
      )}

    </div>
  );
}

export default Historial;
