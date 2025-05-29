import { Link } from "react-router-dom"

function Footer() {
  return (
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
            <p className="text-gray-400">Tu hotel de confianza para una experiencia de lujo inolvidable en Madrid.</p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Enlaces</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Sobre nosotros
                </Link>
              </li>
              <li>
                <Link to="/habitaciones" className="hover:text-white transition-colors">
                  Habitaciones
                </Link>
              </li>
              <li>
                <Link to="/servicios" className="hover:text-white transition-colors">
                  Servicios
                </Link>
              </li>
              <li>
                <Link to="/galeria" className="hover:text-white transition-colors">
                  Galería
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Soporte</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link to="/ayuda" className="hover:text-white transition-colors">
                  Centro de ayuda
                </Link>
              </li>
              <li>
                <Link to="/contacto" className="hover:text-white transition-colors">
                  Contacto
                </Link>
              </li>
              <li>
                <Link to="/terminos" className="hover:text-white transition-colors">
                  Términos
                </Link>
              </li>
              <li>
                <Link to="/privacidad" className="hover:text-white transition-colors">
                  Privacidad
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Contacto</h3>
            <div className="space-y-2 text-gray-400">
              <p>📧 reservas@hotelprincess.com</p>
              <p>📞 +34 900 123 456</p>
              <p>📍 Calle Gran Vía 123, Madrid</p>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Hotel Princess. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
