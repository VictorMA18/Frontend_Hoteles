import { useState } from "react"
import { useAuth } from "@/features/auth/useAuth"

const Header = ({ currentPage, onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const { logout } = useAuth()

  const pages = {
    hospedaje: "Hospedaje",
    reservas: "Reservas",
    habitaciones: "Habitaciones",
    configuracion: "Configuración",
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen)
  }

  const handleNavigate = (page) => {
    onNavigate(page)
    setIsMenuOpen(false)
  }

  const handleUserAction = (action) => {
    setIsUserMenuOpen(false)
    switch (action) {
      case "profile":
        alert("Ver perfil")
        break
      case "admins":
        alert("Ver otros administradores")
        break
      case "logout":
        if (confirm("¿Estás seguro de que quieres cerrar sesión?")) {
          logout()
          // Redirigir a login o recargar
          window.location.href = "/login"
        }
        break
    }
  }

  return (
    <>
      <header className="app-header">
        <div className="header-left">
          <button className="menu-button" onClick={toggleMenu}>
            <span style={{ color: "#333333" }}>☰</span>
          </button>
        </div>

        <div className="header-center">
          <h1 className="page-title">{pages[currentPage]}</h1>
        </div>

        <div className="header-right">
          <button className="user-menu" onClick={toggleUserMenu}>
            A
          </button>

          {isUserMenuOpen && (
            <div className="dropdown-menu">
              <button className="dropdown-item" onClick={() => handleUserAction("profile")}>
                👤 Ver Perfil
              </button>
              <button className="dropdown-item" onClick={() => handleUserAction("admins")}>
                👥 Ver Otros Admins
              </button>
              <button className="dropdown-item" onClick={() => handleUserAction("logout")}>
                🚪 Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Navigation Menu */}
      <nav className={`nav-menu ${isMenuOpen ? "open" : ""}`}>
        <button
          className={`nav-item ${currentPage === "hospedaje" ? "active" : ""}`}
          onClick={() => handleNavigate("hospedaje")}
        >
          🏨 Hospedaje
        </button>
        <button
          className={`nav-item ${currentPage === "reservas" ? "active" : ""}`}
          onClick={() => handleNavigate("reservas")}
        >
          📅 Reservas
        </button>
        <button
          className={`nav-item ${currentPage === "habitaciones" ? "active" : ""}`}
          onClick={() => handleNavigate("habitaciones")}
        >
          🛏️ Habitaciones
        </button>
      </nav>

      {/* Overlay */}
      {isMenuOpen && <div className="overlay" onClick={() => setIsMenuOpen(false)}></div>}
    </>
  )
}

export default Header