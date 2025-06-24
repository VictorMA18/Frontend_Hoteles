import axios from 'axios'

export async function getUsuarioActual() {
  const token = localStorage.getItem('token')
  if (!token) return null
  try {
    const response = await axios.get('http://localhost:8000/huespedes/perfil/', {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
    return response.data
  } catch (error) {
    return null
  }
}
