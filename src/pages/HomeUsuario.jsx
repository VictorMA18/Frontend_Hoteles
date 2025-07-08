import React from 'react';
import { useAuth } from '@/features/auth/useAuth';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const HomeUsuario = () => {
  // Leer usuario directamente del localStorage
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-4">Bienvenido/a, huesped autenticado</h1>
      {usuario ? (
        <div className="mb-6">
          <p><strong>Nombre:</strong> {usuario.nombres}</p>
          <p><strong>DNI:</strong> {usuario.dni}</p>
          {/* Agrega aquí más datos si tu API los retorna */}
        </div>
      ) : (
        <p className="mb-6">Cargando datos de usuario...</p>
      )}
      <Button variant="destructive" onClick={handleLogout} className="mt-4">Cerrar sesión</Button>
      {/* Aquí puedes agregar más componentes o información relevante para el usuario autenticado */}
    </div>
  );
};

export default HomeUsuario;
