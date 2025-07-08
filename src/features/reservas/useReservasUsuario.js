import axiosInstance from '@/libs/axiosInstance';
import { useEffect, useState } from 'react';

export function useReservasUsuario() {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchReservas() {
      setLoading(true);
      setError(null);
      try {
        const access = localStorage.getItem('access');
        const response = await axiosInstance.get('http://localhost:8000/api/reservas/listar/', {
          headers: {
            Authorization: `Bearer ${access}`,
          },
        });
        setReservas(response.data);
      } catch (err) {
        setError('No se pudieron cargar las reservas');
      } finally {
        setLoading(false);
      }
    }
    fetchReservas();
  }, []);

  return { reservas, loading, error };
}
