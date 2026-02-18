import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNotificaciones } from '../../hooks/useNotificaciones';
import { FiBell, FiUser, FiLogOut, FiMenu } from 'react-icons/fi';
import ListaNotificaciones from '../notificaciones/ListaNotificaciones';

function Navbar({ onToggleSidebar }) {
  const { usuario, logout } = useAuth();
  const { noLeidas } = useNotificaciones();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = async () => {
    if (window.confirm('¿Estás seguro que deseas cerrar sesión?')) {
      await logout();
    }
  };

  return (
    <nav className="bg-white shadow-md h-16 fixed top-0 left-0 right-0 z-30">
      <div className="h-full px-4 flex items-center justify-between">
        {/* Left section: Menu button + Logo */}
        <div className="flex items-center space-x-4">
          {/* Mobile menu button */}
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <FiMenu className="w-6 h-6 text-gray-700" />
          </button>

          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="bg-blue-900 text-white font-bold text-xl w-10 h-10 rounded-lg flex items-center justify-center">
              T5
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800 leading-tight">
                Sistema Toma 5
              </h1>
              <p className="text-xs text-gray-500 leading-tight hidden sm:block">
                Cerrejón - Equipos de Vías
              </p>
            </div>
          </div>
        </div>

        {/* Right section: Notifications + Profile */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <FiBell className="w-6 h-6 text-gray-700" />
              {noLeidas > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {noLeidas > 9 ? '9+' : noLeidas}
                </span>
              )}
            </button>

            <ListaNotificaciones
              isOpen={showNotifications}
              onClose={() => setShowNotifications(false)}
            />
          </div>

          {/* Profile menu */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="bg-blue-900 text-white font-semibold w-9 h-9 rounded-full flex items-center justify-center">
                {usuario?.nombreCompleto?.charAt(0) || 'S'}
              </div>
              <div className="text-left hidden md:block">
                <p className="text-sm font-semibold text-gray-800 leading-tight">
                  {usuario?.nombreCompleto || 'Supervisor'}
                </p>
                <p className="text-xs text-gray-500 leading-tight">
                  Supervisor
                </p>
              </div>
            </button>

            {/* Dropdown menu */}
            {showProfileMenu && (
              <>
                {/* Overlay para cerrar el menú */}
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowProfileMenu(false)}
                ></div>

                {/* Menu */}
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <p className="text-sm font-semibold text-gray-800">
                      {usuario?.nombreCompleto}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Cédula: {usuario?.cedula}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      // Navegar a perfil (lo implementaremos después)
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <FiUser className="w-4 h-4" />
                    <span>Mi Perfil</span>
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                  >
                    <FiLogOut className="w-4 h-4" />
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
