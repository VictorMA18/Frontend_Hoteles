import { useState, useEffect } from "react"
import Header from "../components/HeaderAdmin"
import Hospedaje from "./Hospedaje"
import Reservas from "./Reservas"
import Habitaciones from "./Habitaciones"
import axiosInstance from "@/libs/axiosInstance"
import "../styles/global.css"

const App = () => {
  const [currentPage, setCurrentPage] = useState("hospedaje")
  const [huespedes, setHuespedes] = useState([])
  // Estado de habitaciones, ahora se llenará desde el backend
  const [habitacionesData, setHabitacionesData] = useState({})

  // Función para cargar habitaciones desde el backend
  const fetchHabitaciones = async () => {
    try {
      const response = await axiosInstance.get("http://localhost:8000/api/habitaciones/listar/")
      // Convierte el array a un objeto indexado por número o código de habitación
      const habitacionesObj = {}
      response.data.forEach((hab) => {
        habitacionesObj[hab.numero_habitacion || hab.codigo] = {
          numero: hab.numero_habitacion,
          tipo: hab.tipo_nombre,
          estado: hab.estado_nombre?.toLowerCase() || "desconocido",
          ...hab,
        }
      })
      setHabitacionesData(habitacionesObj)
    } catch (error) {
      console.error("Error al obtener habitaciones:", error)
    }
  }

  // Cargar habitaciones al montar el componente
  useEffect(() => {
    fetchHabitaciones()
  }, [])

  // Refrescar habitaciones cuando se navega a la página de habitaciones
  useEffect(() => {
    if (currentPage === "habitaciones") {
      fetchHabitaciones()
    }
  }, [currentPage])

  // Obtener precios dinámicamente desde habitacionesData
  const roomPrices = Object.values(habitacionesData).reduce((acc, hab) => {
    // Normalizar el tipo para el mapeo
    let tipo = hab.tipo_nombre || hab.tipo;
    if (tipo) tipo = tipo.toLowerCase();
    if (tipo && hab.precio_actual) {
      acc[tipo] = Number(hab.precio_actual);
    }
    return acc;
  }, {});

  // Mapeo de tipos de habitación
  const roomTypeMapping = {
    Matr: "matrimonial",
    Doble: "doble",
    Triple: "triple",
    Suite: "suite",
  }

  const handleNavigate = (page) => {
    setCurrentPage(page)
  }

  // Función para actualizar el estado de una habitación
  const actualizarEstadoHabitacion = (numeroHabitacion, nuevoEstado) => {
    setHabitacionesData((prev) => ({
      ...prev,
      [numeroHabitacion]: {
        ...prev[numeroHabitacion],
        estado: nuevoEstado,
      },
    }))
  }

  // Función para registrar un huésped y actualizar el estado de la habitación
  const registrarHuesped = (datosHuesped) => {
    // Agregar el huésped a la lista
    setHuespedes((prev) => [...prev, datosHuesped])
    // Actualizar el estado de la habitación a ocupada
    actualizarEstadoHabitacion(datosHuesped.habitacion, "ocupada")
  }

  // Función para hacer checkout de huéspedes
  const checkoutHuespedes = (idsHuespedes) => {
    const ahora = new Date()
    // Obtener las habitaciones que se van a liberar
    const habitacionesALiberar = huespedes
      .filter((huesped) => idsHuespedes.includes(huesped.id))
      .map((huesped) => huesped.habitacion)

    // Actualizar el estado de los huéspedes
    setHuespedes((prev) =>
      prev.map((huesped) =>
        idsHuespedes.includes(huesped.id)
          ? {
              ...huesped,
              estancia: "finalizada",
              fechaSalida: ahora.toLocaleDateString("es-PE"),
              horaSalida: ahora.toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" }),
            }
          : huesped,
      ),
    )

    // Actualizar el estado de las habitaciones a limpieza
    habitacionesALiberar.forEach((habitacion) => {
      actualizarEstadoHabitacion(habitacion, "limpieza")
    })
  }

  // Función para confirmar reservas y pasarlas a hospedaje
  const confirmarReservas = (reservasConfirmadas) => {
    const ahora = new Date()

    reservasConfirmadas.forEach((reserva) => {
      // Para reservas de múltiples días, crear entrada por el primer día
      const montoPorDia = reserva.montoTotal / reserva.dias

      const nuevoHuesped = {
        id: `reserva-${reserva.id}-dia-1`,
        nombre: reserva.nombre,
        dni: reserva.dni,
        habitacion: reserva.habitacion,
        medioPago: reserva.pago ? "pagado" : "pendiente",
        monto: montoPorDia,
        estancia: "activa",
        pagado: reserva.pago,
        descuento: reserva.descuento,
        huespedes: reserva.huespedes,
        fechaEntrada: reserva.entrada,
        horaEntrada: ahora.toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" }),
        fechaSalida: "",
        horaSalida: "",
        usuario: "Admin",
        reservaOriginal: reserva.id,
        diaActual: 1,
        diasTotal: reserva.dias,
        fechaFinReserva: reserva.salida,
      }

      // Agregar huésped a hospedaje
      setHuespedes((prev) => [...prev, nuevoHuesped])

      // Actualizar estado de habitación
      actualizarEstadoHabitacion(reserva.habitacion, "ocupada")

      // Si la reserva es de múltiples días, programar las renovaciones automáticas
      if (reserva.dias > 1) {
        programarRenovacionesAutomaticas(reserva, montoPorDia)
      }
    })
  }

  // Función para programar renovaciones automáticas (simulada)
  const programarRenovacionesAutomaticas = (reserva, montoPorDia) => {
    // En una implementación real, esto se haría con un sistema de cron jobs o similar
    // Por ahora, solo registramos que se debe hacer
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "hospedaje":
        return (
          <Hospedaje
            huespedes={huespedes}
            setHuespedes={setHuespedes}
            habitacionesData={habitacionesData}
            onRegistrarHuesped={registrarHuesped}
            onCheckoutHuespedes={checkoutHuespedes}
          />
        )
      case "reservas":
        return (
          <Reservas
            habitacionesData={habitacionesData}
            roomPrices={roomPrices}
            roomTypeMapping={roomTypeMapping}
            onConfirmarReservas={confirmarReservas}
          />
        )
      case "habitaciones":
        return <Habitaciones habitacionesData={habitacionesData} onActualizarEstado={actualizarEstadoHabitacion} fetchHabitaciones={fetchHabitaciones} />
      default:
        return <Hospedaje />
    }
  }

  return (
    <div className="app-container">
      <Header currentPage={currentPage} onNavigate={handleNavigate} />
      <main
        className="main-content"
        style={{
          background: "linear-gradient(135deg, #e3f2fd 0%, #e8eaf6 100%)",
        }}
      >
        {renderCurrentPage()}
      </main>
    </div>
  )
}

export default App