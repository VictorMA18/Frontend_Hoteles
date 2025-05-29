import React, { useState } from 'react';
import './Hospedaje.css';

const Hospedaje = () => {
  const [huespedes, setHuespedes] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [form, setForm] = useState({
    nombre: "",
    dni: "",
    habitacion: "",
    medioPago: "",
    monto: "",
    descuento: "0",
  });

  const handleInputChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const showToast = (message, type = 'success') => {
    // Simple toast notification
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.add('toast-show');
    }, 100);
    
    setTimeout(() => {
      toast.classList.remove('toast-show');
      setTimeout(() => document.body.removeChild(toast), 300);
    }, 3000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validación mejorada
    if (!form.nombre.trim() || !form.dni.trim() || !form.habitacion.trim() || !form.medioPago || !form.monto) {
      showToast("Por favor completa todos los campos obligatorios", 'error');
      return;
    }

    // Validación de DNI (8 dígitos)
    if (form.dni.length !== 8 || !/^\d+$/.test(form.dni)) {
      showToast("El DNI debe tener exactamente 8 dígitos", 'error');
      return;
    }

    // Validación de monto
    if (parseFloat(form.monto) <= 0) {
      showToast("El monto debe ser mayor a 0", 'error');
      return;
    }

    const ahora = new Date();
    const nuevoHuesped = {
      id: Date.now().toString(),
      nombre: form.nombre.trim(),
      dni: form.dni.trim(),
      habitacion: form.habitacion.trim(),
      medioPago: form.medioPago,
      monto: parseFloat(form.monto),
      estancia: "activa",
      pagado: true,
      descuento: parseFloat(form.descuento) || 0,
      fechaEntrada: ahora.toLocaleDateString("es-PE"),
      horaEntrada: ahora.toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" }),
      fechaSalida: "",
      horaSalida: ""
    };

    setHuespedes((prev) => [...prev, nuevoHuesped]);
    
    // Limpiar formulario
    setForm({
      nombre: "",
      dni: "",
      habitacion: "",
      medioPago: "",
      monto: "",
      descuento: "0",
    });

    showToast(`${nuevoHuesped.nombre} ha sido registrado exitosamente`);
  };

  const handleCheckout = () => {
    if (selectedIds.length === 0) {
      showToast("Selecciona al menos un huésped para hacer checkout", 'error');
      return;
    }

    const ahora = new Date();
    setHuespedes((prev) =>
      prev.map((huesped) =>
        selectedIds.includes(huesped.id)
          ? {
              ...huesped,
              estancia: "finalizada",
              fechaSalida: ahora.toLocaleDateString("es-PE"),
              horaSalida: ahora.toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" }),
            }
          : huesped,
      ),
    );

    showToast(`${selectedIds.length} huésped(es) han hecho checkout`);
    setSelectedIds([]);
  };

  const handleSelectHuesped = (id, checked) => {
    setSelectedIds((prev) => 
      checked ? [...prev, id] : prev.filter((selectedId) => selectedId !== id)
    );
  };

  const filteredHuespedes = huespedes.filter(
    (huesped) =>
      huesped.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      huesped.dni.includes(searchTerm) ||
      huesped.habitacion.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const huespedesTotales = huespedes.length;
  const huespedesActivos = huespedes.filter((h) => h.estancia === "activa").length;
  const ingresoTotal = huespedes.reduce((total, h) => total + h.monto * (1 - h.descuento / 100), 0);

  return (
    <div className="hospedaje-container">
      <div className="hospedaje-content">
        {/* Header */}
        <div className="header">
          <div className="header-title">
            <span className="hotel-icon">🏨</span>
            <h1>Sistema de Hospedaje</h1>
          </div>
          <p className="header-subtitle">Gestión integral de huéspedes y reservas</p>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-content">
              <span className="stat-icon">👥</span>
              <div className="stat-info">
                <p className="stat-label">Total Huéspedes</p>
                <p className="stat-value">{huespedesTotales}</p>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-content">
              <span className="stat-icon">🏨</span>
              <div className="stat-info">
                <p className="stat-label">Huéspedes Activos</p>
                <p className="stat-value">{huespedesActivos}</p>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-content">
              <span className="stat-icon">💳</span>
              <div className="stat-info">
                <p className="stat-label">Ingresos Total</p>
                <p className="stat-value">S/ {ingresoTotal.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Registration Form */}
        <div className="form-card">
          <div className="card-header">
            <h2>➕ Registrar Nuevo Huésped</h2>
          </div>
          <div className="card-content">
            <form onSubmit={handleSubmit} className="form-grid">
              <div className="input-group">
                <label htmlFor="nombre">Nombre Completo *</label>
                <input
                  id="nombre"
                  type="text"
                  value={form.nombre}
                  onChange={(e) => handleInputChange("nombre", e.target.value)}
                  placeholder="Ingresa el nombre completo"
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="dni">DNI *</label>
                <input
                  id="dni"
                  type="text"
                  value={form.dni}
                  onChange={(e) => handleInputChange("dni", e.target.value)}
                  placeholder="12345678"
                  maxLength={8}
                  pattern="[0-9]{8}"
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="habitacion">Habitación *</label>
                <input
                  id="habitacion"
                  type="text"
                  value={form.habitacion}
                  onChange={(e) => handleInputChange("habitacion", e.target.value)}
                  placeholder="101, 102, etc."
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="medioPago">Medio de Pago *</label>
                <select
                  id="medioPago"
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

              <div className="input-group">
                <label htmlFor="monto">Monto (S/) *</label>
                <input
                  id="monto"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={form.monto}
                  onChange={(e) => handleInputChange("monto", e.target.value)}
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="descuento">Descuento (%)</label>
                <input
                  id="descuento"
                  type="number"
                  min="0"
                  max="100"
                  value={form.descuento}
                  onChange={(e) => handleInputChange("descuento", e.target.value)}
                  placeholder="0"
                />
              </div>

              <div className="button-group">
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
        <div className="table-card">
          <div className="card-header">
            <h2>Lista de Huéspedes</h2>
            <div className="search-container">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Buscar por nombre, DNI o habitación..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
          <div className="card-content">
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Sel.</th>
                    <th>Nombre</th>
                    <th>DNI</th>
                    <th>Habitación</th>
                    <th>Pago</th>
                    <th>Monto</th>
                    <th>Estado</th>
                    <th>Entrada</th>
                    <th>Salida</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHuespedes.map((huesped) => (
                    <tr key={huesped.id} className="table-row">
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(huesped.id)}
                          onChange={(e) => handleSelectHuesped(huesped.id, e.target.checked)}
                          disabled={huesped.estancia === "finalizada"}
                        />
                      </td>
                      <td className="font-medium">{huesped.nombre}</td>
                      <td>{huesped.dni}</td>
                      <td>{huesped.habitacion}</td>
                      <td className="capitalize">{huesped.medioPago}</td>
                      <td>
                        <div>
                          <div>S/ {huesped.monto.toFixed(2)}</div>
                          {huesped.descuento > 0 && (
                            <div className="discount-text">-{huesped.descuento}% desc.</div>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${huesped.estancia === "activa" ? "badge-active" : "badge-inactive"}`}>
                          {huesped.estancia === "activa" ? "Activo" : "Finalizado"}
                        </span>
                      </td>
                      <td>
                        <div className="date-time">
                          <div>📅 {huesped.fechaEntrada}</div>
                          <div className="time-text">🕐 {huesped.horaEntrada}</div>
                        </div>
                      </td>
                      <td>
                        {huesped.fechaSalida ? (
                          <div className="date-time">
                            <div>📅 {huesped.fechaSalida}</div>
                            <div className="time-text">🕐 {huesped.horaSalida}</div>
                          </div>
                        ) : (
                          <span className="empty-cell">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredHuespedes.length === 0 && (
                <div className="empty-state">
                  {searchTerm
                    ? "No se encontraron huéspedes que coincidan con la búsqueda"
                    : "No hay huéspedes registrados"}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hospedaje;