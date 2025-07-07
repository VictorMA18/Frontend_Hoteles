import { useState } from "react"

const Configuracion = () => {
  const [roomPrices, setRoomPrices] = useState({
    matrimonial: 90.0,
    doble: 120.0,
    triple: 150.0,
    suite: 110.0,
  })

  const [roomAssignments, setRoomAssignments] = useState({
    matrimonial: "101,103,105,203,207,303,307,401,403,406",
    doble: "102,106,204,205,305,304,404,405",
    triple: "104,201,301",
    suite: "107,202,302,402",
  })

  const [tempPrices, setTempPrices] = useState({ ...roomPrices })
  const [tempAssignments, setTempAssignments] = useState({ ...roomAssignments })

  const roomTypes = [
    { key: "matrimonial", name: "Matrimonial", icon: "💑", color: "#ff6b6b" },
    { key: "doble", name: "Doble", icon: "👥", color: "#4ecdc4" },
    { key: "triple", name: "Triple", icon: "👨‍👩‍👧", color: "#45b7d1" },
    { key: "suite", name: "Suite", icon: "👑", color: "#f9ca24" },
  ]

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

  const handlePriceChange = (roomType, value) => {
    setTempPrices((prev) => ({
      ...prev,
      [roomType]: Number.parseFloat(value) || 0,
    }))
  }

  const handleAssignmentChange = (roomType, value) => {
    setTempAssignments((prev) => ({
      ...prev,
      [roomType]: value,
    }))
  }

  const handleRemoveRoom = (roomType, roomToRemove) => {
    const currentRooms = tempAssignments[roomType]
      .split(",")
      .map((r) => r.trim())
      .filter((r) => r && r !== roomToRemove)
      .join(",")

    handleAssignmentChange(roomType, currentRooms)
  }

  const handleAddRoom = (roomType, newRoom) => {
    if (!newRoom.trim()) return

    const currentRooms = tempAssignments[roomType]
    const newRooms = currentRooms ? `${currentRooms},${newRoom.trim()}` : newRoom.trim()

    handleAssignmentChange(roomType, newRooms)
  }

  const handleSaveChanges = () => {
    const invalidPrices = Object.entries(tempPrices).filter(([_, price]) => price <= 0)
    if (invalidPrices.length > 0) {
      showToast("Todos los precios deben ser mayores a 0", "error")
      return
    }

    const allRooms = []
    let hasErrors = false

    Object.entries(tempAssignments).forEach(([type, rooms]) => {
      const roomList = rooms
        .split(",")
        .map((r) => r.trim())
        .filter((r) => r)
      roomList.forEach((room) => {
        if (allRooms.includes(room)) {
          showToast(`La habitación ${room} está duplicada`, "error")
          hasErrors = true
        } else {
          allRooms.push(room)
        }
      })
    })

    if (hasErrors) return

    setRoomPrices({ ...tempPrices })
    setRoomAssignments({ ...tempAssignments })
    showToast("Configuración guardada exitosamente")
  }

  const handleResetChanges = () => {
    setTempPrices({ ...roomPrices })
    setTempAssignments({ ...roomAssignments })
    showToast("Cambios revertidos", "info")
  }

  const getRoomCount = (roomType) => {
    const rooms = tempAssignments[roomType]
      .split(",")
      .map((r) => r.trim())
      .filter((r) => r)
    return rooms.length
  }

  return (
    <div
      style={{
        padding: "1rem",
        background: "linear-gradient(135deg, #ffffff 0%, #ffffff 100%)",
        minHeight: "calc(100vh - 60px)",
      }}
    >
      {/* Price Configuration */}
      <div className="card" style={{ marginBottom: "1rem" }}>
        <div className="card-header">
          <h2>Precios por Tipo de Habitación</h2>
        </div>
        <div className="card-content">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1rem" }}>
            {roomTypes.map(({ key, name, icon, color }) => (
              <div
                key={key}
                style={{
                  border: `2px solid ${color}`,
                  borderRadius: "8px",
                  overflow: "hidden",
                  background: "white",
                }}
              >
                <div
                  style={{
                    padding: "1rem",
                    backgroundColor: `${color}20`,
                    borderBottom: `1px solid ${color}30`,
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <span style={{ fontSize: "1.25rem" }}>{icon}</span>
                  <h3 style={{ color: color, margin: 0, fontSize: "1rem", fontWeight: "600", flex: 1 }}>{name}</h3>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      color: "#6b7280",
                      background: "rgba(0, 0, 0, 0.05)",
                      padding: "0.25rem 0.5rem",
                      borderRadius: "8px",
                    }}
                  >
                    ({getRoomCount(key)} hab.)
                  </span>
                </div>
                <div style={{ padding: "1rem" }}>
                  <label className="form-label">Precio por noche (S/)</label>
                  <input
                    className="form-input"
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={tempPrices[key]}
                    onChange={(e) => handlePriceChange(key, e.target.value)}
                    style={{ width: "100%", textAlign: "center", fontWeight: "600" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Room Assignment */}
      <div className="card" style={{ marginBottom: "1rem" }}>
        <div className="card-header">
          <h2>Asignación de Habitaciones</h2>
          <p style={{ fontSize: "0.875rem", color: "#6b7280", margin: "0.5rem 0 0 0" }}>
            Haz clic en ✕ para eliminar habitaciones
          </p>
        </div>
        <div className="card-content">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem" }}>
            {roomTypes.map(({ key, name, icon, color }) => (
              <div
                key={key}
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  overflow: "hidden",
                  background: "white",
                }}
              >
                <div
                  style={{
                    padding: "1rem",
                    background: "#f8fafc",
                    borderBottom: "1px solid #e5e7eb",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <span style={{ fontSize: "1rem" }}>{icon}</span>
                  <h3 style={{ color: color, margin: 0, fontSize: "0.9rem", fontWeight: "600", flex: 1 }}>{name}</h3>
                  <span
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: "600",
                      background: "#f0f9ff",
                      color: "#0369a1",
                      padding: "0.25rem 0.5rem",
                      borderRadius: "4px",
                    }}
                  >
                    S/ {tempPrices[key].toFixed(2)}
                  </span>
                </div>
                <div style={{ padding: "1rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  <label className="form-label">Habitaciones asignadas:</label>

                  {/* Chips Container */}
                  <div className="room-chips-container">
                    {tempAssignments[key]
                      .split(",")
                      .map((room) => room.trim())
                      .filter((room) => room)
                      .map((room, index) => (
                        <span
                          key={index}
                          className="room-chip"
                          style={{
                            backgroundColor: `${color}20`,
                            color: color,
                            border: `1px solid ${color}`,
                          }}
                        >
                          {room}
                          <button
                            className="room-chip-remove"
                            onClick={() => handleRemoveRoom(key, room)}
                            style={{ color: color }}
                          >
                            ✕
                          </button>
                        </span>
                      ))}
                  </div>

                  {/* Add Room Input */}
                  <input
                    className="form-input"
                    type="text"
                    placeholder="Agregar habitación (Enter para añadir)"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleAddRoom(key, e.target.value)
                        e.target.value = ""
                      }
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: "flex", justifyContent: "center", gap: "0.75rem", flexWrap: "wrap" }}>
        <button onClick={handleSaveChanges} className="btn btn-primary">
          💾 Guardar Cambios
        </button>
        <button onClick={handleResetChanges} className="btn btn-secondary">
          🔄 Revertir Cambios
        </button>
      </div>
    </div>
  )
}

export default Configuracion