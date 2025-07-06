"use client"

import { useState } from "react"

const Habitaciones = ({ habitacionesData, onActualizarEstado }) => {
  const [pisoActual, setPisoActual] = useState("1")

  // Filtrar habitaciones por piso
  const habitacionesPorPiso = Object.values(habitacionesData).filter((habitacion) =>
    habitacion.numero.startsWith(pisoActual),
  )

  // Obtener color según estado
  const getColorEstado = (estado) => {
    switch (estado) {
      case "disponible":
        return "#8BC34A" // Verde
      case "ocupada":
        return "#F44336" // Rojo
      case "limpieza":
        return "#9E9E9E" // Gris
      default:
        return "#E0E0E0"
    }
  }

  // Cambiar estado de habitación
  const cambiarEstado = (habitacion) => {
    // Solo permitir cambiar de limpieza a disponible
    if (habitacion.estado === "limpieza") {
      onActualizarEstado(habitacion.numero, "disponible")
      showToast(`Habitación ${habitacion.numero} ahora está disponible`)
    }
  }

  const showToast = (message, type = "success") => {
    const toast = document.createElement("div")
    toast.className = `toast toast-${type}`
    toast.textContent = message
    document.body.appendChild(toast)

    setTimeout(() => {
      toast.classList.add("toast-show")
    }, 100)

    setTimeout(() => {
      toast.classList.remove("toast-show")
      setTimeout(() => document.body.removeChild(toast), 300)
    }, 3000)
  }

  // Obtener el nombre del estado para mostrar
  const getNombreEstado = (estado) => {
    switch (estado) {
      case "disponible":
        return "Disponible"
      case "ocupada":
        return "Ocupada"
      case "limpieza":
        return "Limpieza"
      default:
        return "Desconocido"
    }
  }

  // Obtener el icono según el tipo de habitación
  const getIconoTipo = (tipo) => {
    switch (tipo) {
      case "Triple":
        return "👨‍👩‍👧"
      case "Suite":
        return "👑"
      case "Matr.":
        return "💑"
      case "Doble":
        return "👥"
      default:
        return "🛏️"
    }
  }

  return (
    <>
      {/* Selector de Piso */}
      <div className="card" style={{ marginBottom: "1rem" }}>
        <div className="card-header">
          <h2>Mapa de Habitaciones</h2>
        </div>
        <div className="card-content">
          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
            <button
              className={`btn ${pisoActual === "1" ? "btn-primary" : "btn-secondary"}`}
              onClick={() => setPisoActual("1")}
            >
              1° Piso
            </button>
            <button
              className={`btn ${pisoActual === "2" ? "btn-primary" : "btn-secondary"}`}
              onClick={() => setPisoActual("2")}
            >
              2° Piso
            </button>
            <button
              className={`btn ${pisoActual === "3" ? "btn-primary" : "btn-secondary"}`}
              onClick={() => setPisoActual("3")}
            >
              3° Piso
            </button>
            <button
              className={`btn ${pisoActual === "4" ? "btn-primary" : "btn-secondary"}`}
              onClick={() => setPisoActual("4")}
            >
              4° Piso
            </button>
          </div>

          {/* Leyenda */}
          <div
            style={{
              display: "flex",
              gap: "1rem",
              marginBottom: "1rem",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  backgroundColor: "#8BC34A",
                  borderRadius: "4px",
                }}
              ></div>
              <span>Disponible</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  backgroundColor: "#F44336",
                  borderRadius: "4px",
                }}
              ></div>
              <span>Ocupada</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  backgroundColor: "#9E9E9E",
                  borderRadius: "4px",
                }}
              ></div>
              <span>Limpieza</span>
            </div>
          </div>

          {/* Mapa de Habitaciones */}
          <div style={{ position: "relative", width: "100%", maxWidth: "800px", margin: "0 auto" }}>
            {/* Área de Estacionamiento */}
            <div
              style={{
                backgroundColor: "#757575",
                color: "white",
                padding: "1rem",
                textAlign: "center",
                borderRadius: "4px",
                marginBottom: "1rem",
                fontWeight: "bold",
              }}
            >
              Estacionamiento
            </div>

            {/* Habitaciones */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {/* Primera fila de habitaciones */}
              <div style={{ display: "flex", gap: "0.5rem", justifyContent: "space-between" }}>
                {habitacionesPorPiso
                  .filter((h) => {
                    const roomNum = Number.parseInt(h.numero.substring(1))
                    return pisoActual === "1" ? roomNum >= 4 && roomNum <= 7 : roomNum >= 4 && roomNum <= 7
                  })
                  .sort((a, b) => Number.parseInt(a.numero.substring(1)) - Number.parseInt(b.numero.substring(1)))
                  .map((habitacion) => (
                    <div
                      key={habitacion.numero}
                      style={{
                        flex: 1,
                        backgroundColor: getColorEstado(habitacion.estado),
                        borderRadius: "8px",
                        padding: "1rem",
                        color: habitacion.estado === "disponible" ? "#000" : "#fff",
                        cursor: habitacion.estado === "limpieza" ? "pointer" : "default",
                        transition: "all 0.2s",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        minHeight: "120px",
                      }}
                      onClick={() => cambiarEstado(habitacion)}
                      title={
                        habitacion.estado === "limpieza"
                          ? "Haz clic para marcar como disponible"
                          : getNombreEstado(habitacion.estado)
                      }
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}>{habitacion.numero}</span>
                        <span style={{ fontSize: "1.2rem" }}>{getIconoTipo(habitacion.tipo)}</span>
                      </div>
                      <div>
                        <div>{habitacion.tipo}</div>
                        <div
                          style={{
                            fontSize: "0.8rem",
                            marginTop: "0.5rem",
                            backgroundColor: "rgba(255,255,255,0.2)",
                            padding: "0.25rem 0.5rem",
                            borderRadius: "4px",
                            display: "inline-block",
                          }}
                        >
                          {getNombreEstado(habitacion.estado)}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              {/* Pasillo */}
              <div
                style={{
                  backgroundColor: "#E0E0E0",
                  padding: "0.5rem",
                  textAlign: "center",
                  borderRadius: "4px",
                  color: "#757575",
                  fontSize: "0.8rem",
                }}
              >
                Pasillo
              </div>

              {/* Segunda fila de habitaciones */}
              <div style={{ display: "flex", gap: "0.5rem", justifyContent: "space-between" }}>
                {habitacionesPorPiso
                  .filter((h) => {
                    const roomNum = Number.parseInt(h.numero.substring(1))
                    return pisoActual === "1" ? roomNum >= 1 && roomNum <= 3 : roomNum >= 1 && roomNum <= 3
                  })
                  .sort((a, b) => Number.parseInt(a.numero.substring(1)) - Number.parseInt(b.numero.substring(1)))
                  .map((habitacion) => (
                    <div
                      key={habitacion.numero}
                      style={{
                        flex: 1,
                        backgroundColor: getColorEstado(habitacion.estado),
                        borderRadius: "8px",
                        padding: "1rem",
                        color: habitacion.estado === "disponible" ? "#000" : "#fff",
                        cursor: habitacion.estado === "limpieza" ? "pointer" : "default",
                        transition: "all 0.2s",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        minHeight: "120px",
                      }}
                      onClick={() => cambiarEstado(habitacion)}
                      title={
                        habitacion.estado === "limpieza"
                          ? "Haz clic para marcar como disponible"
                          : getNombreEstado(habitacion.estado)
                      }
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}>{habitacion.numero}</span>
                        <span style={{ fontSize: "1.2rem" }}>{getIconoTipo(habitacion.tipo)}</span>
                      </div>
                      <div>
                        <div>{habitacion.tipo}</div>
                        <div
                          style={{
                            fontSize: "0.8rem",
                            marginTop: "0.5rem",
                            backgroundColor: "rgba(255,255,255,0.2)",
                            padding: "0.25rem 0.5rem",
                            borderRadius: "4px",
                            display: "inline-block",
                          }}
                        >
                          {getNombreEstado(habitacion.estado)}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="card">
        <div className="card-header">
          <h2>Estadísticas de Habitaciones</h2>
        </div>
        <div className="card-content">
          <div className="stats-grid">
            <div className="card" style={{ padding: "1rem", textAlign: "center" }}>
              <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem", color: "#8BC34A" }}>🟢</div>
              <div style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "0.25rem" }}>Disponibles</div>
              <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                {Object.values(habitacionesData).filter((h) => h.estado === "disponible").length}
              </div>
            </div>

            <div className="card" style={{ padding: "1rem", textAlign: "center" }}>
              <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem", color: "#F44336" }}>🔴</div>
              <div style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "0.25rem" }}>Ocupadas</div>
              <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                {Object.values(habitacionesData).filter((h) => h.estado === "ocupada").length}
              </div>
            </div>

            <div className="card" style={{ padding: "1rem", textAlign: "center" }}>
              <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem", color: "#9E9E9E" }}>⚪</div>
              <div style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "0.25rem" }}>En Limpieza</div>
              <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                {Object.values(habitacionesData).filter((h) => h.estado === "limpieza").length}
              </div>
            </div>
          </div>

          <div style={{ marginTop: "1rem", textAlign: "center", fontSize: "0.875rem", color: "#6b7280" }}>
            <p>
              <strong>Nota:</strong> Haz clic en las habitaciones en estado de limpieza para marcarlas como disponibles.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Habitaciones
