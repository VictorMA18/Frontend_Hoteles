import { useState, useEffect } from "react"

const Reservas = ({ habitacionesData, roomPrices, roomTypeMapping, onConfirmarReservas }) => {
  const [reservas, setReservas] = useState([])
  const [selectedIds, setSelectedIds] = useState([])
  const [form, setForm] = useState({
    nombre: "",
    dni: "",
    habitacion: "",
    huespedes: "1",
    medioPago: "",
    pago: false,
    monto: "",
    montoTotal: "",
    descuento: "10",
    entrada: "",
    salida: "",
  })

  // Filtrar habitaciones disponibles para el selector
  const habitacionesDisponibles = habitacionesData
    ? Object.values(habitacionesData).filter((habitacion) => habitacion.estado === "disponible")
    : []

  const calcularDias = (entrada, salida) => {
    if (!entrada || !salida) return 0
    const fechaEntrada = new Date(entrada)
    const fechaSalida = new Date(salida)
    const diferencia = fechaSalida - fechaEntrada
    return Math.max(1, Math.ceil(diferencia / (1000 * 60 * 60 * 24)))
  }

  // Efecto para calcular monto total automáticamente
  useEffect(() => {
    if (form.monto && form.entrada && form.salida) {
      const dias = calcularDias(form.entrada, form.salida)
      const montoBase = Number.parseFloat(form.monto) * dias
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
  }, [form.monto, form.entrada, form.salida, form.descuento])

  const handleInputChange = (field, value) => {
    setForm((prev) => {
      const newForm = { ...prev, [field]: value }

      // Auto-completar monto cuando se selecciona habitación
      if (field === "habitacion" && value && habitacionesData) {
        const habitacion = habitacionesData[value]
        if (habitacion) {
          const roomType = roomTypeMapping[habitacion.tipo]
          if (roomType && roomPrices && roomPrices[roomType]) {
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
    setTimeout(() => toast.classList.add("toast-show"), 100)
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
      !form.huespedes ||
      !form.medioPago ||
      form.monto === "" ||
      !form.entrada ||
      !form.salida
    ) {
      showToast("Completa todos los campos obligatorios", "error")
      return
    }

    if (form.dni.length !== 8 || !/^\d+$/.test(form.dni)) {
      showToast("El DNI debe tener 8 dígitos", "error")
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

    // Validar fechas
    const fechaEntrada = new Date(form.entrada)
    const fechaSalida = new Date(form.salida)
    if (fechaSalida <= fechaEntrada) {
      showToast("La fecha de salida debe ser posterior a la fecha de entrada", "error")
      return
    }

    const nuevaReserva = {
      id: Date.now().toString(),
      nombre: form.nombre.trim(),
      dni: form.dni.trim(),
      habitacion: form.habitacion.trim(),
      huespedes: Number.parseInt(form.huespedes),
      medioPago: form.medioPago,
      pago: Boolean(form.pago),
      monto: Number.parseFloat(form.monto),
      montoTotal: Number.parseFloat(form.montoTotal),
      descuento: Number.parseFloat(form.descuento),
      entrada: form.entrada,
      salida: form.salida,
      dias: calcularDias(form.entrada, form.salida),
      estado: "En espera",
      fechaCreacion: new Date().toLocaleDateString("es-PE"),
    }

    setReservas((prev) => [...prev, nuevaReserva])
    setForm({
      nombre: "",
      dni: "",
      habitacion: "",
      huespedes: "1",
      medioPago: "",
      pago: false,
      monto: "",
      montoTotal: "",
      descuento: "10",
      entrada: "",
      salida: "",
    })
    showToast(`Reserva de ${nuevaReserva.nombre} agregada`)
  }

  const handleSelectReserva = (id, checked) => {
    setSelectedIds((prev) => (checked ? [...prev, id] : prev.filter((selectedId) => selectedId !== id)))
  }

  const handleConfirmarReservas = () => {
    if (selectedIds.length === 0) {
      showToast("Selecciona al menos una reserva para confirmar", "error")
      return
    }

    const reservasAConfirmar = reservas.filter((r) => selectedIds.includes(r.id))

    // Actualizar estado de reservas a confirmada
    setReservas((prev) =>
      prev.map((reserva) => (selectedIds.includes(reserva.id) ? { ...reserva, estado: "Confirmada" } : reserva)),
    )

    // Pasar reservas confirmadas a Hospedaje
    if (onConfirmarReservas) {
      onConfirmarReservas(reservasAConfirmar)
    }

    showToast(`${selectedIds.length} reserva(s) confirmada(s)`)
    setSelectedIds([])
  }

  const handleCancelarReservas = () => {
    if (selectedIds.length === 0) {
      showToast("Selecciona al menos una reserva para cancelar", "error")
      return
    }

    setReservas((prev) =>
      prev.map((reserva) => (selectedIds.includes(reserva.id) ? { ...reserva, estado: "Cancelada" } : reserva)),
    )

    showToast(`${selectedIds.length} reserva(s) cancelada(s)`)
    setSelectedIds([])
  }

  const getEstadoColor = (estado) => {
    switch (estado) {
      case "Confirmada":
        return { background: "#dcfce7", color: "#166534" }
      case "Cancelada":
        return { background: "#fef2f2", color: "#dc2626" }
      case "En espera":
        return { background: "#fef3c7", color: "#92400e" }
      default:
        return { background: "#f3f4f6", color: "#6b7280" }
    }
  }

  return (
    <div
      style={{
        padding: "1rem",
        background: "linear-gradient(135deg, #e3f2fd 0%, #e8eaf6 100%)",
        minHeight: "calc(100vh - 60px)",
      }}
    >
      {/* Registration Form */}
      <div className="card" style={{ marginBottom: "1rem" }}>
        <div className="card-header">
          <h2>➕ Registrar Nueva Reserva</h2>
        </div>
        <div className="card-content">
          <form
            onSubmit={handleSubmit}
            style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1rem" }}
          >
            <div>
              <label className="form-label">Nombre Completo *</label>
              <input
                className="form-input"
                type="text"
                value={form.nombre}
                onChange={(e) => handleInputChange("nombre", e.target.value)}
                placeholder="Ej. Juan Pérez"
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
                value={form.monto}
                onChange={(e) => handleInputChange("monto", e.target.value)}
                placeholder="Se completa automáticamente"
                readOnly
                style={{ backgroundColor: "#f9fafb", cursor: "not-allowed" }}
                required
              />
            </div>

            <div>
              <label className="form-label">Fecha Entrada *</label>
              <input
                className="form-input"
                type="date"
                value={form.entrada}
                onChange={(e) => handleInputChange("entrada", e.target.value)}
                required
              />
            </div>

            <div>
              <label className="form-label">Fecha Salida *</label>
              <input
                className="form-input"
                type="date"
                value={form.salida}
                onChange={(e) => handleInputChange("salida", e.target.value)}
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
              {form.entrada && form.salida && (
                <div style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "0.25rem" }}>
                  {calcularDias(form.entrada, form.salida)} noche(s) con {form.descuento}% descuento
                </div>
              )}
            </div>

            <div>
              <label className="form-label">Estado del Pago</label>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "0.75rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  backgroundColor: "#ffffff",
                  height: "42px",
                }}
              >
                <input
                  type="checkbox"
                  id="pago-checkbox"
                  checked={form.pago}
                  onChange={(e) => handleInputChange("pago", e.target.checked)}
                  style={{
                    width: "18px",
                    height: "18px",
                    accentColor: "#3b82f6",
                    cursor: "pointer",
                  }}
                />
                <label
                  htmlFor="pago-checkbox"
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    color: "#374151",
                    cursor: "pointer",
                    userSelect: "none",
                  }}
                >
                  Pago Realizado
                </label>
                {form.pago && (
                  <span
                    style={{
                      marginLeft: "auto",
                      padding: "0.25rem 0.5rem",
                      borderRadius: "12px",
                      fontSize: "0.75rem",
                      fontWeight: "500",
                      backgroundColor: "#dcfce7",
                      color: "#166534",
                    }}
                  >
                    ✓ Pagado
                  </span>
                )}
              </div>
            </div>

            <div style={{ gridColumn: "1 / -1", marginTop: "0.5rem", display: "flex", gap: "0.75rem" }}>
              <button type="submit" className="btn btn-primary">
                ➕ Registrar Reserva
              </button>
              <button
                type="button"
                className="btn btn-success"
                onClick={handleConfirmarReservas}
                disabled={selectedIds.length === 0}
                style={{ backgroundColor: "#10b981", borderColor: "#10b981" }}
              >
                ✅ Check-in ({selectedIds.length})
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleCancelarReservas}
                disabled={selectedIds.length === 0}
              >
                ❌ Cancelar Reserva ({selectedIds.length})
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Reservations Table */}
      <div className="card">
        <div className="card-header">
          <h2>Lista de Reservas</h2>
        </div>
        <div className="card-content" style={{ padding: "0", overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
            <thead>
              <tr style={{ background: "#f9fafb" }}>
                <th style={{ padding: "0.75rem", width: "4%", fontWeight: "600", borderBottom: "1px solid #e5e7eb" }}>
                  Sel.
                </th>
                <th
                  style={{
                    padding: "0.75rem",
                    textAlign: "left",
                    fontWeight: "600",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  Nombre
                </th>
                <th
                  style={{
                    padding: "0.75rem",
                    textAlign: "left",
                    fontWeight: "600",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  DNI
                </th>
                <th
                  style={{
                    padding: "0.75rem",
                    textAlign: "center",
                    fontWeight: "600",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  Habitación
                </th>
                <th
                  style={{
                    padding: "0.75rem",
                    textAlign: "center",
                    fontWeight: "600",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  Huéspedes
                </th>
                <th
                  style={{
                    padding: "0.75rem",
                    textAlign: "left",
                    fontWeight: "600",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  Medio de Pago
                </th>
                <th
                  style={{
                    padding: "0.75rem",
                    textAlign: "left",
                    fontWeight: "600",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  Pago
                </th>
                <th
                  style={{
                    padding: "0.75rem",
                    textAlign: "left",
                    fontWeight: "600",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  Monto Total
                </th>
                <th
                  style={{
                    padding: "0.75rem",
                    textAlign: "left",
                    fontWeight: "600",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  Estado
                </th>
                <th
                  style={{
                    padding: "0.75rem",
                    textAlign: "left",
                    fontWeight: "600",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  Entrada
                </th>
                <th
                  style={{
                    padding: "0.75rem",
                    textAlign: "left",
                    fontWeight: "600",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  Salida
                </th>
              </tr>
            </thead>
            <tbody>
              {reservas.map((r) => (
                <tr key={r.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                  <td style={{ padding: "0.75rem" }}>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(r.id)}
                      onChange={(e) => handleSelectReserva(r.id, e.target.checked)}
                      disabled={r.estado === "Cancelada"}
                      style={{ cursor: r.estado === "Cancelada" ? "not-allowed" : "pointer" }}
                    />
                  </td>
                  <td style={{ padding: "0.75rem", fontWeight: "500" }}>{r.nombre}</td>
                  <td style={{ padding: "0.75rem" }}>{r.dni}</td>
                  <td style={{ padding: "0.75rem", textAlign: "center" }}>{r.habitacion}</td>
                  <td style={{ padding: "0.75rem", textAlign: "center" }}>
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
                      {r.huespedes} 👥
                    </span>
                  </td>
                  <td style={{ padding: "0.75rem", textTransform: "capitalize" }}>{r.medioPago}</td>
                  <td style={{ padding: "0.75rem" }}>
                    <span
                      style={{
                        padding: "0.25rem 0.5rem",
                        borderRadius: "12px",
                        fontSize: "0.75rem",
                        fontWeight: "500",
                        background: r.pago ? "#dcfce7" : "#fef3c7",
                        color: r.pago ? "#166534" : "#92400e",
                      }}
                    >
                      {r.pago ? "Sí" : "No"}
                    </span>
                  </td>
                  <td style={{ padding: "0.75rem" }}>
                    <div>S/ {r.montoTotal.toFixed(2)}</div>
                    <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                      {r.dias} noche(s) - {r.descuento}% desc.
                    </div>
                  </td>
                  <td style={{ padding: "0.75rem" }}>
                    <span
                      style={{
                        padding: "0.25rem 0.5rem",
                        borderRadius: "12px",
                        fontSize: "0.75rem",
                        fontWeight: "500",
                        ...getEstadoColor(r.estado),
                      }}
                    >
                      {r.estado}
                    </span>
                  </td>
                  <td style={{ padding: "0.75rem" }}>{r.entrada}</td>
                  <td style={{ padding: "0.75rem" }}>{r.salida}</td>
                </tr>
              ))}
              {reservas.length === 0 && (
                <tr>
                  <td colSpan="10" style={{ textAlign: "center", padding: "2rem", color: "#6b7280" }}>
                    No hay reservas activas
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Reservas