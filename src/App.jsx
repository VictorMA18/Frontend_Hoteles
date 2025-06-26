import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Hospedaje from './pages/Hospedaje'
import NotFound from './pages/NotFound'
import Login from './pages/Login'
import Register from './pages/Register'
import HomeUsuario from './pages/HomeUsuario'
import Reservation from './pages/Reservation'
import Huesped from './pages/Huesped'
import ProtectedRoute from '@/components/common/ProtectedRoute'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/home" element={<Home />} />
      <Route path="/hospedaje" element={<Hospedaje />} />
      <Route path="/homeusuario" element={
        <ProtectedRoute>
          <HomeUsuario />
        </ProtectedRoute>
      } />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/reservation" element={<Reservation />} />
      <Route path="/Huesped" element={<Huesped />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
