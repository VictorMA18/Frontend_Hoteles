"use client"

import { useState } from "react"

const Reservas = () => {
  const [reservas, setReservas] = useState([])
  const [form, setForm] = useState({
    nombre: "",
    dni: "",
    habitacion: "",
    pago: false,
    monto: "",
    entrada: "",
    salida: "",
  })

  const handleInputChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
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

    const nuevaReserva = {
      id: Date.now().toString(),
      ...form,
      pago: Boolean(form.pago),
      monto: Number.parseFloat(form.monto),
    }

    setReservas((prev) => [...prev, nuevaReserva])
    setForm({ nombre: "", dni: "", habitacion: "", pago: false, monto: "", entrada: "", salida: "" })
    showToast(`Reserva de ${nuevaReserva.nombre} agregada`)
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
            style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}
          >
            <div>
              <label className="form-label">Nombre Completo *</label>
              <input
                className="form-input"
                type="text"
                value={form.nombre}
                onChange={(e) => handleInputChange("nombre", e.target.value)}
                placeholder="Ej. Juan Pérez"
                style={{ width: "100%" }}
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
                style={{ width: "100%" }}
              />
            </div>

            <div>
              <label className="form-label">Habitación *</label>
              <input
                className="form-input"
                type="text"
                value={form.habitacion}
                onChange={(e) => handleInputChange("habitacion", e.target.value)}
                placeholder="201"
                style={{ width: "100%" }}
              />
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <input
                type="checkbox"
                checked={form.pago}
                onChange={(e) => handleInputChange("pago", e.target.checked)}
                style={{ transform: "scale(1.2)" }}
              />
              <label className="form-label" style={{ margin: 0 }}>
                Pago Realizado
              </label>
            </div>

            <div>
              <label className="form-label">Monto (S/) *</label>
              <input
                className="form-input"
                type="number"
                step="0.01"
                value={form.monto}
                onChange={(e) => handleInputChange("monto", e.target.value)}
                placeholder="0.00"
                style={{ width: "100%" }}
              />
            </div>

            <div>
              <label className="form-label">Fecha Entrada *</label>
              <input
                className="form-input"
                type="date"
                value={form.entrada}
                onChange={(e) => handleInputChange("entrada", e.target.value)}
                style={{ width: "100%" }}
              />
            </div>

            <div>
              <label className="form-label">Fecha Salida *</label>
              <input
                className="form-input"
                type="date"
                value={form.salida}
                onChange={(e) => handleInputChange("salida", e.target.value)}
                style={{ width: "100%" }}
              />
            </div>

            <div style={{ gridColumn: "1 / -1", marginTop: "0.5rem" }}>
              <button type="submit" className="btn btn-primary">
                ➕ Registrar Reserva
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
                    textAlign: "left",
                    fontWeight: "600",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  Habitación
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
                  Monto
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
                  <td style={{ padding: "0.75rem", fontWeight: "500" }}>{r.nombre}</td>
                  <td style={{ padding: "0.75rem" }}>{r.dni}</td>
                  <td style={{ padding: "0.75rem" }}>{r.habitacion}</td>
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
                  <td style={{ padding: "0.75rem" }}>S/ {r.monto.toFixed(2)}</td>
                  <td style={{ padding: "0.75rem" }}>{r.entrada}</td>
                  <td style={{ padding: "0.75rem" }}>{r.salida}</td>
                </tr>
              ))}
              {reservas.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", padding: "2rem", color: "#6b7280" }}>
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