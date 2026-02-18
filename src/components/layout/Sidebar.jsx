import { NavLink } from 'react-router-dom';
import { 
  FiHome, 
  FiUsers, 
  FiPlusCircle, 
  FiClock, 
  FiX 
} from 'react-icons/fi';

function Sidebar({ isOpen, onClose }) {
  const menuItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: FiHome,
    },
    {
      name: 'Trabajadores',
      path: '/trabajadores',
      icon: FiUsers,
    },
    {
      name: 'Crear Tarea',
      path: '/crear-tarea',
      icon: FiPlusCircle,
    },
    {
      name: 'Historial',
      path: '/historial',
      icon: FiClock,
    },
  ];

  return (
    <>
      {/* Overlay para móvil */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white shadow-lg z-40
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        {/* Close button (solo móvil) */}
        <button
          onClick={onClose}
          className="lg:hidden absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100"
        >
          <FiX className="w-5 h-5 text-gray-600" />
        </button>

        {/* Menu items */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-900 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50">
          <p className="text-xs text-gray-600 text-center">
            Versión 1.0.0
          </p>
          <p className="text-xs text-gray-500 text-center mt-1">
            © 2026 Cerrejón
          </p>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
