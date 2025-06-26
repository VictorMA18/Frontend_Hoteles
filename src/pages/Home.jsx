import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  MapPin,
  Users,
  Star,
  Wifi,
  Car,
  Coffee,
  Search,
  User,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />

      {/* Hero */}
      <section className="relative h-[600px]">
        <img
          src="/src/assets/hotel-princess.jpg"
          alt="Hotel Princess"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-800/60 to-blue-600/40" />

        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-lg mb-4">
            Bienvenido al Hotel Princess
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8 drop-shadow-sm">
            Experimenta el lujo y la comodidad en el corazón de la ciudad. Tu estadía perfecta te espera.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => setModalOpen(true)}
              className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow"
            >
              Hacer Reserva
            </button>


            <Link
              to="/register"
              className="px-8 py-3 border border-white text-white hover:bg-white hover:text-black rounded-lg transition"
            >
              Crear Cuenta
            </Link>
          </div>
        </div>
      </section>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-xl border border-gray-200 relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>

            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Reserva rápida</h2>

            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              <div>
                <Label htmlFor="nombre" className="block mb-1 text-gray-700">Nombre</Label>
                <Input id="nombre" placeholder="Tu nombre completo" className="w-full" required />
              </div>
              <div>
                <Label htmlFor="dni" className="block mb-1 text-gray-700">DNI</Label>
                <Input id="dni" placeholder="12345678" maxLength={8} pattern="[0-9]{8}" className="w-full" required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="block mb-1 text-gray-700">Check‑in</Label>
                  <Input type="date" className="w-full" required />
                </div>
                <div>
                  <Label className="block mb-1 text-gray-700">Check‑out</Label>
                  <Input type="date" className="w-full" required />
                </div>
              </div>

              <div>
                <Label htmlFor="huespedes" className="block mb-1 text-gray-700">Huéspedes</Label>
                <Input id="huespedes" type="number" min="1" placeholder="Cantidad" className="w-full" required />
              </div>

              <div>
                <Label htmlFor="habitacion" className="block mb-1 text-gray-700">Tipo de habitación</Label>
                <select id="habitacion" className="w-full h-10 border rounded-md px-2" required>
                  <option value="">Selecciona tipo</option>
                  <option value="estandar">Estándar</option>
                  <option value="doble">Doble</option>
                  <option value="triple">Triple</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg mt-4"
              >
                Buscar Disponibilidad
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Featured Rooms */}
      <section className="py-16">
        <Card className="bg-white/90 backdrop-blur p-6 max-w-4xl mx-auto mb-16 shadow-lg border border-gray-200">
          <CardContent>
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Reserva tu habitación ideal</h2>
              <p className="text-lg text-gray-600">Elige tus fechas y consulta la disponibilidad de nuestras habitaciones.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              {["Habitación", "Check-in", "Check-out", "Huéspedes"].map((label, i) => (
                <div key={i} className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">{label}</label>
                  <div className="relative">
                    {i === 0 && <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />}
                    {i === 1 || i === 2 ? <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" /> : <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400" />}
                    <Input className="pl-10" type={i > 0 ? "date" : "text"} placeholder={i === 0 ? "Habitación Estándar" : ""} readOnly={i === 0} />
                  </div>
                </div>
              ))}
            </div>

            <Button className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg flex items-center justify-center">
              <Search className="mr-2 h-5 w-5" /> Buscar Disponibilidad
            </Button>
          </CardContent>
        </Card>

        {/* Room Cards */}
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Nuestras Habitaciones</h2>
            <p className="text-lg text-gray-600">Descubre nuestras elegantes opciones diseñadas para tu confort.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: "Habitación Matrimonial", price: "S/320", tags: ["WiFi", "Parking", "Desayuno"] },
              { name: "Habitación Doble", price: "S/320", tags: ["WiFi", "Parking", "Desayuno"] },
              { name: "Habitación Triple", price: "S/320", tags: ["WiFi", "Parking", "Desayuno"] },
            ].map((room, idx) => (
              <Card key={idx} className="hover:shadow-2xl transition-shadow rounded-lg overflow-hidden border border-gray-200">
                <div className="relative h-48">
                  <img src="/src/assets/Hoteles.jpeg" alt={room.name} className="w-full h-full object-cover" />
                  {idx === 1 && <Badge className="absolute top-3 left-3 bg-blue-600">Más Popular</Badge>}
                  {idx === 2 && <Badge className="absolute top-3 left-3 bg-yellow-500">Premium</Badge>}
                </div>
                <CardContent>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-lg">{room.name}</h3>
                    <div className="flex items-center text-yellow-400">
                      <Star className="h-4 w-4" />
                      <span className="ml-1 text-sm font-medium">4.8</span>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-3 flex items-center">
                    <MapPin className="h-4 w-4 mr-1" /> Hotel Princess, Perú
                  </p>
                  <div className="flex gap-4 text-sm text-gray-500 mb-4">
                    {room.tags.map((t, i) => (
                      <div key={i} className="flex items-center">
                        {t === "WiFi" && <Wifi className="h-4 w-4 mr-1" />}
                        {t === "Parking" && <Car className="h-4 w-4 mr-1" />}
                        {t === "Desayuno" && <Coffee className="h-4 w-4 mr-1" />}
                        {t}
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-2xl font-bold text-blue-600">{room.price}</span>
                      <span className="text-gray-500 text-sm">/noche</span>
                    </div>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg">
                      Reservar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
