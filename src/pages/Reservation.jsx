import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HotelRooms from './HotelRooms';
import {
  BedSingle,
  BedDouble,
  Users,
  Crown,
  Wifi,
  ParkingCircle,
  Coffee,
} from "lucide-react";

function Reservation() {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalCroquisAbierto, setModalCroquisAbierto] = useState(false);

  const habitacionesPorPiso = {
    "Piso 1": [
      {
        nombre: "Habitación 101",
        descripcion: "Suite de lujo con jacuzzi.",
        estado: "disponible",
        tipo: "suite",
        imagen: "/src/assets/suite1.jpg",
        precio: 420,
        tag: "Premium",
      },
      {
        nombre: "Habitación 102",
        descripcion: "Matrimonial con vista al mar.",
        estado: "ocupado",
        tipo: "matrimonial",
        imagen: "/src/assets/matrimonial.jpg",
        precio: 350,
        tag: null,
      },
      {
        nombre: "Habitación 103",
        descripcion: "Estándar acogedora.",
        estado: "disponible",
        tipo: "estandar",
        imagen: "/src/assets/estandar.jpg",
        precio: 280,
        tag: null,
      },
    ],
    "Piso 2": [
      {
        nombre: "Habitación 201",
        descripcion: "Doble elegante con escritorio.",
        estado: "mantenimiento",
        tipo: "doble",
        imagen: "/src/assets/doble.jpg",
        precio: 320,
        tag: "Más Popular",
      },
      {
        nombre: "Habitación 202",
        descripcion: "Matrimonial con balcón.",
        estado: "disponible",
        tipo: "matrimonial",
        imagen: "/src/assets/matrimonial2.jpg",
        precio: 360,
        tag: null,
      },
      {
        nombre: "Habitación 203",
        descripcion: "Suite presidencial.",
        estado: "ocupado",
        tipo: "suite",
        imagen: "/src/assets/suite2.jpg",
        precio: 500,
        tag: "Premium",
      },
    ],
  };

  const getTipoIcono = (tipo) => {
    switch (tipo) {
      case "suite":
        return <Crown className="w-5 h-5 text-yellow-500" />;
      case "matrimonial":
        return <Users className="w-5 h-5 text-pink-500" />;
      case "doble":
        return <BedDouble className="w-5 h-5 text-blue-500" />;
      case "estandar":
        return <BedSingle className="w-5 h-5 text-gray-500" />;
      default:
        return null;
    }
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case "disponible":
        return "bg-green-500";
      case "ocupado":
        return "bg-red-500";
      case "mantenimiento":
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="relative h-[500px] flex items-center justify-center text-center text-white">
        <img
          src="/src/assets/hotel-princess.jpg"
          alt="Hotel Princess"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
        <div className="absolute inset-0 bg-black/50 z-10" />
        <div className="relative z-20 px-4 max-w-2xl">
          <h1 className="text-5xl font-bold mb-4">Reserva tu estadía</h1>
          <p className="text-lg md:text-xl mb-6">
            Encuentra la habitación perfecta para tu estadía en Hotel Princess.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setModalAbierto(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg shadow-md"
            >
              Hacer Reserva
            </button>
            <button
              onClick={() => setModalCroquisAbierto(true)}
              className="bg-white text-black px-6 py-3 rounded-lg text-lg border border-gray-300 shadow-md hover:bg-gray-100"
            >
              Ver Croquis
            </button>

          </div>
        </div>
      </section>

      {/* Modal */}
      {modalAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl relative border border-gray-200">
            <button
              onClick={() => setModalAbierto(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
              Reserva rápida
            </h2>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <Label htmlFor="nombre">Nombre</Label>
                <Input id="nombre" placeholder="Tu nombre completo" required />
              </div>
              <div>
                <Label htmlFor="dni">DNI</Label>
                <Input
                  id="dni"
                  placeholder="12345678"
                  maxLength={8}
                  pattern="[0-9]{8}"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Check-in</Label>
                  <Input type="date" required />
                </div>
                <div>
                  <Label>Check-out</Label>
                  <Input type="date" required />
                </div>
              </div>
              <div>
                <Label htmlFor="huespedes">Huéspedes</Label>
                <Input
                  id="huespedes"
                  type="number"
                  min="1"
                  placeholder="Cantidad"
                  required
                />
              </div>
              <div>
                <Label htmlFor="habitacion">Tipo de habitación</Label>
                <select
                  id="habitacion"
                  className="w-full h-10 border border-gray-300 rounded-md text-sm px-2"
                  required
                >
                  <option value="">Selecciona tipo</option>
                  <option value="estandar">Estándar</option>
                  <option value="doble">Doble</option>
                  <option value="matrimonial">Matrimonial</option>
                  <option value="suite">Suite</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 mt-2 text-lg text-white py-2 rounded-md font-semibold"
              >
                Buscar Disponibilidad
              </button>
            </form>
          </div>
        </div>
      )}
      {modalCroquisAbierto && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-y-auto relative p-6 scale-[0.90]">
            <button
              onClick={() => setModalCroquisAbierto(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black"
            >
              <X className="w-6 h-6" />
            </button>
            {/* Reutilizamos el componente de habitaciones */}
            <div>
              <HotelRooms />
            </div>
          </div>
        </div>
      )}
      {/* Lista por pisos con estilo tarjeta */}
      <section className="px-6 py-16 bg-gray-50">
        <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
          Nuestras Habitaciones
        </h2>
        <p className="text-center mb-12 text-gray-600 text-lg">
          Descubre nuestras elegantes opciones diseñadas para tu confort.
        </p>
        {Object.entries(habitacionesPorPiso).map(([piso, habitaciones]) => (
          <div key={piso} className="mb-12">
            <h3 className="text-2xl font-semibold text-gray-700 mb-6">
              {piso}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {habitaciones.map((habitacion, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-md overflow-hidden relative"
                >
                  <div
                    className={`h-2 ${getEstadoColor(
                      habitacion.estado
                    )} w-full`}
                  />
                  <div className="relative">
                    <img
                      src={habitacion.imagen}
                      alt={habitacion.nombre}
                      className="w-full h-48 object-cover"
                    />
                    {habitacion.tag && (
                      <span
                        className={`absolute top-3 left-3 px-2 py-1 text-xs font-semibold rounded-md ${
                          habitacion.tag === "Premium"
                            ? "bg-yellow-500 text-white"
                            : "bg-blue-600 text-white"
                        }`}
                      >
                        {habitacion.tag}
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <h4 className="text-lg font-semibold mb-1">
                      {habitacion.nombre}
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Hotel Princess, Perú
                    </p>
                    <p className="text-sm mb-2 font-medium">
                      Estado:{" "}
                      <span
                        className={`${
                          habitacion.estado === "disponible"
                            ? "text-green-600"
                            : habitacion.estado === "ocupado"
                            ? "text-red-600"
                            : "text-gray-600"
                        } capitalize`}
                      >
                        {habitacion.estado}
                      </span>
                    </p>
                    <div className="flex items-center space-x-3 text-sm text-gray-500 mb-3">
                      <Wifi className="w-4 h-4" />
                      <ParkingCircle className="w-4 h-4" />
                      <Coffee className="w-4 h-4" />
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-blue-600 text-xl font-bold">
                        S/{habitacion.precio}
                      </p>
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        Reservar
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      <Footer />
    </div>
  );
}

export default Reservation;
