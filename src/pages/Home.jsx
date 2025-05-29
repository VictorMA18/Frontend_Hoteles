import { Button } from "../../src/components/ui/button"
import { Card, CardContent } from "../../src/components/ui/card"
import { Input } from "../../src/components/ui/Input"
import { Badge } from "../../src/components/ui/badge"
import { Calendar, MapPin, Users, Star, Wifi, Car, Coffee, Dumbbell, Search, Menu, User } from "lucide-react"

function App() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <span className="font-bold text-xl text-gray-900">Hotel Princess</span>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-600 hover:text-purple-600 transition-colors">
              Inicio
            </a>
            <a href="#" className="text-gray-600 hover:text-purple-600 transition-colors">
              Habitaciones
            </a>
            <a href="#" className="text-gray-600 hover:text-purple-600 transition-colors">
              Ofertas
            </a>
            <a href="#" className="text-gray-600 hover:text-purple-600 transition-colors">
              Contacto
            </a>
          </nav>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              Iniciar Sesión
            </Button>
            <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
              Registrarse
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 to-purple-600/60 z-10"></div>
        <img
          src="https://dynamic-media-cdn.tripadvisor.com/media/photo-o/03/e0/04/2f/princess-hostal-tacna.jpg?height=600&width=1200"
          alt="Hotel Princess - Lujo y elegancia"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Bienvenido al Hotel Princess</h1>
          <p className="text-xl md:text-2xl mb-8 text-purple-100">
            Descubre el lujo y la elegancia en cada detalle de tu estancia
          </p>

          {/* Search Form */}
          <Card className="bg-white/95 backdrop-blur p-6 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Habitacion</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input placeholder="Habitacion Estandar" value="Habitacion Estandar" className="pl-10" readOnly />
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
            <Button className="w-full mt-6 bg-purple-600 hover:bg-purple-700 h-12 text-lg">
              <Search className="mr-2 h-5 w-5" />
              Buscar Disponibilidad
            </Button>
          </Card>
        </div>
      </section>

      {/* Featured Rooms */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Nuestras Habitaciones</h2>
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
                    src={`https://www.tangol.com/Fotos/Hospedaje/colca-andina-inn_9400_201912061403191.JPG?height=200&width=300`}
                    alt={room.name}
                    className="w-full h-full object-cover"
                  />
                  {index === 1 && <Badge className="absolute top-3 left-3 bg-purple-600">Más Popular</Badge>}
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
                      <span className="text-2xl font-bold text-purple-600">{room.price}</span>
                      <span className="text-gray-500 text-sm">/noche</span>
                    </div>
                    <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
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
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">¿Por qué elegir Hotel Princess?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Ofrecemos la mejor experiencia hotelera con servicios de lujo y atención personalizada
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Reserva Fácil</h3>
              <p className="text-gray-600">Sistema de reservas online simple y seguro para tu comodidad</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Calidad Premium</h3>
              <p className="text-gray-600">Hotel de 5 estrellas con los más altos estándares de calidad</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Atención 24/7</h3>
              <p className="text-gray-600">Servicio al cliente disponible las 24 horas para asistirte</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">P</span>
                </div>
                <span className="font-bold text-xl">Hotel Princess</span>
              </div>
              <p className="text-gray-400">Tu hotel de confianza para una experiencia de lujo inolvidable en peru.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Enlaces</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Sobre nosotros
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Habitaciones
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Servicios
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Galería
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Soporte</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Centro de ayuda
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contacto
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Términos
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacidad
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contacto</h3>
              <div className="space-y-2 text-gray-400">
                <p>📧 reservas@hotelprincess.com</p>
                <p>📞 +34 900 123 456</p>
                <p>📍 Calle Gran Vía 123, peru</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Hotel Princess. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App