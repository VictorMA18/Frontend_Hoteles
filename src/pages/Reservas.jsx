import { useState, useEffect } from "react"
import axiosInstance from "@/libs/axiosInstance"
import { filtrarPorCampos } from "@/libs/utils"

const Reservas = ({ habitacionesData, roomTypeMapping, onConfirmarReservas, fetchHabitaciones, fetchReservas }) => {
  const [reservas, setReservas] = useState([])
  const [selectedIds, setSelectedIds] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [checkedInIds, setCheckedInIds] = useState(new Set()) // Persistir IDs con check-in realizado
  const [form, setForm] = useState({
    nombres: "",
    apellidos: "",
    dni: "",
    habitacion: "",
    huespedes: "1",
    medioPago: "",
    pago: "",
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

  // Función para formatear fecha y hora desde string ISO (igual que en Hospedaje)
  function formatearFecha(fechaIso) {
    if (!fechaIso) return "";
    const fechaObj = new Date(fechaIso);
    return fechaObj.toLocaleDateString("es-PE");
  }
  function formatearFechaHora(fechaIso) {
    if (!fechaIso) return { fecha: "", hora: "" };
    const fechaObj = new Date(fechaIso);
    const fecha = fechaObj.toLocaleDateString("es-PE");
    const hora = fechaObj.toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" });
    return { fecha, hora };
  }

  // Obtener reservas del backend al cargar o refrescar
  const fetchReservasLocal = async () => {
    try {
      const res = await axiosInstance.get("http://localhost:8000/api/reservas/todas/")
      // --- Adaptar lógica de descuento histórico igual que en hospedaje ---
      // Agrupar reservas por usuario (DNI)
      const reservasPorUsuario = {}
      res.data.forEach((r) => {
        if (!reservasPorUsuario[r.usuario_dni]) reservasPorUsuario[r.usuario_dni] = []
        reservasPorUsuario[r.usuario_dni].push(r)
      })
      // Para cada usuario, ordenar reservas por fecha de creación y simular el conteo de visitas
      Object.values(reservasPorUsuario).forEach((reservasUsuario) => {
        reservasUsuario.sort((a, b) => new Date(a.fecha_creacion) - new Date(b.fecha_creacion))
        let visitasAcumuladas = 0
        reservasUsuario.forEach((r) => {
          // Si la reserva está finalizada o tiene check-in real, cuenta como visita hospedada
          const esHospedada = r.id_estado_reserva === 4 || !!r.fecha_checkin_real
          // Guardar el número de visitas acumuladas ANTES de esta reserva
          r.visitas_al_momento = visitasAcumuladas
          if (esHospedada) visitasAcumuladas++
        })
      })
      // Mapear reservas usando visitas_al_momento para decidir el descuento y adaptar estructura igual que Hospedaje
      const estadoPorId = {
        1: "Pendiente",
        2: "Confirmada", 
        3: "Cancelada",
        4: "Finalizada",
      }
      const reservasMapeadas = res.data.map((r) => {
        const reservaExistente = reservas.find(reservaLocal => reservaLocal.id === r.id)
        const hasCheckedIn = checkedInIds.has(r.id)
        const descuento = (r.visitas_al_momento >= 5) ? 10 : 0
        const dias = r.total_noches || r.dias || 1
        const montoNoche = Number(r.precio_noche) || 0
        const montoTotal = r.total_pagar !== undefined && r.total_pagar !== null
          ? Number(r.total_pagar)
          : (montoNoche * dias) * (1 - descuento / 100)
        const { fecha: fechaEntrada, hora: horaEntrada } = formatearFechaHora(r.fecha_checkin_real)
        const { fecha: fechaSalida, hora: horaSalida } = formatearFechaHora(r.fecha_checkout_real)
        const { fecha: fechaInicioReserva, hora: horaInicioReserva } = formatearFechaHora(r.fecha_checkin_programado)
        const { fecha: fechaFinReserva, hora: horaFinReserva } = formatearFechaHora(r.fecha_checkout_programado)
        return {
          id: r.id,
          nombres: `${r.usuario_nombres || ''} ${r.usuario_apellidos || ''}`.trim() || `Usuario DNI: ${r.usuario_dni}`,
          dni: r.usuario_dni,
          habitacion: r.habitacion_numero || r.habitacion,
          huespedes: r.numero_huespedes || r.huespedes || 1,
          medioPago: r.medio_pago || '',
          pago: r.pago || '',
          monto: montoNoche,
          montoTotal: montoTotal,
          descuento: r.descuento,
          entrada: fechaInicioReserva || r.entrada || '',
          salida: fechaFinReserva || r.salida || '',
          dias: dias,
          estado: estadoPorId[r.id_estado_reserva] || r.estado_nombre || r.estado || 'En espera',
          fechaCreacion: r.fecha_creacion ? new Date(r.fecha_creacion).toLocaleDateString("es-PE") : '',
          total_visitas_hospedadas: r.visitas_al_momento,
          checkedIn: hasCheckedIn && !r.fecha_checkin_real,
          hasRealCheckin: !!r.fecha_checkin_real,
          usuario: r.usuario_admin || '',
          fechaEntrada,
          horaEntrada,
          fechaSalida,
          horaSalida,
          fechaInicioReserva,
          horaInicioReserva,
          fechaFinReserva,
          horaFinReserva,
        }
      })
      // Limpiar IDs de check-in temporal para reservas que ya tienen check-in real
      const newCheckedInIds = new Set(checkedInIds)
      res.data.forEach(r => {
        if (r.fecha_checkin_real && checkedInIds.has(r.id)) {
          newCheckedInIds.delete(r.id)
        }
      })
      setCheckedInIds(newCheckedInIds)
      setReservas(reservasMapeadas)
    } catch (err) {
      setReservas([])
    }
  }

  useEffect(() => {
    fetchReservasLocal()
  }, [])

  // Acción de Check-in
  const handleCheckIn = async () => {
    if (selectedIds.length === 0) {
      showToast("Selecciona al menos una reserva para hacer check-in", "error")
      return
    }
    let token = ""
    try {
      token = localStorage.getItem("access") || ""
    } catch {}
    const headers = { "Content-Type": "application/json" }
    if (token) headers["Authorization"] = `Bearer ${token}`
    let success = 0
    const idsExitosos = []
    for (const reservaId of selectedIds) {
      try {
        const res = await axiosInstance.post(`http://localhost:8000/api/reservas/${reservaId}/check-in/`)
        success++
        idsExitosos.push(reservaId)
      } catch {
        // Error silencioso, el contador de success se encarga del manejo
      }
    }
    if (success > 0) {
      showToast(`${success} check-in(s) realizado(s)`)
      
      // Agregar IDs exitosos al Set persistente de check-ins
      const newCheckedInIds = new Set(checkedInIds)
      idsExitosos.forEach(id => newCheckedInIds.add(id))
      setCheckedInIds(newCheckedInIds)
      
      // Actualizar inmediatamente las reservas que hicieron check-in para mostrar como "ocupadas"
      setReservas((prevReservas) =>
        prevReservas.map((reserva) => {
          if (idsExitosos.includes(reserva.id)) {
            return { ...reserva, checkedIn: true } // Agregar flag temporal para identificar check-in
          }
          return reserva
        })
      )
      
      // Dar tiempo al backend para procesar el cambio antes de refrescar
      setTimeout(async () => {
        // Refrescar habitaciones primero para asegurar que se actualicen los estados
        if (typeof fetchHabitaciones === "function") await fetchHabitaciones()
        
        // Luego refrescar las reservas
        await fetchReservasLocal()
        
        // Finalmente refrescar reservas globales del padre
        if (typeof fetchReservas === "function") await fetchReservas()
      }, 1000) // 1 segundo de delay
    } else {
      showToast("No se pudo realizar el check-in", "error")
    }
    setSelectedIds([])
  }

  // Acción de Confirmar Pago
  const handleConfirmarPago = async () => {
    if (selectedIds.length === 0) {
      showToast("Selecciona al menos una reserva para confirmar el pago", "error")
      return
    }
    let success = 0
    for (const reservaId of selectedIds) {
      try {
        await axiosInstance.post(`http://localhost:8000/api/reservas/${reservaId}/confirmar/`)
        success++
      } catch (err) {
        console.error(`Error al confirmar pago para reserva ${reservaId}:`, err)
      }
    }
    if (success > 0) {
      showToast(`${success} pago(s) confirmado(s)`)
      fetchReservasLocal()
      // Refrescar habitaciones si la función está disponible
      if (typeof fetchHabitaciones === "function") fetchHabitaciones()
      // Refrescar reservas globales del padre si la función está disponible
      if (typeof fetchReservas === "function") fetchReservas()
    } else {
      showToast("No se pudo confirmar el pago", "error")
    }
    setSelectedIds([])
  }

  // Acción de Cancelar Reserva
  const handleCancelarReservas = async () => {
    if (selectedIds.length === 0) {
      showToast("Selecciona al menos una reserva para cancelar", "error")
      return
    }
    let success = 0
    for (const reservaId of selectedIds) {
      try {
        await axiosInstance.post(`http://localhost:8000/api/reservas/${reservaId}/cancelar/`)
        success++
      } catch (err) {
        console.error(`Error al cancelar reserva ${reservaId}:`, err)
      }
    }
    if (success > 0) {
      showToast(`${success} reserva(s) cancelada(s)`)
      fetchReservasLocal()
      // Refrescar habitaciones si la función está disponible
      if (typeof fetchHabitaciones === "function") fetchHabitaciones()
      // Refrescar reservas globales del padre si la función está disponible
      if (typeof fetchReservas === "function") fetchReservas()
    } else {
      showToast("No se pudo cancelar la reserva", "error")
    }
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

  // Efecto para consultar visitas hospedadas y aplicar descuento automático
  useEffect(() => {
    const fetchVisitasYDescuento = async () => {
      if (form.dni && form.dni.length === 8 && /^\d{8}$/.test(form.dni)) {
        try {
          const res = await axiosInstance.get(`http://localhost:8000/api/usuarios/${form.dni}/visitas-hospedadas/`)
          const totalVisitas = res.data?.total_visitas_hospedadas || 0
          // Si tiene 5 visitas, aplicar 10% de descuento
          if (totalVisitas >= 5) {
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
          setForm((prev) => ({
            ...prev,
            descuento: "0"
          }))
        }
      } else {
        setForm((prev) => ({
          ...prev,
          descuento: "0"
        }))
      }
    }
    fetchVisitasYDescuento()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.dni])

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

  const MEDIOS_PAGO_VALIDOS = ["efectivo", "tarjeta", "yape", "plin"];

  const handleSubmit = async (e) => {
    e.preventDefault()
    // Validar medio de pago obligatorio y permitido
    if (!form.medioPago || !MEDIOS_PAGO_VALIDOS.includes(form.medioPago)) {
      showToast("Por favor selecciona un medio de pago válido (efectivo, tarjeta, yape o plin)", "error")
      return
    }
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
      pago: form.medioPago, // Enviar el campo pago igual que en Hospedaje
    }
    if (!usuarioExistente) {
      payload.nombres = form.nombres.trim()
      payload.apellidos = form.apellidos.trim()
    }
    // Mostrar en consola antes de enviar
    // console.log("[RESERVA PENDIENTE] Payload a enviar:", payload)
    
    try {
      const res = await axiosInstance.post("http://localhost:8000/api/reservas/hospedaje-presencial-pendiente/", payload)
      showToast("Reserva pendiente registrada correctamente")
      // Refrescar reservas locales y globales, y habitaciones
      fetchReservasLocal()
      if (typeof fetchHabitaciones === "function") fetchHabitaciones()
      if (typeof fetchReservas === "function") fetchReservas()
    } catch (err) {
      console.error("Error al registrar reserva:", err)
      const errorMsg = err.response?.data?.detail || "Error al registrar reserva"
      showToast(errorMsg, "error")
    }
    // --- FIN ENVÍO AL ENDPOINT ---
    const nuevaReserva = {
      id: Date.now().toString(),
      nombre: usuarioExistente ? "-" : `${form.nombres.trim()} ${form.apellidos.trim()}`,
      dni: form.dni.trim(),
      habitacion: form.habitacion.trim(),
      huespedes: Number.parseInt(form.huespedes),
      medioPago: form.medioPago,
      pago: form.medioPago,
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
      pago: "",
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

  // Modificar getEstadoColor para considerar el estado de la habitación si la reserva está confirmada
  const getEstadoColor = (estado, habitacionNum, reserva) => {
    // Primero verificar estados finales que no deben cambiar de color
    if (estado === "Finalizada") {
      return { background: "#e0e7ef", color: "#334155" } // Gris para finalizada
    }
    if (estado === "Cancelada") {
      return { background: "#fef2f2", color: "#dc2626" } // Rojo para cancelada
    }
    
    // Si la reserva tiene check-in real del backend, mostrar verde (solo para estados activos)
    if (reserva?.hasRealCheckin && estado !== "Finalizada" && estado !== "Cancelada") {
      return { background: "#dcfce7", color: "#166534" } // Verde para check-in confirmado por backend
    }
    
    // Si la reserva tiene el flag de check-in temporal, mostrar verde (solo para estados activos)
    if ((reserva?.checkedIn || checkedInIds.has(reserva?.id)) && estado !== "Finalizada" && estado !== "Cancelada") {
      return { background: "#dcfce7", color: "#166534" } // Verde para check-in realizado
    }
    
    // Si la reserva está confirmada, revisa el estado de la habitación
    if (estado === "Confirmada" && habitacionesData) {
      const hab = Object.values(habitacionesData).find(
        (h) => h.numero === habitacionNum || h.numero === String(habitacionNum)
      )
      
      if (hab) {
        if (hab.estado === "ocupada") {
          return { background: "#dcfce7", color: "#166534" } // Verde para ocupada (check-in realizado)
        }
        if (hab.estado === "reservada") {
          return { background: "#ede9fe", color: "#7c3aed" } // Morado para reservada (pago confirmado)
        }
      }
      // Si no encuentra la habitación pero está confirmada, asumir reservada
      return { background: "#ede9fe", color: "#7c3aed" } // Morado por defecto para confirmada
    }
    
    // Colores por estado de reserva restantes
    switch (estado) {
      case "Confirmada":
        return { background: "#ede9fe", color: "#7c3aed" } // Morado por defecto para confirmada
      case "Pendiente":
        return { background: "#fef3c7", color: "#92400e" } // Amarillo para pendiente
      default:
        return { background: "#f3f4f6", color: "#6b7280" } // Gris por defecto
    }
  }

  // --- FILTRADO DE RESERVAS REUTILIZABLE ---
  const filteredReservas = filtrarPorCampos(reservas, searchTerm, ["nombres", "dni", "habitacion"]);

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
                <div style={{ fontSize: "0.75rem", color: form.descuento > 0 ? "#059669" : "#6b7280", marginTop: "0.25rem" }}>
                  {calcularDias(form.entrada, form.salida)} noche(s) {form.descuento > 0 ? `con ${form.descuento}% descuento` : "sin descuento"}
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
                onClick={handleCheckIn}
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
        <div className="card-header card-header-flex">
          <h2>Lista de Reservas</h2>
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
                  <th style={{ width: "7%", minWidth: 80 }}>Noches</th>
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
                {filteredReservas.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(r.id)}
                        onChange={(e) => handleSelectReserva(r.id, e.target.checked)}
                        disabled={r.estado === "Cancelada"}
                      />
                    </td>
                    <td style={{ fontWeight: "500", color: "#1a202c" }}>{r.nombres}</td>
                    <td style={{ color: "#1a202c" }}>{r.dni}</td>
                    <td style={{ color: "#1a202c", textAlign: "left" }}>{r.habitacion}</td>
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
                        {r.huespedes || 1} 👥
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
                        {r.dias || 1} 📅
                      </span>
                    </td>
                    <td style={{ textTransform: "capitalize", color: "#1a202c" }}>{r.pago}</td>
                    <td style={{ color: "#1a202c" }}>
                      <div>S/ {((r.montoTotal || r.monto)).toFixed(2)}</div>
                      {r.descuento > 0 && (
                        <div style={{ fontSize: "0.75rem", color: "#059669" }}>-{(r.montoTotal+r.descuento) / r.descuento}% desc.</div>
                      )}
                    </td>
                    <td>
                      <span
                        style={{
                          padding: "0.25rem 0.5rem",
                          borderRadius: "12px",
                          fontSize: "0.75rem",
                          fontWeight: "500",
                          ...getEstadoColor(r.estado, r.habitacion, r),
                        }}
                      >
                        {r.estado}
                      </span>
                    </td>
                    <td style={{ color: "#1a202c" }}>
                      <div style={{ fontSize: "0.75rem" }}>📅 {r.fechaEntrada}</div>
                      <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>🕐 {r.horaEntrada}</div>
                    </td>
                    <td style={{ color: "#1a202c" }}>
                      {r.fechaSalida ? (
                        <div>
                          <div style={{ fontSize: "0.75rem" }}>📅 {r.fechaSalida}</div>
                          <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>🕐 {r.horaSalida}</div>
                        </div>
                      ) : (
                        <span style={{ color: "#9ca3af" }}>-</span>
                      )}
                    </td>
                    <td style={{ fontWeight: "500", color: "#1a202c" }}>{r.usuario || '-'}</td>
                    <td style={{ color: "#1a202c" }}>
                      {r.fechaInicioReserva ? (
                        <div>
                          <div style={{ fontSize: "0.75rem", fontWeight: 500 }}>📅 {r.fechaInicioReserva}</div>
                          <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>🕐 {r.horaInicioReserva}</div>
                        </div>
                      ) : (
                        <span style={{ color: "#9ca3af" }}>-</span>
                      )}
                    </td>
                    <td style={{ color: "#1a202c" }}>
                      {r.fechaFinReserva ? (
                        <div>
                          <div style={{ fontSize: "0.75rem", fontWeight: 500 }}>📅 {r.fechaFinReserva}</div>
                          <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>🕐 {r.horaFinReserva}</div>
                        </div>
                      ) : (
                        <span style={{ color: "#9ca3af" }}>-</span>
                      )}
                    </td>
                  </tr>
                ))}
                {filteredReservas.length === 0 && (
                  <tr>
                    <td colSpan="14" style={{ textAlign: "center", padding: "2rem", color: "#6b7280" }}>
                      {searchTerm
                        ? "No se encontraron reservas que coincidan con la búsqueda"
                        : "No hay reservas activas"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Reservas