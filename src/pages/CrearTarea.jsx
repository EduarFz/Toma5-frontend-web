import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import tareasService from '../services/tareas.service';
import trabajadoresService from '../services/trabajadores.service';
import { FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

function CrearTarea() {
  const navigate = useNavigate();
  
  // Estados del formulario
  const [formData, setFormData] = useState({
    descripcion: '',
    lugar: '',
    trabajadorId: '',
    trabajadorId2: '',
  });

  // Estados de datos
  const [trabajadores, setTrabajadores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Cargar trabajadores disponibles al montar
  useEffect(() => {
    cargarTrabajadores();
  }, []);

  /**
   * Cargar trabajadores disponibles (disponibleHoy = true)
   */
  const cargarTrabajadores = async () => {
    try {
      setLoadingData(true);
      setError(null);
      
      // Obtener trabajadores con filtro de disponibilidad
      const data = await trabajadoresService.obtenerTrabajadores({ disponible: true });
      
      setTrabajadores(data.trabajadores || []);
    } catch (err) {
      setError(err.mensaje || err.error || 'Error al cargar trabajadores');
    } finally {
      setLoadingData(false);
    }
  };

  /**
   * Validar que los trabajadores sean del mismo turno
   */
  const validarTurnos = () => {
    if (!formData.trabajadorId || !formData.trabajadorId2) {
      return true; // Si solo hay un trabajador, no hay que validar
    }

    const trabajador1 = trabajadores.find(t => t.id === parseInt(formData.trabajadorId));
    const trabajador2 = trabajadores.find(t => t.id === parseInt(formData.trabajadorId2));

    if (trabajador1 && trabajador2) {
      return trabajador1.turno === trabajador2.turno;
    }

    return true;
  };

  /**
   * Obtener turno del trabajador seleccionado
   */
  const getTurnoTrabajador = (trabajadorId) => {
    const trabajador = trabajadores.find(t => t.id === parseInt(trabajadorId));
    return trabajador?.turno || null;
  };

  /**
   * Filtrar trabajadores del mismo turno
   */
  const trabajadoresFiltrados = formData.trabajadorId
    ? trabajadores.filter(t => {
        const turnoSeleccionado = getTurnoTrabajador(formData.trabajadorId);
        return turnoSeleccionado ? t.turno === turnoSeleccionado : true;
      })
    : trabajadores;

  /**
   * Manejar cambios en el formulario
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Si se cambia el trabajador 1, limpiar trabajador 2
    if (name === 'trabajadorId' && formData.trabajadorId2) {
      setFormData({
        ...formData,
        [name]: value,
        trabajadorId2: '',
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
    
    setError(null);
  };

  /**
   * Manejar envío del formulario
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Validaciones
    if (!formData.descripcion.trim()) {
      setError('La descripción es obligatoria');
      return;
    }

    if (!formData.lugar.trim()) {
      setError('El lugar es obligatorio');
      return;
    }

    if (!formData.trabajadorId) {
      setError('Debes seleccionar al menos un trabajador');
      return;
    }

    if (!validarTurnos()) {
      setError('Los trabajadores deben ser del mismo turno');
      return;
    }

    try {
      setLoading(true);

      // Preparar datos para enviar
      const tareaData = {
        descripcion: formData.descripcion.trim(),
        lugar: formData.lugar.trim(),
        fechaTarea: new Date().toISOString().split('T')[0], // Fecha de hoy automáticamente
      };

      // Agregar trabajadores según cuántos fueron seleccionados
      if (formData.trabajadorId2) {
        tareaData.trabajadorId1 = parseInt(formData.trabajadorId);
        tareaData.trabajadorId2 = parseInt(formData.trabajadorId2);
      } else {
        tareaData.trabajadorId = parseInt(formData.trabajadorId);
      }

      await tareasService.crearTarea(tareaData);

      // Éxito
      setSuccess(true);
      
      // Limpiar formulario
      setFormData({
        descripcion: '',
        lugar: '',
        trabajadorId: '',
        trabajadorId2: '',
      });

      // Recargar trabajadores disponibles
      cargarTrabajadores();

      // Redirigir al dashboard después de 2 segundos
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      setError(err.mensaje || err.error || 'Error al crear tarea');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto"></div>
          <p className="text-gray-500 mt-4">Cargando trabajadores disponibles...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Crear Nueva Tarea
        </h1>
        <p className="text-gray-600 mt-1">
          Asigna una tarea para hoy a uno o dos trabajadores disponibles
        </p>
      </div>

      {/* Mensaje de éxito */}
      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start space-x-3">
          <FiCheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
          <div>
            <p className="text-green-800 font-semibold">¡Tarea creada exitosamente!</p>
            <p className="text-green-700 text-sm mt-1">
              Se ha enviado una notificación al(los) trabajador(es). Redirigiendo al dashboard...
            </p>
          </div>
        </div>
      )}

      {/* Mensaje de error */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
          <FiAlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
          <div>
            <p className="text-red-800 font-semibold">Error</p>
            <p className="text-red-700 text-sm mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Info: Fecha automática */}
      <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <span className="font-semibold">Fecha de la tarea:</span> {new Date().toLocaleDateString('es-CO', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })} (Hoy)
        </p>
      </div>

      {/* Formulario */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Descripción */}
          <div>
            <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-2">
              Descripción de la Tarea <span className="text-red-500">*</span>
            </label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Ej: Mantenimiento preventivo de tampeadora en sector norte"
              disabled={loading}
              required
            />
          </div>

          {/* Lugar */}
          <div>
            <label htmlFor="lugar" className="block text-sm font-medium text-gray-700 mb-2">
              Lugar <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="lugar"
              name="lugar"
              value={formData.lugar}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Ej: Kilómetro 45 - Vía principal"
              disabled={loading}
              required
            />
          </div>

          {/* Trabajador 1 */}
          <div>
            <label htmlFor="trabajadorId" className="block text-sm font-medium text-gray-700 mb-2">
              Trabajador 1 <span className="text-red-500">*</span>
            </label>
            {trabajadores.length === 0 ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center space-x-2">
                <FiAlertCircle className="text-yellow-600" />
                <p className="text-sm text-yellow-800">
                  No hay trabajadores disponibles en este momento. Ve a "Trabajadores" para cambiar su disponibilidad.
                </p>
              </div>
            ) : (
              <select
                id="trabajadorId"
                name="trabajadorId"
                value={formData.trabajadorId}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                disabled={loading}
                required
              >
                <option value="">Selecciona un trabajador</option>
                {trabajadores.map((trabajador) => (
                  <option key={trabajador.id} value={trabajador.id}>
                    {trabajador.nombreCompleto} - {trabajador.cargo} ({trabajador.turno})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Trabajador 2 (opcional) */}
          {formData.trabajadorId && trabajadores.length > 1 && (
            <div>
              <label htmlFor="trabajadorId2" className="block text-sm font-medium text-gray-700 mb-2">
                Trabajador 2 (Opcional)
              </label>
              <select
                id="trabajadorId2"
                name="trabajadorId2"
                value={formData.trabajadorId2}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                disabled={loading}
              >
                <option value="">Ninguno (solo un trabajador)</option>
                {trabajadoresFiltrados
                  .filter(t => t.id !== parseInt(formData.trabajadorId))
                  .map((trabajador) => (
                    <option key={trabajador.id} value={trabajador.id}>
                      {trabajador.nombreCompleto} - {trabajador.cargo} ({trabajador.turno})
                    </option>
                  ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Solo se muestran trabajadores del turno{' '}
                <span className="font-semibold">{getTurnoTrabajador(formData.trabajadorId)}</span>
              </p>
            </div>
          )}

          {/* Botones */}
          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              disabled={loading || trabajadores.length === 0}
              className="flex-1 bg-blue-900 hover:bg-blue-800 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Creando tarea...' : 'Crear Tarea'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              disabled={loading}
              className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CrearTarea;
