import { useState } from "react"
import { Button } from "../../src/components/ui/button"
import { Input } from "../../src/components/ui/Input"
import { Label } from "../../src/components/ui/label"
import { Card, CardContent, CardHeader } from "../../src/components/ui/card"
import { Badge } from "../../src/components/ui/badge"
import { Search, Users, Hotel, CreditCard, Plus, Minus, Calendar, Clock } from "lucide-react"

const Hospedaje = () => {
  const [huespedes, setHuespedes] = useState([])
  const [selectedIds, setSelectedIds] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [form, setForm] = useState({
    nombre: "",
    dni: "",
    habitacion: "",
    medioPago: "",
    monto: "",
    descuento: "0",
  })

  const handleInputChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const showToast = (message, type = "success") => {
    // Simple toast notification usando Tailwind
    const toast = document.createElement("div")
    toast.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white font-medium transform transition-all duration-300 translate-x-full ${
      type === "success" ? "bg-green-500" : "bg-red-500"
    }`
    toast.textContent = message
    document.body.appendChild(toast)

    setTimeout(() => {
      toast.classList.remove("translate-x-full")
    }, 100)

    setTimeout(() => {
      toast.classList.add("translate-x-full")
      setTimeout(() => document.body.removeChild(toast), 300)
    }, 3000)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validación mejorada
    if (!form.nombre.trim() || !form.dni.trim() || !form.habitacion.trim() || !form.medioPago || !form.monto) {
      showToast("Por favor completa todos los campos obligatorios", "error")
      return
    }

    // Validación de DNI (8 dígitos)
    if (form.dni.length !== 8 || !/^\d+$/.test(form.dni)) {
      showToast("El DNI debe tener exactamente 8 dígitos", "error")
      return
    }

    // Validación de monto
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

    setHuespedes((prev) => [...prev, nuevoHuesped])

    // Limpiar formulario
    setForm({
      nombre: "",
      dni: "",
      habitacion: "",
      medioPago: "",
      monto: "",
      descuento: "0",
    })

    showToast(`${nuevoHuesped.nombre} ha sido registrado exitosamente`)
  }

  const handleCheckout = () => {
    if (selectedIds.length === 0) {
      showToast("Selecciona al menos un huésped para hacer checkout", "error")
      return
    }

    const ahora = new Date()
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
    )

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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mr-3">
              <Hotel className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Sistema de Hospedaje</h1>
          </div>
          <p className="text-lg text-gray-600">Gestión integral de huéspedes y reservas - Hotel Princess</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Huéspedes</p>
                  <p className="text-2xl font-bold text-gray-900">{huespedesTotales}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <Hotel className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Huéspedes Activos</p>
                  <p className="text-2xl font-bold text-gray-900">{huespedesActivos}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                  <CreditCard className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Ingresos Total</p>
                  <p className="text-2xl font-bold text-gray-900">S/ {ingresoTotal.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Registration Form */}
        <Card className="mb-8 shadow-sm">
          <CardHeader className="bg-purple-50 border-b">
            <div className="flex items-center">
              <Plus className="h-5 w-5 text-purple-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Registrar Nuevo Huésped</h2>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="nombre" className="text-sm font-medium text-gray-700">
                  Nombre Completo *
                </Label>
                <Input
                  id="nombre"
                  type="text"
                  value={form.nombre}
                  onChange={(e) => handleInputChange("nombre", e.target.value)}
                  placeholder="Ingresa el nombre completo"
                  className="w-full"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dni" className="text-sm font-medium text-gray-700">
                  DNI *
                </Label>
                <Input
                  id="dni"
                  type="text"
                  value={form.dni}
                  onChange={(e) => handleInputChange("dni", e.target.value)}
                  placeholder="12345678"
                  maxLength={8}
                  pattern="[0-9]{8}"
                  className="w-full"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="habitacion" className="text-sm font-medium text-gray-700">
                  Habitación *
                </Label>
                <Input
                  id="habitacion"
                  type="text"
                  value={form.habitacion}
                  onChange={(e) => handleInputChange("habitacion", e.target.value)}
                  placeholder="101, 102, etc."
                  className="w-full"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="medioPago" className="text-sm font-medium text-gray-700">
                  Medio de Pago *
                </Label>
                <select
                  id="medioPago"
                  value={form.medioPago}
                  onChange={(e) => handleInputChange("medioPago", e.target.value)}
                  className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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

              <div className="space-y-2">
                <Label htmlFor="monto" className="text-sm font-medium text-gray-700">
                  Monto (S/) *
                </Label>
                <Input
                  id="monto"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={form.monto}
                  onChange={(e) => handleInputChange("monto", e.target.value)}
                  placeholder="0.00"
                  className="w-full"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="descuento" className="text-sm font-medium text-gray-700">
                  Descuento (%)
                </Label>
                <Input
                  id="descuento"
                  type="number"
                  min="0"
                  max="100"
                  value={form.descuento}
                  onChange={(e) => handleInputChange("descuento", e.target.value)}
                  placeholder="0"
                  className="w-full"
                />
              </div>

              <div className="md:col-span-2 lg:col-span-3 flex flex-col sm:flex-row gap-4 pt-4">
                <Button type="submit" className="bg-purple-600 hover:bg-purple-700 flex-1 sm:flex-none">
                  <Plus className="h-4 w-4 mr-2" />
                  Registrar Huésped
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleCheckout}
                  disabled={selectedIds.length === 0}
                  className="flex-1 sm:flex-none"
                >
                  <Minus className="h-4 w-4 mr-2" />
                  Checkout ({selectedIds.length})
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Search and Table */}
        <Card className="shadow-sm">
          <CardHeader className="bg-gray-50 border-b">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-xl font-semibold text-gray-900">Lista de Huéspedes</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Buscar por nombre, DNI o habitación..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-80"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sel.
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nombre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      DNI
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Habitación
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pago
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Monto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Entrada
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Salida
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredHuespedes.map((huesped) => (
                    <tr key={huesped.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(huesped.id)}
                          onChange={(e) => handleSelectHuesped(huesped.id, e.target.checked)}
                          disabled={huesped.estancia === "finalizada"}
                          className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{huesped.nombre}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{huesped.dni}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{huesped.habitacion}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 capitalize">{huesped.medioPago}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <div>S/ {huesped.monto.toFixed(2)}</div>
                          {huesped.descuento > 0 && (
                            <div className="text-xs text-green-600">-{huesped.descuento}% desc.</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge
                          variant={huesped.estancia === "activa" ? "default" : "secondary"}
                          className={
                            huesped.estancia === "activa" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                          }
                        >
                          {huesped.estancia === "activa" ? "Activo" : "Finalizado"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {huesped.fechaEntrada}
                          </div>
                          <div className="flex items-center text-xs text-gray-500">
                            <Clock className="h-3 w-3 mr-1" />
                            {huesped.horaEntrada}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {huesped.fechaSalida ? (
                          <div className="text-sm text-gray-900">
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {huesped.fechaSalida}
                            </div>
                            <div className="flex items-center text-xs text-gray-500">
                              <Clock className="h-3 w-3 mr-1" />
                              {huesped.horaSalida}
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredHuespedes.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-500">
                    {searchTerm
                      ? "No se encontraron huéspedes que coincidan con la búsqueda"
                      : "No hay huéspedes registrados"}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Hospedaje
