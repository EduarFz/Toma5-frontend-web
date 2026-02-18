import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    cedula: '',
    contrasena: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(formData.cedula, formData.contrasena);
      navigate('/dashboard');
    } catch (err) {
      setError(err.mensaje || err.error || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-blue-900 px-8 py-6">
          <h1 className="text-3xl font-bold text-white text-center">
            Sistema Toma 5
          </h1>
          <p className="text-blue-200 text-center mt-2">
            Cerrejón - UAS Equipos de Vías
          </p>
        </div>

        {/* Form */}
        <div className="px-8 py-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Bienvenido
            </h2>
            <p className="text-gray-600 mt-1">
              Ingresa tus credenciales de supervisor
            </p>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Cédula */}
            <div>
              <label
                htmlFor="cedula"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Número de Cédula
              </label>
              <input
                type="text"
                id="cedula"
                name="cedula"
                value={formData.cedula}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                placeholder="Ingresa tu cédula"
                disabled={loading}
              />
            </div>

            {/* Contraseña */}
            <div>
              <label
                htmlFor="contrasena"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Contraseña
              </label>
              <input
                type="password"
                id="contrasena"
                name="contrasena"
                value={formData.contrasena}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                placeholder="Ingresa tu contraseña"
                disabled={loading}
              />
            </div>

            {/* Botón */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-900 hover:bg-blue-800 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Iniciando sesión...
                </>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </form>

          {/* Footer info */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Solo personal autorizado con rol de Supervisor
            </p>
          </div>
        </div>
      </div>

      {/* Credenciales de prueba (solo para desarrollo) */}
      <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-4 max-w-xs">
        <p className="text-xs font-semibold text-gray-700 mb-2">
          🔑 Credenciales de prueba:
        </p>
        <div className="text-xs text-gray-600 space-y-1">
          <p><span className="font-medium">Cédula:</span> 1098765432</p>
          <p><span className="font-medium">Contraseña:</span> nueva123</p>
        </div>
      </div>
    </div>
  );
}

export default Login;
