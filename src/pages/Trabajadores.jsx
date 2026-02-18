import { useState, useEffect } from 'react';
import trabajadoresService from '../services/trabajadores.service';
import Badge from '../components/common/Badge';
import { FiSearch, FiFilter, FiToggleLeft, FiToggleRight, FiUser } from 'react-icons/fi';

function Trabajadores() {
  const [trabajadores, setTrabajadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filtros
  const [filtros, setFiltros] = useState({
    turno: '',
    disponible: '',
    busqueda: '',
  });

  // Cargar trabajadores al montar el componente
  useEffect(() => {
    cargarTrabajadores();
  }, []);

  /**
   * Cargar trabajadores desde el backend
   */
  const cargarTrabajadores = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {};
      if (filtros.turno) params.turno = filtros.turno;
      if (filtros.disponible !== '') params.disponible = filtros.disponible === 'true';
      
      const data = await trabajadoresService.obtenerTrabajadores(params);      
      setTrabajadores(data.trabajadores || []);
    } catch (err) {
      setError(err.mensaje || err.error || 'Error al cargar trabajadores');
    } finally {
      setLoading(false);
    }
    
  };

  /**
   * Aplicar filtros
   */
  const aplicarFiltros = () => {
    cargarTrabajadores();
  };

  /**
   * Limpiar filtros
   */
  const limpiarFiltros = () => {
    setFiltros({
      turno: '',
      disponible: '',
      busqueda: '',
    });
    // Recargar sin filtros después de limpiar
    setTimeout(() => {
      cargarTrabajadores();
    }, 100);
  };

  /**
   * Cambiar disponibilidad de un trabajador
   */
  const handleCambiarDisponibilidad = async (trabajadorId, disponibleActual) => {
    const nuevoEstado = !disponibleActual;
    const accion = nuevoEstado ? 'disponible' : 'no disponible';
    
    if (!window.confirm(`¿Estás seguro de marcar este trabajador como ${accion}?`)) {
      return;
    }

    try {
      await trabajadoresService.cambiarDisponibilidad(trabajadorId, nuevoEstado);
      
      // Actualizar estado local
      setTrabajadores(prev =>
        prev.map(t =>
          t.id === trabajadorId
            ? { ...t, disponibleHoy: nuevoEstado }
            : t
        )
      );
    } catch (err) {
      alert(err.mensaje || err.error || 'Error al cambiar disponibilidad');
    }
  };

  /**
 * Filtrar trabajadores por búsqueda local
 */
const trabajadoresFiltrados = trabajadores.filter(t => {
  if (!filtros.busqueda) return true;
  
  const busqueda = filtros.busqueda.toLowerCase();
  return (
    t.nombreCompleto.toLowerCase().includes(busqueda) ||
    t.cedula?.toLowerCase().includes(busqueda) ||
    t.carnet?.toLowerCase().includes(busqueda)
  );
});

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Gestión de Trabajadores
        </h1>
        <p className="text-gray-600 mt-1">
          Administra la disponibilidad y visualiza información de los trabajadores
        </p>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center space-x-2 mb-4">
          <FiFilter className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-800">Filtros</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Búsqueda */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar
            </label>
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Nombre, cédula o carnet..."
                value={filtros.busqueda}
                onChange={(e) => setFiltros({ ...filtros, busqueda: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          {/* Turno */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Turno
            </label>
            <select
              value={filtros.turno}
              onChange={(e) => setFiltros({ ...filtros, turno: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="">Todos</option>
              <option value="Cardenales">Cardenales</option>
              <option value="Valientes">Valientes</option>
            </select>
          </div>

          {/* Disponibilidad */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Disponibilidad
            </label>
            <select
              value={filtros.disponible}
              onChange={(e) => setFiltros({ ...filtros, disponible: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="">Todos</option>
              <option value="true">Disponibles</option>
              <option value="false">No Disponibles</option>
            </select>
          </div>
        </div>

        {/* Botones */}
        <div className="flex space-x-3 mt-4">
          <button
            onClick={aplicarFiltros}
            className="bg-blue-900 hover:bg-blue-800 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Aplicar Filtros
          </button>
          <button
            onClick={limpiarFiltros}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg transition-colors"
          >
            Limpiar
          </button>
        </div>
      </div>

      {/* Tabla de trabajadores */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto"></div>
            <p className="text-gray-500 mt-4">Cargando trabajadores...</p>
          </div>
        ) : error ? (
          <div className="p-12 text-center">
            <p className="text-red-600">{error}</p>
            <button
              onClick={cargarTrabajadores}
              className="mt-4 bg-blue-900 text-white px-6 py-2 rounded-lg hover:bg-blue-800"
            >
              Reintentar
            </button>
          </div>
        ) : trabajadoresFiltrados.length === 0 ? (
          <div className="p-12 text-center">
            <FiUser className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No se encontraron trabajadores</p>
          </div>
        ) : (
          <>
            {/* Header de la tabla */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <p className="text-sm text-gray-600">
                Mostrando <span className="font-semibold">{trabajadoresFiltrados.length}</span> trabajador(es)
              </p>
            </div>

            {/* Tabla */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trabajador
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cédula / Carnet
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Turno
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cargo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Disponibilidad
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {trabajadoresFiltrados.map((trabajador) => (
                    <tr key={trabajador.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-900 text-white flex items-center justify-center font-semibold">
                              {trabajador.nombreCompleto.charAt(0)}
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {trabajador.nombreCompleto}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
  <div className="text-sm text-gray-900">
    {trabajador.cedula}
  </div>
  <div className="text-sm text-gray-500">
    Carnet: {trabajador.carnet}
  </div>
</td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={trabajador.turno === 'Cardenales' ? 'info' : 'purple'}>
                          {trabajador.turno}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {trabajador.cargo}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={trabajador.disponibleHoy ? 'success' : 'danger'}>
                          {trabajador.disponibleHoy ? 'Disponible' : 'No Disponible'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handleCambiarDisponibilidad(trabajador.id, trabajador.disponibleHoy)}
                          className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-colors ${
                            trabajador.disponibleHoy
                              ? 'bg-red-50 text-red-700 hover:bg-red-100'
                              : 'bg-green-50 text-green-700 hover:bg-green-100'
                          }`}
                        >
                          {trabajador.disponibleHoy ? (
                            <>
                              <FiToggleRight className="w-4 h-4" />
                              <span>Marcar No Disponible</span>
                            </>
                          ) : (
                            <>
                              <FiToggleLeft className="w-4 h-4" />
                              <span>Marcar Disponible</span>
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Trabajadores;
