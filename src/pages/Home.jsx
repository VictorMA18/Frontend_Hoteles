import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Star, Wifi, Car, Coffee, Dumbbell, Search, Menu, User } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

function App() {
  return (
    <div className="min-h-screen bg-white min-w-[480px]">
      {/* Header */}
      <Header />
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-bl from-blue-600/30 to-blue-800/20 z-10"></div>
        <img
          src="/src/assets/hotel-princess.jpg"
          alt="Hotel Princess - Lujo y elegancia"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Bienvenido al Hotel Princess</h1>

          <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
            Experimenta el lujo y la comodidad en el corazón de la ciudad. Tu estadía perfecta te espera.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button size="lg" className="text-lg px-8 py-3 bg-blue-600 hover:bg-blue-700 max-w-48">
              <Link href="/reservas">Hacer Reserva</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-3 bg-white/10 border-white text-white hover:bg-white hover:text-black max-w-48"
            >
              <Link href="/register">Crear Cuenta</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Rooms */}
      <section className="py-16 bg-gray-50">
        {/* Search Form */}
        <Card className="bg-white/95 backdrop-blur p-6 max-w-4xl mx-auto mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 ">
              Reserva tu habitación ideal
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Elige tus fechas y consulta la disponibilidad de nuestras habitaciones.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Habitacion</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Habitacion Estandar"
                  value="Habitacion Estandar"
                  className="pl-10"
                  readOnly
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Check-in</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input type="date" className="pl-10" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Check-out</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input type="date" className="pl-10" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Huéspedes</label>
              <div className="relative">
                <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input placeholder="2 adultos" className="pl-10" />
              </div>
            </div>
          </div>
          <Button className="w-full mt-6 bg-blue-600 hover:bg-blue-700 h-12 text-lg">
            <Search className="mr-2 h-5 w-5" />
            Buscar Disponibilidad
          </Button>
        </Card>

        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 ">Nuestras Habitaciones</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Descubre nuestras elegantes habitaciones diseñadas para tu máximo confort
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: "Habitación Matrimonial", price: "S/320", type: "standard" },
              { name: "Habitación Doble", price: "S/320", type: "deluxe" },
              { name: "Habitacion Triple", price: "S/320", type: "executive" },
            ].map((room, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <img
                    src="/src/assets/Hoteles.jpeg"
                    alt={room.name}
                    className="w-full h-full object-cover"
                  />
                  {index === 1 && <Badge className="absolute top-3 left-3 bg-blue-600">Más Popular</Badge>}
                  {index === 4 && <Badge className="absolute top-3 left-3 bg-gold-600">Premium</Badge>}
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-lg">{room.name}</h3>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="ml-1 text-sm font-medium">4.8</span>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-3 flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    Hotel Princess, peru
                  </p>
                  <div className="flex items-center space-x-4 mb-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Wifi className="h-4 w-4 mr-1" />
                      WiFi
                    </div>
                    <div className="flex items-center">
                      <Car className="h-4 w-4 mr-1" />
                      Parking
                    </div>
                    <div className="flex items-center">
                      <Coffee className="h-4 w-4 mr-1" />
                      Desayuno
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-blue-600">{room.price}</span>
                      <span className="text-gray-500 text-sm">/noche</span>
                    </div>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      Reservar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              ¿Por qué elegir Hotel Princess?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Ofrecemos la mejor experiencia hotelera con servicios de lujo y atención personalizada
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Reserva Fácil</h3>
              <p className="text-gray-600">Sistema de reservas online simple y seguro para tu comodidad</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Calidad Premium</h3>
              <p className="text-gray-600">Hotel de 5 estrellas con los más altos estándares de calidad</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Atención 24/7</h3>
              <p className="text-gray-600">Servicio al cliente disponible las 24 horas para asistirte</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
