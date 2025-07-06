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

function Huesped() {
  const navigate = useNavigate();
  const [mostrarHistorial, setMostrarHistorial] = useState(true);

  const datosHuesped = {
    nombre: "Carlos Ruiz",
    dni: "87654321",
    fechaIngreso: "2025-07-10",
    fechaSalida: "2025-07-14",
    tipoHabitacion: "Doble",
    estado: "Confirmado",
  };

  
  const [reservasAnteriores, setReservasAnteriores] = useState([
    {
      id: 1,
      fechaIngreso: "2024-12-20",
      fechaSalida: "2024-12-24",
      tipo: "Matrimonial",
      estado: "Finalizado",
    },
    {
      id: 2,
      fechaIngreso: "2024-08-12",
      fechaSalida: "2024-08-14",
      tipo: "Suite",
      estado: "Finalizado",
    },
    {
      id: 3,
      fechaIngreso: "2024-02-01",
      fechaSalida: "2024-02-03",
      tipo: "Estándar",
      estado: "Cancelado",
    },
    {
      id: 4,
      fechaIngreso: "2025-07-20",
      fechaSalida: "2025-07-22",
      tipo: "Doble",
      estado: "Pendiente",
    },
    {
      id: 5,
      fechaIngreso: "2025-07-25",
      fechaSalida: "2025-07-28",
      tipo: "Suite Premium",
      estado: "Pendiente",
    },
    {
      id: 6,
      fechaIngreso: "2025-08-05",
      fechaSalida: "2025-08-08",
      tipo: "Matrimonial",
      estado: "Pendiente",
    },
    {
      id: 7,
      fechaIngreso: "2025-08-15",
      fechaSalida: "2025-08-18",
      tipo: "Triple",
      estado: "Finalizado",
    },
  ]);


  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-6xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold text-blue-700 mb-6">
          Bienvenido, {datosHuesped.nombre}
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
              <Calendar className="w-5 h-5 text-blue-600" />
              <span>Ingreso: {datosHuesped.fechaIngreso}</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-700">
              <Calendar className="w-5 h-5 text-blue-600" />
              <span>Salida: {datosHuesped.fechaSalida}</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-700">
              <BedDouble className="w-5 h-5 text-blue-600" />
              <span>Habitación: {datosHuesped.tipoHabitacion}</span>
            </div>
            <div className="mt-4 text-green-700 font-semibold">
              Estado de la reserva: {datosHuesped.estado}
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

          {/* Historial */}
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
                <div className="space-y-3 max-h-[260px] overflow-y-auto pr-1 custom-scrollbar">
                  {reservasAnteriores.map((reserva) => (
                    <li
                      key={reserva.id}
                      className="border border-gray-200 rounded-md p-3 text-sm text-gray-700 bg-white"
                    >
                      <p>
                        <span className="font-semibold">Fecha:</span>{" "}
                        {reserva.fechaIngreso} → {reserva.fechaSalida}
                      </p>
                      <p>
                        <span className="font-semibold">Tipo:</span> {reserva.tipo}
                      </p>
                      <p>
                        <span className="font-semibold">Estado:</span>{" "}
                        <span
                          className={
                            reserva.estado === "Finalizado"
                              ? "text-green-600"
                              : reserva.estado === "Cancelado"
                              ? "text-red-600"
                              : "text-yellow-600"
                          }
                        >
                          {reserva.estado}
                        </span>
                      </p>

                      {/* Botones si está pendiente */}
                      {reserva.estado === "Pendiente" && (
                        <div className="mt-2 flex gap-2">
                          <button
                            onClick={() => window.location.href = "https://checkout.stripe.com/pay"} // o tu enlace real
                            className="bg-blue-600 text-white px-3 py-1 text-xs rounded hover:bg-blue-700"
                          >
                            Pagar
                          </button>
                          <button
                            onClick={() =>
                              setReservasAnteriores(prev =>
                                prev.map(r =>
                                  r.id === reserva.id ? { ...r, estado: "Cancelado" } : r
                                )
                              )
                            }
                            className="bg-red-500 text-white px-3 py-1 text-xs rounded hover:bg-red-600"
                          >
                            Cancelar
                          </button>
                        </div>
                      )}
                    </li>
                  ))}
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
