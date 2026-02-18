import { useNotificaciones } from '../../hooks/useNotificaciones';
import { FiCheck, FiCheckCircle, FiClock } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

function ListaNotificaciones({ isOpen, onClose }) {
  const { notificaciones, loading, marcarComoLeida, marcarTodasComoLeidas } = useNotificaciones();

  const formatearFecha = (fecha) => {
    try {
      return formatDistanceToNow(new Date(fecha), {
        addSuffix: true,
        locale: es,
      });
    } catch (error) {
      return 'Hace un momento';
    }
  };

  const handleMarcarLeida = (e, notificacionId) => {
    e.stopPropagation();
    marcarComoLeida(notificacionId);
  };

  const handleMarcarTodas = () => {
    marcarTodasComoLeidas();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
      ></div>

      {/* Panel de notificaciones */}
      <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 max-h-[32rem] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-800">
            Notificaciones
          </h3>
          {notificaciones.length > 0 && notificaciones.some(n => !n.leida) && (
            <button
              onClick={handleMarcarTodas}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Marcar todas como leídas
            </button>
          )}
        </div>

        {/* Lista de notificaciones */}
        <div className="overflow-y-auto flex-1">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900 mx-auto"></div>
              <p className="text-sm text-gray-500 mt-2">Cargando...</p>
            </div>
          ) : notificaciones.length === 0 ? (
            <div className="p-8 text-center">
              <FiCheckCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No tienes notificaciones</p>
            </div>
          ) : (
            <div>
              {notificaciones.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${
                    !notif.leida ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => !notif.leida && marcarComoLeida(notif.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 pr-2">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className={`inline-block w-2 h-2 rounded-full ${
                          !notif.leida ? 'bg-blue-600' : 'bg-gray-300'
                        }`}></span>
                        <p className="text-sm font-semibold text-gray-800">
                          {notif.titulo}
                        </p>
                      </div>
                      <p className="text-sm text-gray-600 ml-4">
                        {notif.mensaje}
                      </p>
                      <div className="flex items-center space-x-1 text-xs text-gray-500 mt-2 ml-4">
                        <FiClock className="w-3 h-3" />
                        <span>{formatearFecha(notif.creadaEn)}</span>
                      </div>
                    </div>
                    {!notif.leida && (
                      <button
                        onClick={(e) => handleMarcarLeida(e, notif.id)}
                        className="p-1 rounded hover:bg-blue-100 text-blue-600"
                        title="Marcar como leída"
                      >
                        <FiCheck className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {notificaciones.length > 0 && (
          <div className="p-3 border-t border-gray-200 text-center">
            <button
              onClick={onClose}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Cerrar
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default ListaNotificaciones;
