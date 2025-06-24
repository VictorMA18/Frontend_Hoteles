import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
      <h1 className="text-6xl font-bold text-blue-600 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Página no encontrada</h2>
      <p className="text-gray-600 text-center max-w-md mb-8">
        Lo sentimos, la página que estás buscando no existe o ha sido movida.
      </p>
      <Link to="/">
        <Button className="bg-blue-600 hover:bg-blue-700">Volver a la página de inicio</Button>
      </Link>
    </div>
  )
}

export default NotFound
