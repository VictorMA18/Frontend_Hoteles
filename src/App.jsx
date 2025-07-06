"use client"

import { useState } from "react"
import Header from "./components/Header"
import Hospedaje from "./pages/Hospedaje"
import Reservas from "./pages/Reservas"
import Habitaciones from "./pages/Habitaciones"
import Configuracion from "./pages/Configuracion"
import "../styles/global.css"

const App = () => {
  const [currentPage, setCurrentPage] = useState("hospedaje")

  // Estado de huéspedes - MOVIDO AQUÍ PARA PERSISTIR
  const [huespedes, setHuespedes] = useState([])

  const [habitacionesData, setHabitacionesData] = useState({
    // Estado inicial de las habitaciones
    201: { numero: "201", tipo: "Triple", estado: "disponible" },
    202: { numero: "202", tipo: "Suite", estado: "disponible" },
    203: { numero: "203", tipo: "Matr.", estado: "disponible" },
    204: { numero: "204", tipo: "Doble", estado: "disponible" },
    205: { numero: "205", tipo: "Matr.", estado: "disponible" },
    206: { numero: "206", tipo: "Matr.", estado: "disponible" },
    207: { numero: "207", tipo: "Matr.", estado: "disponible" },
    301: { numero: "301", tipo: "Triple", estado: "disponible" },
    302: { numero: "302", tipo: "Suite", estado: "disponible" },
    303: { numero: "303", tipo: "Matr.", estado: "disponible" },
    304: { numero: "304", tipo: "Doble", estado: "disponible" },
    305: { numero: "305", tipo: "Matr.", estado: "disponible" },
    306: { numero: "306", tipo: "Matr.", estado: "disponible" },
    307: { numero: "307", tipo: "Matr.", estado: "disponible" },
    401: { numero: "401", tipo: "Triple", estado: "disponible" },
    402: { numero: "402", tipo: "Suite", estado: "disponible" },
    403: { numero: "403", tipo: "Matr.", estado: "disponible" },
    404: { numero: "404", tipo: "Doble", estado: "disponible" },
    405: { numero: "405", tipo: "Matr.", estado: "disponible" },
    406: { numero: "406", tipo: "Matr.", estado: "disponible" },
    407: { numero: "407", tipo: "Matr.", estado: "disponible" },
  })

  // Configuración de precios por tipo de habitación (desde configuración)
  const roomPrices = {
    matrimonial: 90.0,
    doble: 120.0,
    triple: 150.0,
    suite: 110.0,
  }

  // Mapeo de tipos de habitación
  const roomTypeMapping = {
    "Matr.": "matrimonial",
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
    console.log(`Programando ${reserva.dias - 1} renovaciones automáticas para reserva ${reserva.id}`)
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
        return <Habitaciones habitacionesData={habitacionesData} onActualizarEstado={actualizarEstadoHabitacion} />
      case "configuracion":
        return <Configuracion />
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
