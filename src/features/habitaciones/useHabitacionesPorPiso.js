import { useEffect, useState } from 'react';
import axiosInstance from '@/libs/axiosInstance';

export function useHabitacionesPorPiso() {
  const [habitacionesPorPiso, setHabitacionesPorPiso] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchHabitaciones() {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get('http://localhost:8000/api/habitaciones/listar/');
        // Agrupar habitaciones por piso
        const agrupadas = {};
        response.data.forEach((hab) => {
          const piso = hab.piso ? `Piso ${hab.piso}` : 'Sin piso';
          if (!agrupadas[piso]) agrupadas[piso] = [];
          agrupadas[piso].push(hab);
        });
        setHabitacionesPorPiso(agrupadas);
      } catch (err) {
        setError('No se pudieron cargar las habitaciones');
      } finally {
        setLoading(false);
      }
    }
    fetchHabitaciones();
  }, []);

  return { habitacionesPorPiso, loading, error };
}
