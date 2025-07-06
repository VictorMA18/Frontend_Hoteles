import { useState } from 'react'
import axios from 'axios'

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return Boolean(localStorage.getItem('access'))
  })

  const login = async (dni, password) => {
    try {
      const response = await axios.post('http://localhost:8000/api/usuarios/login/', {
        dni,
        password,
      })
      // Guardar tokens y datos de usuario según la nueva respuesta
      localStorage.setItem('access', response.data.access)
      localStorage.setItem('refresh', response.data.refresh)
      localStorage.setItem('usuario', JSON.stringify(response.data.user))
      setIsAuthenticated(true)
      return { success: true }
    } catch (error) {
      setIsAuthenticated(false)
      return { success: false, error: error.response?.data?.detail || 'Error de autenticación' }
    }
  }

  const logout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
    localStorage.removeItem('usuario')
  }

  return { isAuthenticated, login, logout }
}
