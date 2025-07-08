import { useState, useEffect } from "react"
import axiosInstance from "@/libs/axiosInstance";
import { filtrarPorCampos } from "@/libs/utils"

const Hospedaje = ({ huespedes, setHuespedes, habitacionesData, onRegistrarHuesped, onCheckoutHuespedes, fetchHabitaciones, fetchReservas }) => {
  const [selectedIds, setSelectedIds] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [form, setForm] = useState({
    nombres: "",
    apellidos: "",
    dni: "",
    habitacion: "",
    pago: "",
    monto: "",
    descuento: "0",
    huespedes: "1",
    diasHospedaje: "1",
    montoTotal: "",
  })
  const [loading, setLoading] = useState(false)
  const [usuarioExistente, setUsuarioExistente] = useState(false)
  const [reservasBackend, setReservasBackend] = useState([])

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

  // Obtener reservas confirmadas/ocupadas/limpieza del backend al cargar
  useEffect(() => {
    const fetchReservas = async () => {
      try {
        const res = await axiosInstance.get("http://localhost:8000/api/reservas/confirmadas-ocupadas-limpieza/")
        setReservasBackend(res.data)
      } catch (err) {
        // Puedes mostrar un toast si quieres
        // showToast("No se pudieron cargar las reservas del backend", "error")
        setReservasBackend([])
      }
    }
    fetchReservas()
  }, [])

  // Efecto para consultar visitas hospedadas y aplicar descuento automático
  useEffect(() => {
    const fetchVisitasYDescuento = async () => {
      if (form.dni && form.dni.length === 8 && /^\d{8}$/.test(form.dni)) {
        try {
          const res = await axiosInstance.get(`http://localhost:8000/api/usuarios/${form.dni}/visitas-hospedadas/`)
          console.log("Visitas hospedadas:", res.data)
          const totalVisitas = res.data?.total_visitas_hospedadas || 0
          // Si tiene 5 visitas, aplicar 10% de descuento
          if (totalVisitas >= 10) {
            setForm((prev) => ({
              ...prev,
              descuento: "15"
            }))
          }
          else if (totalVisitas >= 5) {
            setForm((prev) => ({
              ...prev,
              descuento: "10"
            }))
          } else {
            setForm((prev) => ({
              ...prev,
              descuento: "0"
            }))
          }
        } catch (err) {
          // Si hay error, no aplicar descuento
          setForm((prev) => ({
            ...prev,
            descuento: "0"
          }))
        }
      } else {
        // Si el DNI no es válido, no aplicar descuento
        setForm((prev) => ({
          ...prev,
          descuento: "0"
        }))
      }
    }
    fetchVisitasYDescuento()
    // Solo cuando cambia el DNI
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.dni])

  const handleInputChange = (field, value) => {
    setForm((prev) => {
      const newForm = { ...prev, [field]: value }

      // Auto-completar monto cuando se selecciona habitación
      if (field === "habitacion" && value) {
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

    setTimeout(() => {
      toast.classList.add("toast-show")
    }, 100)

    setTimeout(() => {
      toast.classList.remove("toast-show")
      setTimeout(() => document.body.removeChild(toast), 300)
    }, 3000)
  }

  const MEDIOS_PAGO_VALIDOS = ["efectivo", "tarjeta", "yape", "plin"];

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validar que el medio de pago sea uno de los permitidos
    if (!form.pago || !MEDIOS_PAGO_VALIDOS.includes(form.pago)) {
      showToast("Por favor selecciona un medio de pago válido", "error")
      return
    }

    if (
      (!usuarioExistente && (!form.nombres.trim() || !form.apellidos.trim())) ||
      !form.dni.trim() ||
      !form.habitacion.trim() ||
      !form.pago ||
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

    const usuarioAdmin = JSON.parse(localStorage.getItem("usuario") || "{}");
    const dniAdmin = usuarioAdmin?.dni || "";

    if (!dniAdmin) {
      showToast("Error: No se encontró información del administrador. Por favor, inicia sesión nuevamente.", "error")
      return
    }

    // Construir el payload para el endpoint con campos limpios
    const payload = {
      dni: form.dni.trim(),
      habitacion_id: `HAB${form.habitacion.trim()}`,
      numero_huespedes: Number(form.huespedes),
      dias: Number(form.diasHospedaje),
      dni_admin: dniAdmin,
      pago: form.pago, // aseguramos que siempre se envía el campo pago
    };

    // Solo incluir nombres y apellidos si no es usuario existente
    if (!usuarioExistente) {
      payload.nombres = form.nombres.trim().replace(/\s+/g, ' ');
      payload.apellidos = form.apellidos.trim().replace(/\s+/g, ' ');
    }

    // Validación final de payload
    if (!usuarioExistente && (!payload.nombres || !payload.apellidos)) {
      showToast("Error: Nombres y apellidos son requeridos para usuarios nuevos", "error")
      return
    }
    
    if (!payload.dni) {
      showToast("Error: DNI es requerido", "error")
      return
    }

    // Validar que los nombres y apellidos no contengan caracteres especiales problemáticos (solo si no es usuario existente)
    if (!usuarioExistente) {
      const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
      if (!nameRegex.test(payload.nombres)) {
        showToast("El nombre solo puede contener letras y espacios", "error")
        return
      }
      
      if (!nameRegex.test(payload.apellidos)) {
        showToast("El apellido solo puede contener letras y espacios", "error")
        return
      }
    }

    setLoading(true)
    try {
      // Enviar al endpoint del backend
      const response = await axiosInstance.post("http://localhost:8000/api/reservas/hospedaje-presencial/", payload, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      console.log("Respuesta del backend:", response.data)

      showToast("Registro exitoso del huésped", "success")
      
      // Crear objeto para el registro local
      const ahora = new Date()
      const nuevoHuesped = {
        id: response.data?.id || Date.now().toString(),
        nombre: usuarioExistente ? `Usuario DNI: ${form.dni}` : `${form.nombres} ${form.apellidos}`,
        dni: form.dni,
        habitacion: form.habitacion,
        pago: form.pago,
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
      
      // Usar la función del componente padre para registrar el huésped localmente
      onRegistrarHuesped(nuevoHuesped)
      setForm({
        nombres: "",
        apellidos: "",
        dni: "",
        habitacion: "",
        pago: "",
        monto: "",
        descuento: "0",
        huespedes: "1",
        diasHospedaje: "1",
        montoTotal: "",
      })
      setUsuarioExistente(false)
      // Refrescar habitaciones si la función está disponible
      if (typeof fetchHabitaciones === "function") fetchHabitaciones()
      // Refrescar reservas si la función está disponible
      if (typeof fetchReservas === "function") fetchReservas()
      
      // Refrescar reservas del backend local para actualizar la tabla inmediatamente
      try {
        const res = await axiosInstance.get("http://localhost:8000/api/reservas/confirmadas-ocupadas-limpieza/")
        setReservasBackend(res.data)
      } catch (err) {
        console.error("Error al actualizar reservas locales:", err)
      }
    } catch (error) {
      let errorMessage = "Error desconocido al registrar huésped";
      if (error.response) {
        const { data } = error.response;
        if (data) {
          if (typeof data === 'string') {
            errorMessage = data;
          } else if (data.detail) {
            errorMessage = data.detail;
          } else if (data.message) {
            errorMessage = data.message;
          } else {
            // Si hay errores de validación específicos, mostrarlos
            const errores = [];
            for (const [campo, mensajes] of Object.entries(data)) {
              if (Array.isArray(mensajes)) {
                errores.push(`${campo}: ${mensajes.join(', ')}`);
              } else if (typeof mensajes === 'string') {
                errores.push(`${campo}: ${mensajes}`);
              }
            }
            if (errores.length > 0) {
              errorMessage = errores.join('; ');
            } else {
              errorMessage = JSON.stringify(data);
            }
          }
        }
      } else if (error.request) {
        errorMessage = "No se recibió respuesta del servidor. Verifica tu conexión.";
      } else {
        errorMessage = error.message;
      }
      showToast(`Error al registrar huésped: ${errorMessage}`, "error")
    } finally {
      setLoading(false)
    }
  }

  const handleCheckout = async () => {
    if (selectedIds.length === 0) {
      showToast("Selecciona al menos un huésped para hacer checkout", "error")
      return
    }

    setLoading(true)
    let exito = 0
    let errores = []
    for (const id of selectedIds) {
      try {
        await axiosInstance.post(`http://localhost:8000/api/reservas/${id}/check-out/`)
        exito++
      } catch (err) {
        errores.push(id)
      }
    }
    setLoading(false)
    if (exito > 0) {
      showToast(`${exito} huésped(es) han hecho checkout`, "success")
      // Refrescar reservas del backend
      try {
        const res = await axiosInstance.get("http://localhost:8000/api/reservas/confirmadas-ocupadas-limpieza/")
        setReservasBackend(res.data)
      } catch {}
      // Refrescar reservas globales del padre
      if (typeof fetchReservas === "function") fetchReservas()
      // Refrescar habitaciones del padre
      if (typeof fetchHabitaciones === "function") fetchHabitaciones()
    }
    if (errores.length > 0) {
      showToast(`Error al hacer checkout de: ${errores.join(", ")}`, "error")
    }
    setSelectedIds([])
  }

  const handleSelectHuesped = (id, checked) => {
    setSelectedIds((prev) => (checked ? [...prev, id] : prev.filter((selectedId) => selectedId !== id)))
  }

  function formatearFechaHora(fechaIso) {
    if (!fechaIso) return { fecha: "", hora: "" };
    const fechaObj = new Date(fechaIso);
    const fecha = fechaObj.toLocaleDateString("es-PE");
    const hora = fechaObj.toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" });
    return { fecha, hora };
  }

  // Mapeo de reservas del backend a estructura de la tabla
  const reservasMapeadas = reservasBackend.map((res) => {
    const { fecha: fechaEntrada, hora: horaEntrada } = formatearFechaHora(res.fecha_checkin_real);
    const { fecha: fechaSalida, hora: horaSalida } = formatearFechaHora(res.fecha_checkout_real);
    const { fecha: fechaInicioReserva, hora: horaInicioReserva } = formatearFechaHora(res.fecha_checkin_programado);
    const { fecha: fechaFinReserva, hora: horaFinReserva } = formatearFechaHora(res.fecha_checkout_programado);
    return {
      id: res.id,
      nombre: `${res.usuario_nombres || ''} ${res.usuario_apellidos || ''}`.trim() || `Usuario DNI: ${res.usuario_dni}`,
      dni: res.usuario_dni,
      habitacion: `${res.habitacion_numero} - ${res.habitacion_tipo}`,
      huespedes: res.numero_huespedes,
      diasHospedaje: res.total_noches,
      pago: res.pago || '',
      monto: Number(res.precio_noche) || 0,
      montoTotal: Number(res.total_pagar) || 0,
      descuento: Number(res.descuento) || 0,
      estancia: res.fecha_checkout_real ? "finalizada" : "activa",
      pagado: true,
      fechaEntrada,
      horaEntrada,
      fechaSalida,
      horaSalida,
      usuario: res.usuario_admin || '',
      fechaInicioReserva,
      horaInicioReserva,
      fechaFinReserva,
      horaFinReserva,
    };
  });

  // --- FILTRADO REUTILIZABLE DE HUÉSPEDES/RESERVAS ---
  const filteredHuespedes = reservasBackend.length > 0
    ? filtrarPorCampos(reservasMapeadas, searchTerm, ["nombre", "dni", "habitacion"])
    : filtrarPorCampos(huespedes, searchTerm, ["nombre", "dni", "habitacion"]);

  // Unificar huéspedes locales y backend (evitar duplicados por id)
  const todosHuespedes = reservasBackend.length > 0
    ? reservasMapeadas
    : huespedes;

  // Sumar correctamente el total de huéspedes y activos SOLO con la fuente principal
  const huespedesTotales = todosHuespedes.reduce((total, h) => total + (Number(h.huespedes) || 1), 0);
  const huespedesActivos = todosHuespedes.filter((h) => h.estancia === "activa").reduce((total, h) => total + (Number(h.huespedes) || 1), 0);
  // El ingreso total debe ser la suma directa de montoTotal (ya con descuento aplicado) o monto si no existe
  const ingresoTotal = todosHuespedes.reduce((total, h) => total + (Number(h.montoTotal) || Number(h.monto) || 0), 0)

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
            {/* Checkbox para usuario existente */}
            <div style={{ gridColumn: "1 / -1", marginBottom: "1rem" }}>
              <label style={{ display: "flex", alignItems: "center", fontSize: "0.875rem", fontWeight: "500" }}>
                <input
                  type="checkbox"
                  checked={usuarioExistente}
                  onChange={(e) => {
                    setUsuarioExistente(e.target.checked)
                    // Limpiar los campos de nombres y apellidos cuando se activa
                    if (e.target.checked) {
                      setForm(prev => ({
                        ...prev,
                        nombres: "",
                        apellidos: ""
                      }))
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

            <div>
              <label className="form-label">
                Nombre {!usuarioExistente && "*"}
              </label>
              <input
                className="form-input"
                type="text"
                value={form.nombres}
                onChange={(e) => handleInputChange("nombres", e.target.value)}
                placeholder={usuarioExistente ? "No requerido" : "Nombres"}
                required={!usuarioExistente}
                disabled={usuarioExistente}
                style={usuarioExistente ? { backgroundColor: "#f3f4f6", cursor: "not-allowed" } : {}}
              />
            </div>
            <div>
              <label className="form-label">
                Apellido {!usuarioExistente && "*"}
              </label>
              <input
                className="form-input"
                type="text"
                value={form.apellidos}
                onChange={(e) => handleInputChange("apellidos", e.target.value)}
                placeholder={usuarioExistente ? "No requerido" : "Apellidos"}
                required={!usuarioExistente}
                disabled={usuarioExistente}
                style={usuarioExistente ? { backgroundColor: "#f3f4f6", cursor: "not-allowed" } : {}}
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
                value={form.pago}
                onChange={(e) => handleInputChange("pago", e.target.value)}
                required
              >
                <option value="">Selecciona método</option>
                <option value="efectivo">Efectivo</option>
                <option value="tarjeta">Tarjeta</option>
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
                placeholder="Se completa automáticamente al seleccionar habitación"
                style={{ backgroundColor: "#f8fafc" }}
                required
              />
              <div style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "0.25rem" }}>
                💡 Se completa automáticamente al seleccionar una habitación
              </div>
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
              {/* Mostrar descuento y mensaje si aplica */}
              {form.diasHospedaje && form.monto && (
                <div style={{ fontSize: "0.75rem", color: form.descuento > 0 ? "#059669" : "#6b7280", marginTop: "0.25rem" }}>
                  {console.log(form.descuento)}
                  {form.descuento > 0
                    ? `${form.diasHospedaje} día(s) con ${form.descuento}% descuento`
                    : `${form.diasHospedaje} día(s) sin descuento`}
                </div>
              )}
            </div>

            <div className="button-group" style={{ gridColumn: "1 / -1", marginTop: "0.5rem" }}>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Registrando..." : "➕ Registrar Huésped"}
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
            <table className="data-table" style={{ minWidth: 1200, tableLayout: 'fixed' }}>
              <thead>
                <tr>
                  <th style={{ width: "4%", minWidth: 50 }}>Sel.</th>
                  <th style={{ width: "13%", minWidth: 120 }}>Nombre</th>
                  <th style={{ width: "8%", minWidth: 90 }}>DNI</th>
                  <th style={{ width: "10%", minWidth: 110 }}>Habitación</th>
                  <th style={{ width: "7%", minWidth: 80 }}>Huéspedes</th>
                  <th style={{ width: "7%", minWidth: 80 }}>Días</th>
                  <th style={{ width: "8%", minWidth: 90 }}>Pago</th>
                  <th style={{ width: "10%", minWidth: 110 }}>Monto Total</th>
                  <th style={{ width: "8%", minWidth: 90 }}>Estado</th>
                  <th style={{ width: "10%", minWidth: 120 }}>Entrada</th>
                  <th style={{ width: "10%", minWidth: 120 }}>Salida</th>
                  <th style={{ width: "10%", minWidth: 120 }}>Administrador</th>
                  <th style={{ width: "13%", minWidth: 140, whiteSpace: 'normal' }}>Fecha inicio de reserva</th>
                  <th style={{ width: "13%", minWidth: 140, whiteSpace: 'normal' }}>Fecha fin de reserva</th>
                </tr>
              </thead>
              <tbody>
                {filteredHuespedes.map((huesped) => (
                  console.log("Huespedes", huesped),
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
                    <td style={{ textTransform: "capitalize", color: "#1a202c" }}>{huesped.pago}</td>
                    <td style={{ color: "#1a202c" }}>
                      <div>S/ {((huesped.montoTotal || huesped.monto)).toFixed(2)}</div>
                      {huesped.descuento > 0 && (
                        <div style={{ fontSize: "0.75rem", color: "#059669" }}>-{((huesped.descuento * 100) / huesped.monto) / huesped.diasHospedaje}% desc.</div>
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
                    <td style={{ fontWeight: "500", color: "#1a202c" }}>
                      {huesped.usuario}
                    </td>
                    <td style={{ color: "#1a202c" }}>
                      {huesped.fechaInicioReserva ? (
                        <div>
                          <div style={{ fontSize: "0.75rem", fontWeight: 500 }}>📅 {huesped.fechaInicioReserva}</div>
                          <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>🕐 {huesped.horaInicioReserva}</div>
                        </div>
                      ) : (
                        <span style={{ color: "#9ca3af" }}>-</span>
                      )}
                    </td>
                    <td style={{ color: "#1a202c" }}>
                      {huesped.fechaFinReserva ? (
                        <div>
                          <div style={{ fontSize: "0.75rem", fontWeight: 500 }}>📅 {huesped.fechaFinReserva}</div>
                          <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>🕐 {huesped.horaFinReserva}</div>
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