import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Hospedaje from './pages/Hospedaje'
import NotFound from './pages/NotFound'
import Login from './pages/Login'
import Register from './pages/Register'
import ProtectedRoute from '@/components/common/ProtectedRoute'
import Huesped from './pages/Huesped'
import ReservationPage from './pages/Reservation'
import AdminPage from './pages/AdminPage'

function RoleRoute({ allowedRoles, children, redirectTo }) {
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
  const rol = usuario?.rol?.toUpperCase?.() || '';
  if (!allowedRoles.includes(rol)) {
    return <Navigate to={redirectTo} replace />;
  }
  return children;
}

function App() {
  // Obtener usuario autenticado y su rol
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
  const rol = usuario?.rol?.toUpperCase?.() || '';

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/home" element={<Home />} />
      <Route path="/hospedaje" element={<Hospedaje />} />
      <Route path="/homeusuario" element={
        <ProtectedRoute>
          <RoleRoute allowedRoles={['HUESPED']} redirectTo="/admin">
            <Huesped />
          </RoleRoute>
        </ProtectedRoute>
      } />
      <Route path="/reservation" element={
        <ProtectedRoute>
          <RoleRoute allowedRoles={['HUESPED']} redirectTo="/admin">
            <ReservationPage />
          </RoleRoute>
        </ProtectedRoute>
      } />
      <Route path="/admin" element={
        <ProtectedRoute>
          <RoleRoute allowedRoles={['ADMIN', 'RECEPCIONISTA', 'SUPERVISOR']} redirectTo="/homeusuario">
            <AdminPage />
          </RoleRoute>
        </ProtectedRoute>
      } />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
