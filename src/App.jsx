import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Hospedaje from './pages/Hospedaje'
import NotFound from './pages/NotFound'
import Login from './pages/Login'
import Register from './pages/Register'
import ProtectedRoute from '@/components/common/ProtectedRoute'
import Huesped from './pages/Huesped'
import ReservationPage from './pages/Reservation'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/home" element={<Home />} />
      <Route path="/hospedaje" element={<Hospedaje />} />
      <Route path="/homeusuario" element={
        <ProtectedRoute>
          <Huesped />
        </ProtectedRoute>
      } />
      <Route path="/reservation" element={
        <ProtectedRoute>
          <ReservationPage />
        </ProtectedRoute>
      } />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
