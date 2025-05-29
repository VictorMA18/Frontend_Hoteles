import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

function Header() {
  return (
    <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <span className="font-bold text-xl text-gray-900">Hotel Princess</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-gray-600 hover:text-purple-600 transition-colors">
            Inicio
          </Link>
          <Link to="/habitaciones" className="text-gray-600 hover:text-purple-600 transition-colors">
            Habitaciones
          </Link>
          <Link to="/ofertas" className="text-gray-600 hover:text-purple-600 transition-colors">
            Ofertas
          </Link>
          <Link to="/contacto" className="text-gray-600 hover:text-purple-600 transition-colors">
            Contacto
          </Link>
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
  )
}

export default Header
