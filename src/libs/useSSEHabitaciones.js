import { useEffect } from 'react';

export function useSSEHabitaciones(onUpdate) {
  useEffect(() => {
    const evtSource = new EventSource('http://127.0.0.1:8000/api/habitaciones/sse/habitaciones-dashboard/');
    
    evtSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onUpdate(data);  // Llama a tu función para actualizar
      } catch (err) {
        console.error("Error parsing SSE data", err);
      }
    };

    evtSource.onerror = (err) => {
      console.error("SSE connection error", err);
      evtSource.close();
    };

    return () => evtSource.close();
  }, [onUpdate]);
}