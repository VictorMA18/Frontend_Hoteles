"use client"

import { useState, useEffect } from "react"

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
    huespedes: "1",
    diasHospedaje: "1",
    montoTotal: "",
  })

  // Configuración de precios por tipo de habitación (desde configuración)
  const roomPrices = {
    matrimonial: 90.0,
    doble: 120.0,
    triple: 150.0,
    suite: 110.0,
  }

  // Mapeo de tipos de habitación
  const roomTypeMapping = {
    "Matr.": "matrimonial",
    Doble: "doble",
    Triple: "triple",
    Suite: "suite",
  }

  // Filtrar habitaciones disponibles para el selector
  const habitacionesDisponibles = Object.values(habitacionesData).filter(
    (habitacion) => habitacion.estado === "disponible",
  )

  // Efecto para calcular monto total automáticamente
  useEffect(() => {
    if (form.monto && form.diasHospedaje) {
      const montoBase = Number.parseFloat(form.monto) * Number.parseInt(form.diasHospedaje)
      const descuento = Number.parseFloat(form.descuento) || 0
      const montoTotal = montoBase * (1 - descuento / 100)

      setForm((prev) => ({
        ...prev,
        montoTotal: montoTotal.toFixed(2),
      }))
    } else {
      setForm((prev) => ({
        ...prev,
        montoTotal: "",
      }))
    }
  }, [form.monto, form.diasHospedaje, form.descuento])

  const handleInputChange = (field, value) => {
    setForm((prev) => {
      const newForm = { ...prev, [field]: value }

      // Auto-completar monto cuando se selecciona habitación
      if (field === "habitacion" && value) {
        const habitacion = habitacionesData[value]
        if (habitacion) {
          const roomType = roomTypeMapping[habitacion.tipo]
          if (roomType && roomPrices[roomType]) {
            newForm.monto = roomPrices[roomType].toString()
          }
        }
      }

      return newForm
    })
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

    if (
      !form.nombre.trim() ||
      !form.dni.trim() ||
      !form.habitacion.trim() ||
      !form.medioPago ||
      !form.monto ||
      !form.huespedes ||
      !form.diasHospedaje
    ) {
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

    if (Number.parseInt(form.huespedes) < 1) {
      showToast("La cantidad de huéspedes debe ser mayor o igual a 1", "error")
      return
    }

    if (Number.parseInt(form.diasHospedaje) < 1) {
      showToast("Los días de hospedaje deben ser mayor o igual a 1", "error")
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
      montoTotal: Number.parseFloat(form.montoTotal),
      estancia: "activa",
      pagado: true,
      descuento: Number.parseFloat(form.descuento) || 0,
      huespedes: Number.parseInt(form.huespedes),
      diasHospedaje: Number.parseInt(form.diasHospedaje),
      fechaEntrada: ahora.toLocaleDateString("es-PE"),
      horaEntrada: ahora.toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" }),
      fechaSalida: "",
      horaSalida: "",
      usuario: "Admin",
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
      huespedes: "1",
      diasHospedaje: "1",
      montoTotal: "",
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
  const ingresoTotal = huespedes.reduce((total, h) => total + (h.montoTotal || h.monto) * (1 - h.descuento / 100), 0)

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
              <label className="form-label">Huéspedes *</label>
              <input
                className="form-input"
                type="number"
                min="1"
                max="10"
                value={form.huespedes}
                onChange={(e) => handleInputChange("huespedes", e.target.value)}
                placeholder="1"
                required
              />
            </div>

            <div>
              <label className="form-label">Días a Hospedarse *</label>
              <input
                className="form-input"
                type="number"
                min="1"
                max="30"
                value={form.diasHospedaje}
                onChange={(e) => handleInputChange("diasHospedaje", e.target.value)}
                placeholder="1"
                required
              />
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
              <label className="form-label">Monto por Noche (S/) *</label>
              <input
                className="form-input"
                type="number"
                step="0.01"
                min="0.01"
                value={form.monto}
                onChange={(e) => handleInputChange("monto", e.target.value)}
                placeholder="Se completa automáticamente"
                readOnly
                style={{ backgroundColor: "#f9fafb", cursor: "not-allowed" }}
                required
              />
            </div>

            <div>
              <label className="form-label">Monto Total (S/)</label>
              <input
                className="form-input"
                type="text"
                value={form.montoTotal ? `S/ ${form.montoTotal}` : ""}
                placeholder="Se calcula automáticamente"
                readOnly
                style={{ backgroundColor: "#f0f9ff", cursor: "not-allowed", fontWeight: "600" }}
              />
              {form.diasHospedaje && form.monto && (
                <div style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "0.25rem" }}>
                  {form.diasHospedaje} día(s) con {form.descuento}% descuento
                </div>
              )}
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
                  <th style={{ width: "4%" }}>Sel.</th>
                  <th style={{ width: "14%" }}>Nombre</th>
                  <th style={{ width: "8.2%" }}>DNI</th>
                  <th style={{ width: "8.2%" }}>Habitación</th>
                  <th style={{ width: "8.2%" }}>Huéspedes</th>
                  <th style={{ width: "8.2%" }}>Días</th>
                  <th style={{ width: "8.2%" }}>Pago</th>
                  <th style={{ width: "8.2%" }}>Monto Total</th>
                  <th style={{ width: "8.2%" }}>Estado</th>
                  <th style={{ width: "8.2%" }}>Entrada</th>
                  <th style={{ width: "8.2%" }}>Salida</th>
                  <th style={{ width: "8.2%" }}>Administrador</th>
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
                    <td style={{ color: "#1a202c", textAlign: "left" }}>{huesped.habitacion}</td>
                    <td style={{ color: "#1a202c", textAlign: "left" }}>
                      <span
                        style={{
                          background: "#f0f9ff",
                          color: "#0369a1",
                          padding: "0.25rem 0.5rem",
                          borderRadius: "12px",
                          fontSize: "0.75rem",
                          fontWeight: "500",
                        }}
                      >
                        {huesped.huespedes || 1} 👥
                      </span>
                    </td>
                    <td style={{ color: "#1a202c", textAlign: "left" }}>
                      <span
                        style={{
                          background: "#fef3c7",
                          color: "#92400e",
                          padding: "0.25rem 0.5rem",
                          borderRadius: "12px",
                          fontSize: "0.75rem",
                          fontWeight: "500",
                        }}
                      >
                        {huesped.diasHospedaje || 1} 📅
                      </span>
                    </td>
                    <td style={{ textTransform: "capitalize", color: "#1a202c" }}>{huesped.medioPago}</td>
                    <td style={{ color: "#1a202c" }}>
                      <div>S/ {((huesped.montoTotal || huesped.monto) * (1 - huesped.descuento / 100)).toFixed(2)}</div>
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
                    <td style={{ fontWeight: "500", color: "#1a202c" }}>{huesped.usuario}</td>
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
