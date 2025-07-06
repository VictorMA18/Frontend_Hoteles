import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  BedSingle,
  BedDouble,
  Users,
  Crown,
  Wifi,
  ParkingCircle,
  Coffee,
} from "lucide-react";
import { useHabitacionesPorPiso } from "@/features/habitaciones/useHabitacionesPorPiso";
import axiosInstance from "@/libs/axiosInstance";

// Hook para crear reserva
function useCrearReserva() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const crearReserva = async (body) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      // Mostrar el JSON que se enviaría al endpoint
      console.log("[DEBUG] Reserva a enviar:", JSON.stringify(body, null, 2));
      const response = await axiosInstance.post(
        "http://localhost:8000/api/reservas/crear/",
        body
      );
      setSuccess(true);
      return response.data;
    } catch (err) {
      setError(err.response?.data || err.message);
      setSuccess(false);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { crearReserva, loading, error, success };
}

function Reservation() {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [habitacionSeleccionada, setHabitacionSeleccionada] = useState(null);
  const { habitacionesPorPiso, loading, error } = useHabitacionesPorPiso();
  const [formReserva, setFormReserva] = useState({
    nombre: '',
    dni: '',
    checkin: '',
    checkout: '',
    huespedes: 1,
  });
  const [totalReserva, setTotalReserva] = useState(null);
  const { crearReserva, loading: loadingCrear, error: errorCrear, success: successCrear } = useCrearReserva();
  const [habitacionesDisponibles, setHabitacionesDisponibles] = useState([]);
  const [buscando, setBuscando] = useState(false);
  const [errorDisponibilidad, setErrorDisponibilidad] = useState(null);

  // Obtener usuario autenticado de localStorage
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

  const getTipoIcono = (tipo) => {
    switch (tipo?.toLowerCase()) {
      case "suite":
        return <Crown className="w-5 h-5 text-yellow-500" />;
      case "matrimonial":
        return <Users className="w-5 h-5 text-pink-500" />;
      case "doble":
        return <BedDouble className="w-5 h-5 text-blue-500" />;
      case "simple":
      case "estandar":
        return <BedSingle className="w-5 h-5 text-gray-500" />;
      default:
        return null;
    }
  };

  const getEstadoColor = (estado) => {
    switch (estado?.toLowerCase()) {
      case "disponible":
        return "bg-green-500";
      case "ocupado":
        return "bg-red-500";
      case "mantenimiento":
      default:
        return "bg-gray-500";
    }
  };

  // Calcula el total automáticamente al cambiar fechas
  React.useEffect(() => {
    if (habitacionSeleccionada && formReserva.checkin && formReserva.checkout) {
      const precio = Number(habitacionSeleccionada.precio_actual || habitacionSeleccionada.tipo_info?.precio_base || 0);
      const fechaInicio = new Date(formReserva.checkin);
      const fechaFin = new Date(formReserva.checkout);
      const diffMs = fechaFin - fechaInicio;
      const diffDias = Math.max(Math.ceil(diffMs / (1000 * 60 * 60 * 24)), 0);
      if (diffDias > 0) {
        setTotalReserva(precio * diffDias);
      } else {
        setTotalReserva(null);
      }
    } else {
      setTotalReserva(null);
    }
  }, [formReserva.checkin, formReserva.checkout, habitacionSeleccionada]);

  // Formulario de reserva para una habitación específica
  const handleReservarClick = (habitacion) => {
    setHabitacionSeleccionada(habitacion);
    setFormReserva({
      nombre: '',
      dni: '',
      checkin: '',
      checkout: '',
      huespedes: 1,
    });
    setTotalReserva(null);
  };

  const handleCerrarModalReserva = () => {
    setHabitacionSeleccionada(null);
    setFormReserva({
      nombre: '',
      dni: '',
      checkin: '',
      checkout: '',
      huespedes: 1,
    });
    setTotalReserva(null);
  };

  useEffect(() => {
    // Si hay usuario, setear el nombre por defecto al abrir el modal de reserva individual
    if (habitacionSeleccionada && usuario && usuario.nombre) {
      setFormReserva(f => ({ ...f, nombre: usuario.nombre }));
    }
  }, [habitacionSeleccionada]);

  // Validación de fechas y helpers
  const hoy = new Date();
  const yyyy = hoy.getFullYear();
  const mm = String(hoy.getMonth() + 1).padStart(2, '0');
  const dd = String(hoy.getDate()).padStart(2, '0');
  const minCheckin = `${yyyy}-${mm}-${dd}`;
  const minCheckout = formReserva.checkin
    ? new Date(new Date(formReserva.checkin).getTime() + 24 * 60 * 60 * 1000)
        .toISOString().slice(0, 10)
    : minCheckin;
  const errorFecha = formReserva.checkin && formReserva.checkout && (new Date(formReserva.checkout) <= new Date(formReserva.checkin));

  // Lógica para buscar disponibilidad
  const buscarDisponibilidad = async (e) => {
    e.preventDefault();
    setBuscando(true);
    setErrorDisponibilidad(null);
    setHabitacionesDisponibles([]);
    const payload = {
      fecha_checkin: formReserva.checkin,
      fecha_checkout: formReserva.checkout,
      tipo_habitacion: formReserva.tipo || document.getElementById('habitacion')?.value,
      numero_huespedes: formReserva.huespedes || document.getElementById('huespedes')?.value,
    };
    console.log('[DEBUG] Payload buscar disponibilidad:', JSON.stringify(payload, null, 2));
    try {
      const response = await axiosInstance.post(
        "http://localhost:8000/api/habitaciones/buscar-disponibilidad/",
        payload
      );
      setHabitacionesDisponibles(response.data);
      if (response.data.length === 0) {
        setErrorDisponibilidad('No hay habitaciones disponibles para los criterios seleccionados.');
      }
    } catch (err) {
      setErrorDisponibilidad('Error al buscar disponibilidad.');
    } finally {
      setBuscando(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="relative h-[500px] flex items-center justify-center text-center text-white">
        <img
          src="/src/assets/hotel-princess.jpg"
          alt="Hotel Princess"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
        <div className="absolute inset-0 bg-black/50 z-10" />
        <div className="relative z-20 px-4 max-w-2xl">
          <h1 className="text-5xl font-bold mb-4">Reserva tu estadía</h1>
          <p className="text-lg md:text-xl mb-6">
            Encuentra la habitación perfecta para tu estadía en Hotel Princess.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setModalAbierto(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg shadow-md"
            >
              Hacer Reserva
            </button>
            <button className="bg-white text-black px-6 py-3 rounded-lg text-lg border border-gray-300 shadow-md hover:bg-gray-100">
              Ver Croquis
            </button>
          </div>
        </div>
      </section>

      {/* Modal */}
      {modalAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl relative border border-gray-200">
            <button
              onClick={() => setModalAbierto(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
              Reserva rápida
            </h2>
            <form className="space-y-4" onSubmit={buscarDisponibilidad}>
              <div>
                <Label htmlFor="nombre">Nombre</Label>
                <Input id="nombre" placeholder="Tu nombre completo" required value={usuario.nombres || ''} disabled />
              </div>
              <div>
                <Label htmlFor="dni">DNI</Label>
                <Input
                  id="dni"
                  placeholder="12345678"
                  maxLength={8}
                  pattern="[0-9]{8}"
                  value={usuario.dni}
                  disabled
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Check-in</Label>
                  <Input
                    type="date"
                    required
                    min={minCheckin}
                    value={formReserva.checkin}
                    onChange={e => setFormReserva(f => ({...f, checkin: e.target.value, checkout: ''}))}
                  />
                </div>
                <div>
                  <Label>Check-out</Label>
                  <Input
                    type="date"
                    required
                    min={minCheckout}
                    value={formReserva.checkout}
                    onChange={e => setFormReserva(f => ({...f, checkout: e.target.value}))}
                  />
                </div>
              </div>
              {errorFecha && (
                <p className="text-red-600 text-sm">La reserva debe ser al menos de 1 día. El check-out debe ser posterior al check-in.</p>
              )}
              <div>
                <Label htmlFor="huespedes">Huéspedes</Label>
                <Input
                  id="huespedes"
                  type="number"
                  min="1"
                  placeholder="Cantidad"
                  required
                  defaultValue={1}
                />
              </div>
              <div>
                <Label htmlFor="habitacion">Tipo de habitación</Label>
                <select
                  id="habitacion"
                  className="w-full h-10 border border-gray-300 rounded-md text-sm px-2"
                  required
                >
                  <option value="">Selecciona tipo</option>
                  <option value="simple">simple</option>
                  <option value="doble">Doble</option>
                  <option value="matrimonial">Matrimonial</option>
                  <option value="suite">Suite</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 mt-2 text-lg text-white py-2 rounded-md font-semibold"
                disabled={buscando}
              >
                {buscando ? 'Buscando...' : 'Buscar Disponibilidad'}
              </button>
            </form>
            {errorDisponibilidad && (
              <p className="text-red-600 text-sm mt-2">{errorDisponibilidad}</p>
            )}
            {habitacionesDisponibles.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Habitaciones disponibles:</h3>
                <ul className="space-y-2 max-h-40 overflow-y-auto">
                  {habitacionesDisponibles.map((hab) => (
                    <li key={hab.codigo || hab.id} className="border p-2 rounded flex justify-between items-center">
                      <span>Hab. {hab.numero_habitacion} - {hab.tipo_nombre} - S/{hab.precio_actual || hab.precio_base}</span>
                      <Button size="sm" onClick={() => {
                        setHabitacionSeleccionada(hab);
                        setModalAbierto(false);
                      }}>
                        Reservar
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal de reserva individual */}
      {habitacionSeleccionada && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl relative border border-gray-200">
            <button
              onClick={handleCerrarModalReserva}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
              Reservar Habitación {habitacionSeleccionada.numero_habitacion}
            </h2>
            <form
              className="space-y-4"
              onSubmit={async (e) => {
                e.preventDefault();
                if (!formReserva.checkin || !formReserva.checkout) return;
                if (new Date(formReserva.checkout) <= new Date(formReserva.checkin)) {
                  alert('La reserva debe ser al menos de 1 día. El check-out debe ser posterior al check-in.');
                  return;
                }
                const body = {
                  codigo_habitacion: habitacionSeleccionada.codigo || habitacionSeleccionada.codigo_habitacion,
                  id_tipo_reserva: 2, // Online
                  fecha_checkin_programado: formReserva.checkin ? `${formReserva.checkin}T14:00:00Z` : null,
                  fecha_checkout_programado: formReserva.checkout ? `${formReserva.checkout}T12:00:00Z` : null,
                  numero_huespedes: Number(formReserva.huespedes),
                  precio_noche: String(habitacionSeleccionada.precio_actual || habitacionSeleccionada.tipo_info?.precio_base || ''),
                  observaciones: null
                };
                console.log('Reserva a enviar:', body);
                const data = await crearReserva(body);
                if (data) {
                  alert('Reserva creada con éxito');
                  handleCerrarModalReserva();
                }
              }}
            >
              <div>
                <Label>Tipo</Label>
                <Input value={habitacionSeleccionada.tipo_nombre} disabled />
              </div>
              <div>
                <Label>Precio por noche</Label>
                <Input value={`S/ ${habitacionSeleccionada.precio_actual || habitacionSeleccionada.tipo_info?.precio_base}`} disabled />
              </div>
              <div>
                <Label htmlFor="nombre">Nombre</Label>
                <Input id="nombre" placeholder="Tu nombre completo" required value={usuario.nombres} disabled />
              </div>
              <div>
                <Label htmlFor="dni">DNI</Label>
                <Input id="dni" placeholder="12345678" maxLength={8} pattern="[0-9]{8}" required value={usuario.dni} disabled />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Check-in</Label>
                  <Input
                    type="date"
                    required
                    min={minCheckin}
                    value={formReserva.checkin}
                    onChange={e => setFormReserva(f => ({...f, checkin: e.target.value, checkout: ''}))}
                  />
                </div>
                <div>
                  <Label>Check-out</Label>
                  <Input
                    type="date"
                    required
                    min={minCheckout}
                    value={formReserva.checkout}
                    onChange={e => setFormReserva(f => ({...f, checkout: e.target.value}))}
                  />
                </div>
              </div>
              {errorFecha && (
                <p className="text-red-600 text-sm">La reserva debe ser al menos de 1 día. El check-out debe ser posterior al check-in.</p>
              )}
              <div>
                <Label htmlFor="huespedes">Huéspedes</Label>
                <Input id="huespedes" type="number" min="1" placeholder="Cantidad" required value={formReserva.huespedes} onChange={e => setFormReserva(f => ({...f, huespedes: e.target.value}))} />
              </div>
              <div className="text-right text-lg font-bold text-blue-700">
                {totalReserva !== null && (
                  <span>Total: S/ {totalReserva}</span>
                )}
              </div>
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 mt-2 text-lg text-white py-2 rounded-md font-semibold"
              >
                Separar Reserva
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Lista por pisos con estilo tarjeta */}
      <section className="px-6 py-16 bg-gray-50">
        <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
          Nuestras Habitaciones
        </h2>
        <p className="text-center mb-12 text-gray-600 text-lg">
          Descubre nuestras elegantes opciones diseñadas para tu confort.
        </p>
        {loading ? (
          <p className="text-center text-gray-500">Cargando habitaciones...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          Object.entries(habitacionesPorPiso).map(([piso, habitaciones]) => (
            <div key={piso} className="mb-12">
              <h3 className="text-2xl font-semibold text-gray-700 mb-6">
                {piso}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {habitaciones.map((habitacion, index) => (
                  <div
                    key={habitacion.codigo || index}
                    className="bg-white rounded-xl shadow-md overflow-hidden relative"
                  >
                    <div
                      className={`h-2 ${getEstadoColor(
                        habitacion.estado_nombre || habitacion.estado_info?.nombre
                      )} w-full`}
                    />
                    <div className="relative">
                      <img
                        src={"/src/assets/default-room.jpg"}
                        alt={
                          `Habitación ${habitacion.numero_habitacion}`
                        }
                        className="w-full h-48 object-cover"
                      />
                      {/* Puedes agregar tags si tu modelo los tiene */}
                    </div>
                    <div className="p-4">
                      <h4 className="text-lg font-semibold mb-1">
                        Habitación {habitacion.numero_habitacion}
                      </h4>
                      <p className="text-sm text-gray-600 mb-2">
                        Piso {habitacion.piso} - {habitacion.tipo_nombre}
                      </p>
                      <p className="text-sm mb-2 font-medium flex items-center gap-2">
                        {getTipoIcono(habitacion.tipo_nombre)}
                        <span className="capitalize">{habitacion.tipo_nombre}</span>
                      </p>
                      <p className="text-sm mb-2 font-medium">
                        Estado: {" "}
                        <span
                          className={`$ {
                            (habitacion.estado_nombre || habitacion.estado_info?.nombre) === "Disponible"
                              ? "text-green-600"
                              : (habitacion.estado_nombre || habitacion.estado_info?.nombre) === "Ocupado"
                              ? "text-red-600"
                              : "text-gray-600"
                          } capitalize`}
                        >
                          {habitacion.estado_nombre || habitacion.estado_info?.nombre}
                        </span>
                      </p>
                      <p className="text-sm text-gray-500 mb-2">
                        {habitacion.tipo_info?.descripcion}
                      </p>
                      <div className="flex items-center space-x-3 text-sm text-gray-500 mb-3">
                        <Wifi className="w-4 h-4" />
                        <ParkingCircle className="w-4 h-4" />
                        <Coffee className="w-4 h-4" />
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-blue-600 text-xl font-bold">
                          S/{habitacion.precio_actual || habitacion.tipo_info?.precio_base || "-"}
                        </p>
                        <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => handleReservarClick(habitacion)}>
                          Reservar
                        </Button>
                      </div>
                      {habitacion.observaciones && (
                        <p className="text-xs text-gray-400 mt-2">
                          {habitacion.observaciones}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </section>

      <Footer />
    </div>
  );
}

export default Reservation;
