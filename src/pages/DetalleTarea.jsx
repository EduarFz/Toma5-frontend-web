import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import tareasService from '../services/tareas.service';
import Badge from '../components/common/Badge';
import {
  FiArrowLeft, FiUser, FiMapPin, FiCalendar, FiClock,
  FiCheckCircle, FiXCircle, FiFileText, FiAlertTriangle,
  FiCamera
} from 'react-icons/fi';
import { ESTADOS_TAREA } from '../utils/constants';
import toma5Service from '../services/toma5.service';
import { PREGUNTAS_TOMA5, obtenerTextoPregunta } from '../utils/preguntasToma5';

function DetalleTarea() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tarea, setTarea] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mostrarModalCancelar, setMostrarModalCancelar] = useState(false);
  const [motivoCancelacion, setMotivoCancelacion] = useState('');
  const [cancelando, setCancelando] = useState(false);
  const [mostrarModalRechazar, setMostrarModalRechazar] = useState(false);
const [observacionesRechazo, setObservacionesRechazo] = useState('');
const [procesandoRevision, setProcesandoRevision] = useState(false);

  useEffect(() => {
    cargarTarea();
  }, [id]);

  const cargarTarea = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await tareasService.obtenerTarea(id);
      setTarea(data.tarea);
    } catch (err) {
      setError('No se pudo cargar la tarea. Verifica que existe.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAprobar = async () => {
  if (!window.confirm('¿Confirmas que apruebas el Toma 5 de esta tarea?')) return;
  try {
    setProcesandoRevision(true);
    await toma5Service.aprobarToma5(tarea.toma5.id);
    await cargarTarea();
  } catch (err) {
    alert(err.mensaje || 'Error al aprobar el Toma 5');
  } finally {
    setProcesandoRevision(false);
  }
};

const handleRechazar = async () => {
  if (!observacionesRechazo.trim()) return;
  try {
    setProcesandoRevision(true);
    await toma5Service.rechazarToma5(tarea.toma5.id, observacionesRechazo);
    setMostrarModalRechazar(false);
    setObservacionesRechazo('');
    await cargarTarea();
  } catch (err) {
    alert(err.mensaje || 'Error al rechazar el Toma 5');
  } finally {
    setProcesandoRevision(false);
  }
};


  const handleCancelar = async () => {
    if (!motivoCancelacion.trim()) return;
    try {
      setCancelando(true);
      await tareasService.cancelarTarea(id, motivoCancelacion);
      setMostrarModalCancelar(false);
      await cargarTarea(); // Recargar para mostrar estado actualizado
    } catch (err) {
      console.error('Error al cancelar:', err);
      alert(err.response?.data?.mensaje || 'Error al cancelar la tarea');
    } finally {
      setCancelando(false);
    }
  };

  /**
   * Formatear fecha sin problema de zona horaria
   */
  const formatearFecha = (fechaStr) => {
    if (!fechaStr) return '-';
    const partes = fechaStr.split('T')[0].split('-');
    const fecha = new Date(parseInt(partes[0]), parseInt(partes[1]) - 1, parseInt(partes[2]));
    return fecha.toLocaleDateString('es-CO', {
      weekday: 'long', day: '2-digit', month: 'long', year: 'numeric'
    });
  };

  const formatearHora = (fechaStr) => {
    if (!fechaStr) return '-';
    return new Date(fechaStr).toLocaleString('es-CO', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

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

  const puedeSerCancelada = (estado) => {
    return estado === ESTADOS_TAREA.PENDIENTE ||
           estado === ESTADOS_TAREA.TOMA5_ENVIADO ||
           estado === ESTADOS_TAREA.EN_REVISION ||
           estado === ESTADOS_TAREA.PENDIENTE_ASST;
  };

  // ─── LOADING ────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
        <p className="ml-4 text-gray-500">Cargando tarea...</p>
      </div>
    );
  }

  // ─── ERROR ──────────────────────────────────────────────────
  if (error || !tarea) {
    return (
      <div className="text-center py-16">
        <FiAlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <p className="text-gray-600 text-lg mb-4">{error || 'Tarea no encontrada'}</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="bg-blue-900 text-white px-6 py-2 rounded-lg hover:bg-blue-800"
        >
          Volver al Dashboard
        </button>
      </div>
    );
  }

  // ─── DETALLE ────────────────────────────────────────────────
  return (
    <div className="max-w-4xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <FiArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Detalle de Tarea #{tarea.id}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Creada el {formatearHora(tarea.creadaEn)}
            </p>
          </div>
        </div>
        <Badge variant={getBadgeVariant(tarea.estado)}>
          {getEstadoTexto(tarea.estado)}
        </Badge>
      </div>

      {/* Tarjeta principal */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">
          Información General
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Descripción */}
          <div className="md:col-span-2">
            <div className="flex items-start space-x-3">
              <FiFileText className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-500 font-medium">Descripción</p>
                <p className="text-gray-800 font-semibold text-lg mt-1">
                  {tarea.descripcion}
                </p>
              </div>
            </div>
          </div>

          {/* Lugar */}
          <div className="flex items-start space-x-3">
            <FiMapPin className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-500 font-medium">Lugar</p>
              <p className="text-gray-800 mt-1">{tarea.lugar || 'No especificado'}</p>
            </div>
          </div>

          {/* Fecha */}
          <div className="flex items-start space-x-3">
            <FiCalendar className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-500 font-medium">Fecha de la Tarea</p>
              <p className="text-gray-800 mt-1 capitalize">
                {formatearFecha(tarea.fechaTarea)}
              </p>
            </div>
          </div>

          {/* Creada por */}
          <div className="flex items-start space-x-3">
            <FiClock className="w-5 h-5 text-purple-500 mt-1 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-500 font-medium">Origen</p>
              <p className="text-gray-800 mt-1">
                {tarea.creadaPorTrabajador ? 'Creada por el trabajador' : 'Asignada por supervisor'}
              </p>
            </div>
          </div>

          {/* Cancelación */}
          {tarea.canceladaPor && (
            <div className="flex items-start space-x-3">
              <FiXCircle className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-500 font-medium">Cancelada por</p>
                <p className="text-gray-800 mt-1">{tarea.canceladaPor}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Trabajador y Supervisor */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

        {/* Trabajador */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2 flex items-center space-x-2">
            <FiUser className="w-5 h-5 text-blue-600" />
            <span>Trabajador</span>
          </h2>
          {tarea.trabajador ? (
            <div className="space-y-2">
              <p className="font-semibold text-gray-800 text-lg">
                {tarea.trabajador.nombreCompleto}
              </p>
              <p className="text-gray-500 text-sm">
                Cédula: <span className="text-gray-700">{tarea.trabajador.cedula}</span>
              </p>
              <p className="text-gray-500 text-sm">
                Turno: <span className="font-medium text-blue-700">{tarea.trabajador.turno}</span>
              </p>
            </div>
          ) : (
            <p className="text-gray-400 italic">Sin trabajador asignado</p>
          )}
        </div>

        {/* Supervisor */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2 flex items-center space-x-2">
            <FiUser className="w-5 h-5 text-green-600" />
            <span>Supervisor</span>
          </h2>
          {tarea.supervisor ? (
            <div className="space-y-2">
              <p className="font-semibold text-gray-800 text-lg">
                {tarea.supervisor.nombreCompleto}
              </p>
              <p className="text-gray-500 text-sm">
                Cédula: <span className="text-gray-700">{tarea.supervisor.cedula}</span>
              </p>
            </div>
          ) : (
            <p className="text-gray-400 italic">Sin supervisor asignado</p>
          )}
        </div>
      </div>

      {/* Toma 5 */}
<div className="bg-white rounded-lg shadow-md p-6 mb-6">
  <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2 flex items-center space-x-2">
    <FiCheckCircle className="w-5 h-5 text-orange-500" />
    <span>Toma 5</span>
  </h2>

  {tarea.toma5 ? (
    <div className="space-y-4">

      {/* Estado aprobación */}
      <div className="flex items-center space-x-3">
        <span className="text-sm text-gray-500">Estado:</span>
        <Badge variant={
          tarea.toma5.aprobado === true ? 'success' :
          tarea.toma5.aprobado === false ? 'danger' : 'warning'
        }>
          {tarea.toma5.aprobado === true ? '✅ Aprobado' :
           tarea.toma5.aprobado === false ? '❌ Rechazado' :
           '⏳ Pendiente de revisión'}
        </Badge>
      </div>

      {tarea.toma5.fechaDiligenciamiento && (
  <p className="text-xs text-gray-400">
    📅 Diligenciado el {formatearHora(tarea.toma5.fechaDiligenciamiento)}
  </p>
)}


      {/* Procedimiento */}
      {tarea.toma5.procedimiento && (
        <p className="text-sm text-gray-600">
          <span className="font-medium">Procedimiento:</span>{' '}
          {tarea.toma5.procedimiento.nombre}
        </p>
      )}

      {/* Requiere ASST */}
      <div className="flex items-center space-x-2">
        <FiCamera className="w-4 h-4 text-gray-500" />
        <span className="text-sm text-gray-600">
          ASST: {tarea.toma5.requiereAsst ? 'Requerido' : 'No requerido'}
        </span>
      </div>

      {/* Peligros adicionales */}
      {tarea.toma5.peligrosAdicionales && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm font-medium text-red-800">⚠️ Peligros adicionales:</p>
          <p className="text-sm text-red-700 mt-1">{tarea.toma5.peligrosAdicionales}</p>
        </div>
      )}

      {/* Comentarios del trabajador */}
      {tarea.toma5.comentarios && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm font-medium text-blue-800">💬 Comentarios del trabajador:</p>
          <p className="text-sm text-blue-700 mt-1">{tarea.toma5.comentarios}</p>
        </div>
      )}

      {/* Observaciones del supervisor (si fue rechazado) */}
      {tarea.toma5.observacionesSupervisor && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <p className="text-sm font-medium text-yellow-800">📋 Observaciones del supervisor:</p>
          <p className="text-sm text-yellow-700 mt-1">{tarea.toma5.observacionesSupervisor}</p>
        </div>
      )}

      {/* Respuestas del formulario */}
{tarea.toma5.respuestas && tarea.toma5.respuestas.length > 0 && (
  <div className="border-t pt-4 mt-2">
    <h3 className="text-sm font-semibold text-gray-700 mb-3">
      📋 Respuestas del formulario
    </h3>
    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map((numPaso) => {
        const respuestasDePaso = tarea.toma5.respuestas.filter(r => r.paso === numPaso);
        if (respuestasDePaso.length === 0) return null;
        return (
          <div key={numPaso} className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs font-bold text-gray-600 uppercase mb-2">
              {PREGUNTAS_TOMA5[numPaso]?.titulo || `Paso ${numPaso}`}
            </p>
            <div className="space-y-1">
              {respuestasDePaso.map((r) => (
                <div key={r.id} className="flex items-start space-x-2">
                  <span className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                    r.respuesta
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {r.respuesta ? '✓' : '✗'}
                  </span>
                  <span className="text-xs text-gray-700 leading-5">
                    {obtenerTextoPregunta(r.paso, r.pregunta)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  </div>
)}


      {/* Botones aprobar / rechazar — solo si está pendiente de revisión */}
      {tarea.toma5.aprobado === null && (
        <div className="flex space-x-3 pt-2 border-t">
          <button
            onClick={handleAprobar}
            disabled={procesandoRevision}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg flex items-center justify-center space-x-2 disabled:opacity-50 transition-colors"
          >
            {procesandoRevision ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
            ) : (
              <FiCheckCircle className="w-4 h-4" />
            )}
            <span>Aprobar Toma 5</span>
          </button>
          <button
            onClick={() => setMostrarModalRechazar(true)}
            disabled={procesandoRevision}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg flex items-center justify-center space-x-2 disabled:opacity-50 transition-colors"
          >
            <FiXCircle className="w-4 h-4" />
            <span>Rechazar Toma 5</span>
          </button>
        </div>
      )}

      {/* FOTOS ASST */}
      {tarea.toma5.requiereAsst && (
        <div className="mt-2 border-t pt-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center space-x-2">
            <FiCamera className="w-4 h-4 text-orange-500" />
            <span>Fotografías ASST</span>
          </h3>
          {tarea.toma5.asst ? (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Foto 1</p>
                <img
                  src={tarea.toma5.asst.foto1Url}
                  alt="ASST Foto 1"
                  className="w-full rounded-lg border border-gray-200 object-cover"
                  style={{ maxHeight: '200px' }}
                />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Foto 2</p>
                <img
                  src={tarea.toma5.asst.foto2Url}
                  alt="ASST Foto 2"
                  className="w-full rounded-lg border border-gray-200 object-cover"
                  style={{ maxHeight: '200px' }}
                />
              </div>
              <p className="col-span-2 text-xs text-gray-400">
                Subidas el {formatearHora(tarea.toma5.asst.fechaCarga)}
              </p>
            </div>
          ) : (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
              <p className="text-sm text-orange-700">
                ⏳ El trabajador aún no ha subido las fotografías del ASST
              </p>
            </div>
          )}
        </div>
      )}

    </div>
  ) : (
    <div className="text-center py-6">
      <FiFileText className="w-10 h-10 text-gray-300 mx-auto mb-2" />
      <p className="text-gray-400 italic">
        El trabajador aún no ha enviado el Toma 5
      </p>
    </div>
  )}
</div>

      {/* Acciones */}
      {puedeSerCancelada(tarea.estado) && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">
            Acciones
          </h2>
          <button
            onClick={() => setMostrarModalCancelar(true)}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <FiXCircle className="w-5 h-5" />
            <span>Cancelar Tarea</span>
          </button>
        </div>
      )}

      {/* Modal Cancelar */}
      {mostrarModalCancelar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Cancelar Tarea</h3>
            <p className="text-gray-500 text-sm mb-4">
              Esta acción notificará al trabajador. Indica el motivo de la cancelación.
            </p>
            <textarea
              value={motivoCancelacion}
              onChange={(e) => setMotivoCancelacion(e.target.value)}
              placeholder="Escribe el motivo de la cancelación..."
              className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-red-300 focus:border-red-400 resize-none"
              rows={3}
            />
            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={() => { setMostrarModalCancelar(false); setMotivoCancelacion(''); }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
                disabled={cancelando}
              >
                No cancelar
              </button>
              <button
                onClick={handleCancelar}
                disabled={!motivoCancelacion.trim() || cancelando}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {cancelando && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                )}
                <span>{cancelando ? 'Cancelando...' : 'Sí, cancelar tarea'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal Rechazar Toma5 */}
{mostrarModalRechazar && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
      <h3 className="text-lg font-bold text-gray-800 mb-2">Rechazar Toma 5</h3>
      <p className="text-gray-500 text-sm mb-4">
        El trabajador recibirá una notificación y deberá rediligenciar el formulario.
      </p>
      <textarea
        value={observacionesRechazo}
        onChange={(e) => setObservacionesRechazo(e.target.value)}
        placeholder="Escribe las observaciones del rechazo..."
        className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-red-300 focus:border-red-400 resize-none"
        rows={3}
      />
      <div className="flex justify-end space-x-3 mt-4">
        <button
          onClick={() => { setMostrarModalRechazar(false); setObservacionesRechazo(''); }}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
          disabled={procesandoRevision}
        >
          Cancelar
        </button>
        <button
          onClick={handleRechazar}
          disabled={!observacionesRechazo.trim() || procesandoRevision}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center space-x-2"
        >
          {procesandoRevision && (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
          )}
          <span>{procesandoRevision ? 'Rechazando...' : 'Confirmar rechazo'}</span>
        </button>
      </div>
    </div>
  </div>
)}


    </div>
  );
}

export default DetalleTarea;
