import { useState, useEffect } from "react"

const Reservas = ({ habitacionesData, roomTypeMapping, onConfirmarReservas }) => {
  const [reservas, setReservas] = useState([])
  const [selectedIds, setSelectedIds] = useState([])
  const [form, setForm] = useState({
    nombres: "",
    apellidos: "",
    dni: "",
    habitacion: "",
    huespedes: "1",
    medioPago: "",
    pago: false,
    monto: "",
    montoTotal: "",
    descuento: "",
    entrada: "",
    salida: "",
    dni_admin: "",
  })
  const [usuarioExistente, setUsuarioExistente] = useState(false)

  // Filtrar habitaciones disponibles para el selector
  const habitacionesDisponibles = habitacionesData
    ? Object.values(habitacionesData).filter((habitacion) => habitacion.estado === "disponible")
    : []

const handleConfirmarPago = () => {
    if (selectedIds.length === 0) {
      showToast("Selecciona al menos una reserva para confirmar el pago", "error")
      return
    }

    const reservasNoPagadas = reservas.filter((r) => selectedIds.includes(r.id) && !r.pago)

    if (reservasNoPagadas.length === 0) {
      showToast("Las reservas seleccionadas ya están pagadas", "error")
      return
    }

    // Actualizar estado de pago y cambiar habitaciones a reservado
    if (setReservas) {
      setReservas((prev) =>
        prev.map((reserva) => {
          if (selectedIds.includes(reserva.id) && !reserva.pago) {
            // Cambiar habitación a estado "reservado"
            if (onActualizarEstadoHabitacion) {
              onActualizarEstadoHabitacion(reserva.habitacion, "reservado")
            }
            return { ...reserva, pago: true }
          }
          return reserva
        }),
      )
    }

    showToast(`${reservasNoPagadas.length} pago(s) confirmado(s)`)
    setSelectedIds([])
  }

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
        if (habitacion && habitacion.precio_actual) {
          newForm.monto = habitacion.precio_actual.toString()
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (
      (!usuarioExistente && (!form.nombres.trim() || !form.apellidos.trim())) ||
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
    // --- ENVÍO AL ENDPOINT ---
    // Obtener hora actual para las fechas
    const now = new Date()
    const horaActual = now.toTimeString().slice(0, 8) // HH:MM:SS
    const fecha_checkin_programado = `${form.entrada}T${horaActual}`
    const fecha_checkout_programado = `${form.salida}T${horaActual}`
    // Obtener dni_admin desde localStorage (usuario.dni)
    let dni_admin = ""
    try {
      const usuarioAdmin = JSON.parse(localStorage.getItem("usuario") || "{}")
      dni_admin = usuarioAdmin?.dni || ""
    } catch {
      dni_admin = ""
    }
    // Construir el JSON exacto
    const payload = {
      dni: form.dni.trim(),
      habitacion_id: form.habitacion.startsWith("HAB") ? form.habitacion : `HAB${form.habitacion}`,
      numero_huespedes: Number.parseInt(form.huespedes),
      fecha_checkin_programado,
      fecha_checkout_programado,
      dni_admin,
    }
    if (!usuarioExistente) {
      payload.nombres = form.nombres.trim()
      payload.apellidos = form.apellidos.trim()
    }
    // Mostrar en consola antes de enviar
    console.log("[RESERVA PENDIENTE] Payload a enviar:", payload)
    // Obtener token de autenticación si existe
    let token = ""
    try {
      token = localStorage.getItem("access") || ""
    } catch {}
    const headers = { "Content-Type": "application/json" }
    if (token) headers["Authorization"] = `Bearer ${token}`
    try {
      const res = await fetch("http://localhost:8000/api/reservas/hospedaje-presencial-pendiente/", {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        showToast("Reserva pendiente registrada correctamente")
      } else {
        const error = await res.json().catch(() => ({}))
        showToast(error.detail || "Error al registrar reserva", "error")
      }
    } catch (err) {
      showToast("Error de red al registrar reserva", "error")
    }
    // --- FIN ENVÍO AL ENDPOINT ---
    const nuevaReserva = {
      id: Date.now().toString(),
      nombre: usuarioExistente ? "-" : `${form.nombres.trim()} ${form.apellidos.trim()}`,
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
      nombres: "",
      apellidos: "",
      dni: "",
      habitacion: "",
      huespedes: "1",
      medioPago: "",
      pago: false,
      monto: "",
      montoTotal: "",
      descuento: "",
      entrada: "",
      salida: "",
      dni_admin: "",
    })
    setUsuarioExistente(false)
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
            <div style={{ gridColumn: "1 / -1", marginBottom: "1rem" }}>
              <label style={{ display: "flex", alignItems: "center", fontSize: "0.875rem", fontWeight: "500" }}>
                <input
                  type="checkbox"
                  checked={usuarioExistente}
                  onChange={(e) => {
                    setUsuarioExistente(e.target.checked)
                    if (e.target.checked) {
                      setForm(prev => ({ ...prev, nombres: "", apellidos: "" }))
                    }
                  }}
                  style={{ marginRight: "0.5rem" }}
                />
                <span>👤 Usuario existente (solo requiere DNI)</span>
              </label>
              {usuarioExistente && (
                <div style={{
                  marginTop: "0.5rem",
                  padding: "0.5rem",
                  backgroundColor: "#ecfdf5",
                  border: "1px solid #d1fae5",
                  borderRadius: "4px",
                  fontSize: "0.75rem",
                  color: "#065f46"
                }}>
                  ✓ Solo se enviará el DNI. Los nombres y apellidos se omitirán del registro.
                </div>
              )}
            </div>
            {/* Campos de nombres y apellidos */}
            <div>
              <label className="form-label">Nombres *</label>
              <input
                className="form-input"
                type="text"
                value={form.nombres}
                onChange={(e) => handleInputChange("nombres", e.target.value)}
                placeholder="Ej. Juan Carlos"
                required={!usuarioExistente}
                disabled={usuarioExistente}
                style={usuarioExistente ? { backgroundColor: "#f3f4f6" } : {}}
              />
            </div>
            <div>
              <label className="form-label">Apellidos *</label>
              <input
                className="form-input"
                type="text"
                value={form.apellidos}
                onChange={(e) => handleInputChange("apellidos", e.target.value)}
                placeholder="Ej. Pérez Gómez"
                required={!usuarioExistente}
                disabled={usuarioExistente}
                style={usuarioExistente ? { backgroundColor: "#f3f4f6" } : {}}
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
                placeholder="Se completa automáticamente al seleccionar habitación"
                style={{ backgroundColor: "#f8fafc" }}
                required
              />
              <div style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "0.25rem" }}>
                💡 Se completa automáticamente al seleccionar una habitación
              </div>
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

            <div style={{ gridColumn: "1 / -1", marginTop: "0.5rem", display: "flex", gap: "0.75rem" }}>
              <button type="submit" className="btn btn-primary">
                ➕ Registrar Reserva
              </button>
              <button
                type="button"
                className="btn btn-success"
                onClick={handleConfirmarReservas}
                disabled={selectedIds.length === 0}
                style={{ backgroundColor: "#10b981", borderColor: "#10b981", color: "white"}}
              >
                ✅ Check-in ({selectedIds.length})
              </button>
              <button
                type="button"
                className="btn"
                onClick={handleConfirmarPago}
                disabled={selectedIds.length === 0}
                style={{
                  backgroundColor: "#8b5cf6",
                  borderColor: "#8b5cf6",
                  color: "white",
                }}
              >
                💳 Confirmar Pago ({selectedIds.length})
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
                  <td style={{ padding: "0.75rem", fontWeight: "500" }}>{r.nombres}</td>
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