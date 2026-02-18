import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { NotificacionesProvider } from '../context/NotificacionesContext';
import ProtectedRoute from './ProtectedRoute';
import Layout from '../components/layout/Layout';
import DetalleTarea from '../pages/DetalleTarea';

// Páginas
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Trabajadores from '../pages/Trabajadores';
import CrearTarea from '../pages/CrearTarea';
import Historial from '../pages/Historial';

function AppRouter() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificacionesProvider>
          <Routes>
            {/* Ruta pública - Login */}
            <Route path="/login" element={<Login />} />

            {/* Rutas protegidas con Layout */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/trabajadores"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Trabajadores />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/crear-tarea"
              element={
                <ProtectedRoute>
                  <Layout>
                    <CrearTarea />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
  path="/tareas/:id"
  element={
    <ProtectedRoute>
      <Layout>
        <DetalleTarea />
      </Layout>
    </ProtectedRoute>
  }
/>


            <Route
              path="/historial"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Historial />
                  </Layout>
                </ProtectedRoute>
              }
              

            />

            {/* Redirección por defecto */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* Ruta 404 */}
            <Route
              path="*"
              element={
                <div className="min-h-screen flex items-center justify-center bg-gray-100">
                  <div className="text-center">
                    <h1 className="text-6xl font-bold text-gray-300">404</h1>
                    <p className="text-gray-600 mt-4">Página no encontrada</p>
                    <a
                      href="/dashboard"
                      className="mt-6 inline-block bg-blue-900 text-white px-6 py-2 rounded-lg hover:bg-blue-800"
                    >
                      Volver al Dashboard
                    </a>
                  </div>
                </div>
              }
            />
          </Routes>
        </NotificacionesProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default AppRouter;
