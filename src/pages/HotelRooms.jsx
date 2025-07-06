import React, { useState } from 'react';
import { Clock, Users, Crown, Heart, Home, CheckCircle2, XCircle, AlertCircle, MapPin, Calendar, Info } from 'lucide-react';
import { BedDouble, BedSingle, Bed, Gem, HeartHandshake, Sparkles, Star } from "lucide-react";

const HotelRoomsManager = () => {
  // Datos de ejemplo para las habitaciones
  const [habitacionesData] = useState({
    '101': { numero: '101', tipo: 'Doble', estado: 'disponible', precio: 110, huespedes: 0, maxHuespedes: 2 },
    '102': { numero: '102', tipo: 'Triple', estado: 'ocupada', precio: 140, huespedes: 3, maxHuespedes: 3 },
    '103': { numero: '103', tipo: 'Suite', estado: 'disponible', precio: 180, huespedes: 0, maxHuespedes: 2 },
    '104': { numero: '104', tipo: 'Matrimonial', estado: 'disponible', precio: 130, huespedes: 0, maxHuespedes: 2 },
    '105': { numero: '105', tipo: 'Doble', estado: 'ocupada', precio: 110, huespedes: 2, maxHuespedes: 2 },
    '106': { numero: '106', tipo: 'Suite', estado: 'disponible', precio: 180, huespedes: 0, maxHuespedes: 2 },
    '107': { numero: '107', tipo: 'Triple', estado: 'disponible', precio: 140, huespedes: 0, maxHuespedes: 3 },
    '201': { numero: '201', tipo: 'Doble', estado: 'disponible', precio: 120, huespedes: 0, maxHuespedes: 2 },
    '202': { numero: '202', tipo: 'Triple', estado: 'ocupada', precio: 150, huespedes: 3, maxHuespedes: 3 },
    '203': { numero: '203', tipo: 'Suite', estado: 'disponible', precio: 200, huespedes: 0, maxHuespedes: 2 },
    '204': { numero: '204', tipo: 'Matrimonial', estado: 'disponible', precio: 140, huespedes: 0, maxHuespedes: 2 },
    '205': { numero: '205', tipo: 'Doble', estado: 'ocupada', precio: 120, huespedes: 2, maxHuespedes: 2 },
    '206': { numero: '206', tipo: 'Suite', estado: 'mantenimiento', precio: 200, huespedes: 0, maxHuespedes: 2 },
    '207': { numero: '207', tipo: 'Triple', estado: 'disponible', precio: 150, huespedes: 0, maxHuespedes: 3 },
    '301': { numero: '301', tipo: 'Doble', estado: 'disponible', precio: 125, huespedes: 0, maxHuespedes: 2 },
    '302': { numero: '302', tipo: 'Suite', estado: 'disponible', precio: 210, huespedes: 0, maxHuespedes: 2 },
    '303': { numero: '303', tipo: 'Triple', estado: 'ocupada', precio: 160, huespedes: 2, maxHuespedes: 3 },
    '304': { numero: '304', tipo: 'Matrimonial', estado: 'disponible', precio: 145, huespedes: 0, maxHuespedes: 2 },
    '305': { numero: '305', tipo: 'Doble', estado: 'disponible', precio: 125, huespedes: 0, maxHuespedes: 2 },
    '306': { numero: '306', tipo: 'Suite', estado: 'ocupada', precio: 210, huespedes: 2, maxHuespedes: 2 },
    '307': { numero: '307', tipo: 'Triple', estado: 'disponible', precio: 160, huespedes: 0, maxHuespedes: 3 },
    '401': { numero: '401', tipo: 'Suite', estado: 'disponible', precio: 230, huespedes: 0, maxHuespedes: 2 },
    '402': { numero: '402', tipo: 'Matrimonial', estado: 'disponible', precio: 155, huespedes: 0, maxHuespedes: 2 },
    '403': { numero: '403', tipo: 'Doble', estado: 'ocupada', precio: 135, huespedes: 2, maxHuespedes: 2 },
    '404': { numero: '404', tipo: 'Suite', estado: 'disponible', precio: 230, huespedes: 0, maxHuespedes: 2 },
    '405': { numero: '405', tipo: 'Triple', estado: 'disponible', precio: 170, huespedes: 0, maxHuespedes: 3 },
    '406': { numero: '406', tipo: 'Matrimonial', estado: 'ocupada', precio: 155, huespedes: 2, maxHuespedes: 2 },
    '407': { numero: '407', tipo: 'Suite', estado: 'disponible', precio: 230, huespedes: 0, maxHuespedes: 2 },
  });
  
  const [pisoActual, setPisoActual] = useState('1');

  // Filtrar habitaciones por piso
  const habitacionesPorPiso = Object.values(habitacionesData).filter((habitacion) =>
    habitacion.numero.startsWith(pisoActual),
  );

  // Configuración de estados con colores y estilos mejorados
  const estadosConfig = {
    disponible: {
      color: '#10B981',
      bgColor: '#ECFDF5',
      borderColor: '#10B981',
      textColor: '#065F46',
      icon: CheckCircle2,
      label: 'Disponible'
    },
    ocupada: {
      color: '#EF4444',
      bgColor: '#FEF2F2',
      borderColor: '#EF4444',
      textColor: '#991B1B',
      icon: XCircle,
      label: 'Ocupada'
    },
    limpieza: {
      color: '#F59E0B',
      bgColor: '#FFFBEB',
      borderColor: '#F59E0B',
      textColor: '#92400E',
      icon: AlertCircle,
      label: 'Limpieza'
    },
    mantenimiento: {
      color: '#8B5CF6',
      bgColor: '#FAF5FF',
      borderColor: '#8B5CF6',
      textColor: '#5B21B6',
      icon: AlertCircle,
      label: 'Mantenimiento'
    }
  };

  // Configuración de tipos de habitación con logos más distintivos
  const tiposConfig = {
    'Doble': { 
      icon: BedDouble, 
      color: '#3B82F6', 
      label: 'Habitación Doble',
      bgColor: '#EFF6FF',
      emoji: '🛏️'
    },
    'Triple': { 
      icon: Bed, 
      color: '#059669', 
      label: 'Habitación Triple',
      bgColor: '#ECFDF5',
      emoji: '🛏️'
    },
    'Suite': { 
      icon: Crown, 
      color: '#DC2626', 
      label: 'Suite Premium',
      bgColor: '#FEF2F2',
      emoji: '👑'
    },
    'Matrimonial': { 
      icon: Heart, 
      color: '#DB2777', 
      label: 'Habitación Matrimonial',
      bgColor: '#FDF2F8',
      emoji: '💕'
    }
  };

  // Componente para renderizar las habitaciones con logos
  const HabitacionCard = ({ habitacion, extraClass = "" }) => {
    const estadoConfig = estadosConfig[habitacion.estado];
    const tipoConfig = tiposConfig[habitacion.tipo];
    const IconoTipo = tipoConfig.icon;
    const IconoEstado = estadoConfig.icon;
    const esClickeable = habitacion.estado === 'limpieza' || habitacion.estado === 'mantenimiento';

    return (
      <div
        className={`relative border-3 p-6 min-h-[180px] rounded-xl" ${extraClass}`}
        style={{
          backgroundColor: estadoConfig.bgColor,
          borderColor: estadoConfig.borderColor,
          color: estadoConfig.textColor
        }}
        onClick={null}
        title={esClickeable ? `Clic para cambiar estado` : estadoConfig.label}
      >
        {/* Logo principal del tipo de habitación - MÁS GRANDE */}
        <div className="flex flex-col items-center mb-4">
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center text-4xl shadow-lg border-2 border-white"
            style={{ backgroundColor: tipoConfig.bgColor }}
          >
            {tipoConfig.emoji}
          </div>
          <div className="text-xs font-medium mt-2 opacity-75">{tipoConfig.label}</div>
        </div>

        {/* Icono de estado */}
        <div className="absolute top-3 right-3">
          <div 
            className="w-8 h-8 rounded-full flex items-center justify-center shadow-md border-2 border-white"
            style={{ backgroundColor: estadoConfig.color }}
          >
            <IconoEstado className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Número de habitación grande */}
        <div className="flex justify-center items-center mb-3">
          <span className="text-4xl font-bold" style={{ color: estadoConfig.textColor }}>
            {habitacion.numero}
          </span>
        </div>

        {/* Información de la habitación */}
        <div className="space-y-2 text-center">
          <div className="text-base font-semibold">{habitacion.tipo}</div>
          <div className="text-xl font-bold" style={{ color: tipoConfig.color }}>
            ${habitacion.precio}/noche
          </div>
          
          {habitacion.estado === 'ocupada' && (
            <div className="flex items-center justify-center gap-1 text-sm bg-white bg-opacity-50 rounded-full px-3 py-1">
              <Users className="w-4 h-4" />
              <span>{habitacion.huespedes}/{habitacion.maxHuespedes} huéspedes</span>
            </div>
          )}
          
          <div className="inline-block px-4 py-2 rounded-full text-sm font-medium shadow-sm"
               style={{ backgroundColor: estadoConfig.color, color: 'white' }}>
            {estadoConfig.label}
          </div>
        </div>

        {/* Puerta decorativa más grande */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-3 bg-amber-600 rounded-t-lg shadow-sm"></div>
        
        {/* Decoración especial para suites */}
        {habitacion.tipo === 'Suite' && (
          <div className="absolute top-2 left-2">
            <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center shadow-md">
              <Sparkles className="w-4 h-4 text-yellow-800" />
            </div>
          </div>
        )}

        {/* Decoración especial para matrimoniales */}
        {habitacion.tipo === 'Matrimonial' && (
          <div className="absolute top-2 left-2">
            <div className="w-6 h-6 bg-pink-400 rounded-full flex items-center justify-center shadow-md">
              <Heart className="w-4 h-4 text-pink-800" />
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">

      {/* Selector de Piso y Mapa */}
      <div className="max-w-7xl mx-auto scale-[0.80] origin-top mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">🗺️ Mapa de Habitaciones</h2>
            
            {/* Selector de Piso */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              {['1', '2', '3', '4'].map((piso) => (
                <button
                  key={piso}
                  onClick={() => setPisoActual(piso)}
                  className={`px-4 py-2 rounded-md font-medium transition-all ${
                    pisoActual === piso
                      ? 'bg-blue-500 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  🏢 Piso {piso}°
                </button>
              ))}
            </div>
          </div>

          {/* Leyenda mejorada */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 p-6 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl shadow-md">🛏️</div>
              <div>
                <div className="text-sm font-bold text-gray-700">Habitación Doble</div>
                <div className="text-xs text-gray-500">2 huéspedes máx.</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-2xl shadow-md">🛏️</div>
              <div>
                <div className="text-sm font-bold text-gray-700">Habitación Triple</div>
                <div className="text-xs text-gray-500">3 huéspedes máx.</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-2xl shadow-md">👑</div>
              <div>
                <div className="text-sm font-bold text-gray-700">Suite Premium</div>
                <div className="text-xs text-gray-500">Lujo y confort</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center text-2xl shadow-md">💕</div>
              <div>
                <div className="text-sm font-bold text-gray-700">Matrimonial</div>
                <div className="text-xs text-gray-500">Romántica</div>
              </div>
            </div>
          </div>

          {/* Área de Estacionamiento */}
          <div className="bg-gray-600 text-white p-8 rounded-lg text-center font-semibold mb-8 shadow-lg scale-[0.80] origin-top mx-auto">
            <div className="flex items-center justify-center gap-3">
              <span className="text-4xl">🚗</span>
              <div>
                <div className="text-xl font-bold">Estacionamiento</div>
                <div className="text-sm opacity-75">Zona de vehículos</div>
              </div>
            </div>
          </div>

          {/* Plano del Piso */}
          <div className="bg-gray-100 p-8 rounded-lg border-2 border-gray-300 min-h-[700px] scale-[0.80] origin-top mx-auto">
            <div className="relative h-full">
              {/* Fila superior de habitaciones */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {habitacionesPorPiso
                  .filter(h => parseInt(h.numero.substring(1)) >= 4 && parseInt(h.numero.substring(1)) <= 7)
                  .sort((a, b) => parseInt(a.numero.substring(1)) - parseInt(b.numero.substring(1)))
                  .map((habitacion) => (
                    <HabitacionCard key={habitacion.numero} habitacion={habitacion} />
                  ))}
              </div>
              
              {/* Escaleras */}
              <div className="absolute right-10 top-1/2 transform -translate-y-1/2 rotate-90 w-20 h-40 bg-gray-400 rounded-lg border-2 border-gray-500 flex flex-col items-center justify-center shadow-lg">
                <div className="text-white text-2xl mb-2">🔄</div>
                <div className="text-white text-xs font-bold text-center">Escaleras</div>
                <div className="space-y-1 mt-3">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="w-12 h-1 bg-gray-600 rounded"></div>
                  ))}
                </div>
              </div>

              {/* Pasillo central */}
              <div className="bg-gray-200 border-2 border-dashed border-gray-400 p-6 rounded-lg text-center my-8">
                <div className="flex items-center justify-center gap-4 text-gray-600">
                  <div className="w-full h-px bg-gray-400"></div>
                  <span className="px-6 text-lg font-medium whitespace-nowrap">🚶 Pasillo Principal 🚶</span>
                  <div className="w-full h-px bg-gray-400"></div>
                </div>
              </div>

              {/* Fila inferior de habitaciones */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {habitacionesPorPiso
                  .filter(h => parseInt(h.numero.substring(1)) >= 1 && parseInt(h.numero.substring(1)) <= 3)
                  .sort((a, b) => parseInt(a.numero.substring(1)) - parseInt(b.numero.substring(1)))
                  .map((habitacion) => (
                    <HabitacionCard key={habitacion.numero} habitacion={habitacion} />
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* Instrucciones */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="text-2xl">💡</div>
            <div>
              <h3 className="font-medium text-blue-900 mb-1">Instrucciones de Uso</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• 👥 Las habitaciones ocupadas muestran el número de huéspedes actuales</li>
                <li>• 🏢 Usa los botones de piso para navegar entre los diferentes niveles</li>
                <li>• 💰 Los precios se muestran por noche en cada habitación</li>
                <li>• 🏨 Cada tipo de habitación tiene su logo distintivo en la esquina superior izquierda</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelRoomsManager;