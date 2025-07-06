import axiosInstance from '@/libs/axiosInstance'

export async function getUsuarioActual() {
  const token = localStorage.getItem('token')
  if (!token) return null
  try {
    const response = await axiosInstance.get('http://localhost:8000/huespedes/perfil/')
    return response.data
  } catch (error) {
    return null
  }
}
