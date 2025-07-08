import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Calendar,
  BedDouble,
  User,
  IdCard,
  ChevronDown,
  ChevronUp,
  Hotel,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/useAuth";
import { useReservasUsuario } from "@/features/reservas/useReservasUsuario";
import axiosInstance from "@/libs/axiosInstance";

function Huesped() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [mostrarHistorial, setMostrarHistorial] = useState(true); // Lo dejamos abierto por defecto
  
  // Obtener datos del usuario autenticado desde localStorage
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  // Simulación de una reserva actual (puedes adaptar esto a tu modelo real)
  const datosHuesped = {
    nombre: usuario ? `${usuario.nombres} ${usuario.apellidos}` : "-",
    dni: usuario ? usuario.dni : "-",
    email: usuario ? usuario.email : "-",
    celular: usuario ? usuario.celular : "-",
    rol: usuario ? usuario.rol : "-",
    fechaIngreso: usuario.created_at, // Puedes reemplazar por datos reales si los tienes
    fechaSalida: usuario.updated_at,
    tipoHabitacion: "Doble",
    estado: "Confirmado",
  };

  // Hook para obtener reservas del usuario
  const { reservas, loading, error } = useReservasUsuario();

  // Diccionarios para mapear ids a nombres legibles
  const TIPOS_RESERVA = {
    1: "Reserva Presencial",
    2: "Reserva Online",
  };
  const ESTADOS_RESERVA = {
    1: "Pendiente",
    2: "Confirmado",
    3: "Cancelado",
    4: "Finalizado",
    // Agrega más según tu modelo
  };

  // Lógica para cancelar reserva
  const handleCancelarReserva = async (reservaId) => {
    if (!window.confirm("¿Seguro que deseas cancelar esta reserva?")) return;
    try {
      await axiosInstance.post(
        `http://localhost:8000/api/reservas/${reservaId}/cancelar/`
      );
      alert("Reserva cancelada correctamente.");
      window.location.reload(); // O puedes refrescar solo las reservas si prefieres
    } catch (err) {
      alert("Error al cancelar la reserva. Intenta nuevamente.");
    }
  };


  const handlePagar = async (cuentaId) => {
    try {
      // Obtener el token del usuario autenticado (si aplica)
      const usuario = JSON.parse(localStorage.getItem("usuario") || "{}")
      const token = usuario?.access || usuario?.token || ""
      const response = await fetch(
        `http://localhost:8000/api/pagos/pagar/${cuentaId}/`,
        {
          method: "GET",
          credentials: "include",
          headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        }
      );
      const data = await response.json();
      if (data.checkout_url) {
        // Redirige directamente a Stripe, no uses fetch a la URL de Stripe
        window.location.href = data.checkout_url;
      } else {
        alert("⚠️ No se pudo obtener la URL de pago. Intenta nuevamente.");
      }
    } catch (error) {
      console.error("Error al intentar pagar:", error);
      alert("❌ Ocurrió un error al iniciar el pago.");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-6xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold text-blue-700 mb-6">
          <span>Bienvenido, {datosHuesped.nombre}</span>
          <Button
            onClick={handleLogout}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md text-sm font-semibold ml-4"
          >
            Cerrar sesión
          </Button>
        </h1>

        <div className="flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0">
          {/* Información actual */}
          <section className="md:w-1/2 bg-white rounded-lg shadow-md p-6 space-y-4">
            <div className="flex items-center space-x-3 text-gray-700">
              <User className="w-5 h-5 text-blue-600" />
              <span className="font-medium">{datosHuesped.nombre}</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-700">
              <IdCard className="w-5 h-5 text-blue-600" />
              <span>DNI: {datosHuesped.dni}</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-700">
              <span className="font-semibold">Email:</span>
              <span>{datosHuesped.email || "-"}</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-700">
              <span className="font-semibold">Celular:</span>
              <span>{datosHuesped.celular || "-"}</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-700">
              <span className="font-semibold">Rol:</span>
              <span>{datosHuesped.rol}</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-700">
              <Calendar className="w-5 h-5 text-blue-600" />
              <span>Ingreso: {new Date(datosHuesped.fechaIngreso).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-700">
              <Calendar className="w-5 h-5 text-blue-600" />
              <span>Salida: {new Date(datosHuesped.fechaSalida).toLocaleDateString()}</span>
            </div>

            <div className="pt-4">
              <Button
                onClick={() => navigate("/reservation")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
              >
                <Hotel className="mr-2 w-4 h-4" />
                Hacer nueva reserva
              </Button>
            </div>
          </section>

          {/* Historial al lado */}
          <section className="md:w-1/2 bg-white rounded-lg shadow-md p-6">
            <button
              className="flex items-center text-blue-600 hover:underline mb-4"
              onClick={() => setMostrarHistorial(!mostrarHistorial)}
            >
              {mostrarHistorial ? (
                <ChevronUp className="w-5 h-5 mr-1" />
              ) : (
                <ChevronDown className="w-5 h-5 mr-1" />
              )}
              {mostrarHistorial
                ? "Ocultar historial de reservas"
                : "Ver historial de reservas"}
            </button>

            {mostrarHistorial && (
              <>
                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                  Reservas anteriores
                </h2>
                <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
                  {loading ? (
                    <p className="text-gray-500">Cargando reservas...</p>
                  ) : error ? (
                    <p className="text-red-500">{error}</p>
                  ) : reservas.length === 0 ? (
                    <p className="text-gray-500">No tienes reservas anteriores.</p>
                  ) : (
                    <ul className="space-y-3">
                      {reservas.map((reserva) => {
                        // Obtener nombre legible para tipo y estado
                        let tipoReserva =
                          reserva.tipo_reserva_nombre ||
                          TIPOS_RESERVA[reserva.id_tipo_reserva] ||
                          reserva.id_tipo_reserva ||
                          "-";
                        let nombreEstado =
                          reserva.estado_reserva_nombre ||
                          ESTADOS_RESERVA[reserva.id_estado_reserva] ||
                          reserva.id_estado_reserva ||
                          "-";
                        // Definir colores para los estados de reserva
                        let colorEstado = "text-gray-600";
                        if (typeof nombreEstado !== "string") {
                          nombreEstado = String(nombreEstado ?? "-");
                        }
                        switch (nombreEstado.toLowerCase()) {
                          case "pendiente":
                            colorEstado = "text-yellow-500"; // Amarillo
                            break;
                          case "confirmado":
                            colorEstado = "text-green-600"; // Verde
                            break;
                          case "cancelado":
                            colorEstado = "text-red-600"; // Rojo
                            break;
                          case "finalizado":
                            colorEstado = "text-blue-600"; // Azul
                            break;
                          default:
                            colorEstado = "text-gray-600";
                        }
                        return (
                          <li
                            key={reserva.id}
                            className="border border-gray-200 rounded-md p-3 text-sm text-gray-700 relative"
                          >
                            <p>
                              <span className="font-semibold">Habitación:</span>{" "}
                              {reserva.codigo_habitacion}
                            </p>
                            <p>
                              <span className="font-semibold">Tipo de reserva:</span>{" "}
                              {tipoReserva}
                            </p>
                            <p>
                              <span className="font-semibold">Estado de reserva:</span>{" "}
                              <span className={colorEstado}>{nombreEstado}</span>
                            </p>
                            <p>
                              <span className="font-semibold">Check-in:</span>{" "}
                              {reserva.fecha_checkin_programado
                                ? new Date(
                                    reserva.fecha_checkin_programado
                                  ).toLocaleString()
                                : "-"}
                            </p>
                            <p>
                              <span className="font-semibold">Check-out:</span>{" "}
                              {reserva.fecha_checkout_programado
                                ? new Date(
                                    reserva.fecha_checkout_programado
                                  ).toLocaleString()
                                : "-"}
                            </p>
                            <p>
                              <span className="font-semibold">Huéspedes:</span>{" "}
                              {reserva.numero_huespedes}
                            </p>
                            <p>
                              <span className="font-semibold">Precio por noche:</span>{" "}
                              S/{reserva.precio_noche}
                            </p>
                            <p>
                              <span className="font-semibold">Total noches:</span>{" "}
                              {reserva.total_noches ?? "-"}
                            </p>
                            <p>
                              <span className="font-semibold">Subtotal:</span>{" "}
                              S/{reserva.subtotal ?? "-"}
                            </p>
                            <p>
                              <span className="font-semibold">Total descuento:</span>{" "}
                              S/{typeof reserva.descuento !== 'undefined' && reserva.descuento !== null ? reserva.descuento : '0'}
                            </p>
                            <p>
                              <span className="font-semibold">Total a pagar:</span>{" "}
                              S/{reserva.total_pagar ?? "-"}
                            </p>
                            {reserva.impuestos && Number(reserva.impuestos) > 0 && (
                              <p>
                                <span className="font-semibold">Impuestos:</span>{" "}
                                S/{reserva.impuestos}
                              </p>
                            )}
                            {reserva.observaciones && (
                              <p>
                                <span className="font-semibold">Obs.:</span>{" "}
                                {reserva.observaciones}
                              </p>
                            )}
                            {reserva.estado_reserva_nombre?.toLowerCase() ===
                              "pendiente" ||
                            reserva.id_estado_reserva === 1 ? (
                              <div className="absolute bottom-3 right-3 ">
                                <button
                                  onClick={() => handlePagar("ef17a755-8e75-48d1-8d8d-bc70fbf1fdd7")}
                                  className="bg-blue-600 text-white px-3 py-1 text-xs rounded hover:bg-blue-700 mr-3"
                                >
                                  Pagar
                                </button>
                                <button
                                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-md text-xs font-semibold shadow"
                                  onClick={() => handleCancelarReserva(reserva.id)}
                                  type="button"
                                >
                                  Cancelar reserva
                                </button>
                              </div>
                            ) : null}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              </>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Huesped;
