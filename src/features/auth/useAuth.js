import { useState } from 'react'
import axios from 'axios'

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return Boolean(localStorage.getItem('token'))
  })

  const login = async (dni, password) => {
    try {
      const response = await axios.post('http://localhost:8000/huespedes/login/', {
        dni,
        password,
      })
      localStorage.setItem('token', response.data.token)
      setIsAuthenticated(true)
      return { success: true }
    } catch (error) {
      setIsAuthenticated(false)
      return { success: false, error: error.response?.data?.detail || 'Error de autenticación' }
    }
  }

  const logout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('token')
  }

  return { isAuthenticated, login, logout }
}
