"use client"

import { useState } from "react"

const Hospedaje = ({ huespedes, setHuespedes, habitacionesData, onRegistrarHuesped, onCheckoutHuespedes }) => {
  const [selectedIds, setSelectedIds] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [form, setForm] = useState({
    nombre: "",
    dni: "",
    habitacion: "",
    medioPago: "",
    monto: "",
    descuento: "10",
  })

  // Filtrar habitaciones disponibles para el selector
  const habitacionesDisponibles = Object.values(habitacionesData).filter(
    (habitacion) => habitacion.estado === "disponible",
  )

  const handleInputChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
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

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!form.nombre.trim() || !form.dni.trim() || !form.habitacion.trim() || !form.medioPago || !form.monto) {
      showToast("Por favor completa todos los campos obligatorios", "error")
      return
    }

    if (form.dni.length !== 8 || !/^\d+$/.test(form.dni)) {
      showToast("El DNI debe tener exactamente 8 dígitos", "error")
      return
    }

    if (Number.parseFloat(form.monto) <= 0) {
      showToast("El monto debe ser mayor a 0", "error")
      return
    }

    const ahora = new Date()
    const nuevoHuesped = {
      id: Date.now().toString(),
      nombre: form.nombre.trim(),
      dni: form.dni.trim(),
      habitacion: form.habitacion.trim(),
      medioPago: form.medioPago,
      monto: Number.parseFloat(form.monto),
      estancia: "activa",
      pagado: true,
      descuento: Number.parseFloat(form.descuento) || 0,
      fechaEntrada: ahora.toLocaleDateString("es-PE"),
      horaEntrada: ahora.toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" }),
      fechaSalida: "",
      horaSalida: "",
    }

    // Usar la función del componente padre para registrar el huésped
    onRegistrarHuesped(nuevoHuesped)

    setForm({
      nombre: "",
      dni: "",
      habitacion: "",
      medioPago: "",
      monto: "",
      descuento: "10",
    })

    showToast(`${nuevoHuesped.nombre} ha sido registrado exitosamente`)
  }

  const handleCheckout = () => {
    if (selectedIds.length === 0) {
      showToast("Selecciona al menos un huésped para hacer checkout", "error")
      return
    }

    // Usar la función del componente padre para hacer checkout
    onCheckoutHuespedes(selectedIds)

    showToast(`${selectedIds.length} huésped(es) han hecho checkout`)
    setSelectedIds([])
  }

  const handleSelectHuesped = (id, checked) => {
    setSelectedIds((prev) => (checked ? [...prev, id] : prev.filter((selectedId) => selectedId !== id)))
  }

  const filteredHuespedes = huespedes.filter(
    (huesped) =>
      huesped.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      huesped.dni.includes(searchTerm) ||
      huesped.habitacion.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const huespedesTotales = huespedes.length
  const huespedesActivos = huespedes.filter((h) => h.estancia === "activa").length
  const ingresoTotal = huespedes.reduce((total, h) => total + h.monto * (1 - h.descuento / 100), 0)

  return (
    <>
      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="card" style={{ padding: "1rem", textAlign: "center" }}>
          <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>👥</div>
          <div style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "0.25rem" }}>Total Huéspedes</div>
          <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{huespedesTotales}</div>
        </div>

        <div className="card" style={{ padding: "1rem", textAlign: "center" }}>
          <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>🏨</div>
          <div style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "0.25rem" }}>Huéspedes Activos</div>
          <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{huespedesActivos}</div>
        </div>

        <div className="card" style={{ padding: "1rem", textAlign: "center" }}>
          <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>💳</div>
          <div style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "0.25rem" }}>Ingresos Total</div>
          <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>S/ {ingresoTotal.toFixed(2)}</div>
        </div>
      </div>

      {/* Registration Form */}
      <div className="card" style={{ marginBottom: "1rem" }}>
        <div className="card-header">
          <h2>➕ Registrar Nuevo Huésped</h2>
        </div>
        <div className="card-content">
          <form onSubmit={handleSubmit} className="form-grid">
            <div>
              <label className="form-label">Nombre Completo *</label>
              <input
                className="form-input"
                type="text"
                value={form.nombre}
                onChange={(e) => handleInputChange("nombre", e.target.value)}
                placeholder="Ingresa el nombre completo"
                required
              />
            </div>

            <div>
              <label className="form-label">DNI *</label>
              <input
                className="form-input"
                type="text"
                value={form.dni}
                onChange={(e) => handleInputChange("dni", e.target.value)}
                placeholder="12345678"
                maxLength={8}
                pattern="[0-9]{8}"
                required
              />
            </div>

            <div>
              <label className="form-label">Habitación *</label>
              <select
                className="form-input"
                value={form.habitacion}
                onChange={(e) => handleInputChange("habitacion", e.target.value)}
                required
              >
                <option value="">Selecciona habitación</option>
                {habitacionesDisponibles.map((habitacion) => (
                  <option key={habitacion.numero} value={habitacion.numero}>
                    {habitacion.numero} - {habitacion.tipo}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label">Medio de Pago *</label>
              <select
                className="form-input"
                value={form.medioPago}
                onChange={(e) => handleInputChange("medioPago", e.target.value)}
                required
              >
                <option value="">Selecciona método</option>
                <option value="efectivo">Efectivo</option>
                <option value="tarjeta">Tarjeta</option>
                <option value="transferencia">Transferencia</option>
                <option value="yape">Yape</option>
                <option value="plin">Plin</option>
              </select>
            </div>

            <div>
              <label className="form-label">Monto (S/) *</label>
              <input
                className="form-input"
                type="number"
                step="0.01"
                min="0.01"
                value={form.monto}
                onChange={(e) => handleInputChange("monto", e.target.value)}
                placeholder="0.00"
                required
              />
            </div>

            <div className="button-group" style={{ gridColumn: "1 / -1", marginTop: "0.5rem" }}>
              <button type="submit" className="btn btn-primary">
                ➕ Registrar Huésped
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleCheckout}
                disabled={selectedIds.length === 0}
              >
                ➖ Checkout ({selectedIds.length})
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Search and Table */}
      <div className="card">
        <div className="card-header card-header-flex">
          <h2>Lista de Huéspedes</h2>
          <div className="search-container">
            <span className="search-icon">🔍</span>
            <input
              className="search-input"
              type="text"
              placeholder="Buscar por nombre, DNI o habitación..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="card-content" style={{ padding: "0" }}>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: "5%" }}>Sel.</th>
                  <th style={{ width: "20%" }}>Nombre</th>
                  <th style={{ width: "10%" }}>DNI</th>
                  <th style={{ width: "10%" }}>Habitación</th>
                  <th style={{ width: "10%" }}>Pago</th>
                  <th style={{ width: "10%" }}>Monto</th>
                  <th style={{ width: "10%" }}>Estado</th>
                  <th style={{ width: "12.5%" }}>Entrada</th>
                  <th style={{ width: "12.5%" }}>Salida</th>
                </tr>
              </thead>
              <tbody>
                {filteredHuespedes.map((huesped) => (
                  <tr key={huesped.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(huesped.id)}
                        onChange={(e) => handleSelectHuesped(huesped.id, e.target.checked)}
                        disabled={huesped.estancia === "finalizada"}
                      />
                    </td>
                    <td style={{ fontWeight: "500", color: "#1a202c" }}>{huesped.nombre}</td>
                    <td style={{ color: "#1a202c" }}>{huesped.dni}</td>
                    <td style={{ color: "#1a202c" }}>{huesped.habitacion}</td>
                    <td style={{ textTransform: "capitalize", color: "#1a202c" }}>{huesped.medioPago}</td>
                    <td style={{ color: "#1a202c" }}>
                      <div>S/ {huesped.monto.toFixed(2)}</div>
                      {huesped.descuento > 0 && (
                        <div style={{ fontSize: "0.75rem", color: "#059669" }}>-{huesped.descuento}% desc.</div>
                      )}
                    </td>
                    <td>
                      <span
                        style={{
                          padding: "0.25rem 0.5rem",
                          borderRadius: "12px",
                          fontSize: "0.75rem",
                          fontWeight: "500",
                          background: huesped.estancia === "activa" ? "#dcfce7" : "#f3f4f6",
                          color: huesped.estancia === "activa" ? "#166534" : "#6b7280",
                        }}
                      >
                        {huesped.estancia === "activa" ? "Activo" : "Finalizado"}
                      </span>
                    </td>
                    <td style={{ color: "#1a202c" }}>
                      <div style={{ fontSize: "0.75rem" }}>📅 {huesped.fechaEntrada}</div>
                      <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>🕐 {huesped.horaEntrada}</div>
                    </td>
                    <td style={{ color: "#1a202c" }}>
                      {huesped.fechaSalida ? (
                        <div>
                          <div style={{ fontSize: "0.75rem" }}>📅 {huesped.fechaSalida}</div>
                          <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>🕐 {huesped.horaSalida}</div>
                        </div>
                      ) : (
                        <span style={{ color: "#9ca3af" }}>-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredHuespedes.length === 0 && (
              <div style={{ textAlign: "center", padding: "2rem", color: "#6b7280" }}>
                {searchTerm
                  ? "No se encontraron huéspedes que coincidan con la búsqueda"
                  : "No hay huéspedes registrados"}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default Hospedaje