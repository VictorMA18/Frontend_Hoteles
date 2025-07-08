import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, EyeOff, User, Phone, CreditCard, Lock, ArrowLeft } from "lucide-react";
import axios from "axios";

function Register() {
  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    dni: "",
    celular: "",
    contraseña: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!acceptTerms) {
      alert("Debes aceptar los términos y condiciones");
      return;
    }
    try {
      const response = await axios.post("http://localhost:8000/api/usuarios/register/", {
        nombres: formData.nombres,
        apellidos: formData.apellidos,
        dni: formData.dni,
        id_tipo_doc: 1,
        celular: formData.celular,
        password: formData.contraseña,
      });
      setSuccess("¡Registro exitoso! Ahora puedes iniciar sesión.");
      setFormData({
        nombres: "",
        apellidos: "",
        dni: "",
        celular: "",
        contraseña: "",
      });
      setAcceptTerms(false);
    } catch (err) {
      setError(err.response?.data?.detail || "Error al registrar usuario");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Lado izquierdo - Imagen y contenido promocional */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <div className="absolute inset-0 bg-gradient-to-bl from-purple-500/25 z-10"></div>
        <img
          src="/src/assets/hotel-princess.jpg"
          alt="Hotel Princess Background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 flex flex-col justify-between p-12 text-white">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-blue-600 rounded" />
            </div>
            <span className="text-xl font-bold">Hotel Princess</span>
          </div>

          {/* Contenido principal */}
          <div className="space-y-4">
            <blockquote className="text-2xl font-semibold leading-relaxed">
              "Únete a nuestra familia de huéspedes y descubre por qué Hotel Princess es la mejor opción para
              tu estadía. Comodidad, elegancia y servicio de primera clase."
            </blockquote>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-lg font-semibold">LM</span>
              </div>
              <div>
                <cite className="text-lg font-medium not-italic">Luis Martínez</cite>
                <p className="text-white/80">Director de Hospitalidad</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lado derecho - Formulario */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="mb-6">
            <Link
              to="/"
              className="inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors group"
            >
              <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              <span className="text-lg font-medium">Volver al inicio</span>
            </Link>
          </div>

          {/* Header del formulario */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Crear cuenta en Hotel Princess</h2>
            <p className="text-gray-600">Completa tus datos para registrarte</p>
          </div>

          {/* Formulario */}
          <Card className="shadow-2xl border-0">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Nombres */}
                <div className="space-y-2">
                  <Label htmlFor="nombres" className="text-sm font-medium text-gray-700">
                    Nombres
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="nombres"
                      type="text"
                      value={formData.nombres}
                      onChange={(e) => handleInputChange("nombres", e.target.value)}
                      placeholder="Juan Carlos"
                      className="pl-10 h-12"
                      required
                    />
                  </div>
                </div>

                {/* Apellidos */}
                <div className="space-y-2">
                  <Label htmlFor="apellidos" className="text-sm font-medium text-gray-700">
                    Apellidos
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="apellidos"
                      type="text"
                      value={formData.apellidos}
                      onChange={(e) => handleInputChange("apellidos", e.target.value)}
                      placeholder="Pérez García"
                      className="pl-10 h-12"
                      required
                    />
                  </div>
                </div>

                {/* DNI */}
                <div className="space-y-2">
                  <Label htmlFor="dni" className="text-sm font-medium text-gray-700">
                    DNI
                  </Label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="dni"
                      type="text"
                      value={formData.dni}
                      onChange={(e) => handleInputChange("dni", e.target.value)}
                      placeholder="12345678"
                      maxLength={8}
                      pattern="[0-9]{8}"
                      className="pl-10 h-12"
                      required
                    />
                  </div>
                </div>

                {/* Celular */}
                <div className="space-y-2">
                  <Label htmlFor="celular" className="text-sm font-medium text-gray-700">
                    Celular
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="celular"
                      type="tel"
                      value={formData.celular}
                      onChange={(e) => handleInputChange("celular", e.target.value)}
                      placeholder="987654321"
                      maxLength={9}
                      pattern="[0-9]{9}"
                      className="pl-10 h-12"
                      required
                    />
                  </div>
                </div>

                {/* Contraseña */}
                <div className="space-y-2">
                  <Label htmlFor="contraseña" className="text-sm font-medium text-gray-700">
                    Contraseña
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="contraseña"
                      type={showPassword ? "text" : "password"}
                      value={formData.contraseña}
                      onChange={(e) => handleInputChange("contraseña", e.target.value)}
                      placeholder="••••••••"
                      className="pl-10 pr-10 h-12"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Términos y condiciones */}
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    required
                  />
                  <label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed">
                    Acepto los{" "}
                    <Link to="/terminos" className="text-blue-600 hover:text-blue-800 underline">
                      términos y condiciones
                    </Link>{" "}
                    y la{" "}
                    <Link to="/privacidad" className="text-blue-600 hover:text-blue-800 underline">
                      política de privacidad
                    </Link>{" "}
                    de Hotel Princess
                  </label>
                </div>

                {/* Botón de registro */}
                <Button
                  type="submit"
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium text-base"
                >
                  Crear cuenta
                </Button>

                {/* Link a login */}
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    ¿Ya tienes una cuenta?{" "}
                    <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                      Inicia sesión aquí
                    </Link>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end space-y-2">
        {error && (
          <div className="bg-red-600/90 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 animate-fade-in-up min-w-[280px] max-w-xs border-l-4 border-red-700 relative">
            <button
              onClick={() => setError("")}
              className="absolute top-2 right-2 text-white/80 hover:text-white transition-colors"
              aria-label="Cerrar notificación"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <svg
              className="w-6 h-6 text-white/80"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span className="font-medium">{error}</span>
          </div>
        )}
        {success && (
          <div className="bg-green-600/90 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 animate-fade-in-up min-w-[280px] max-w-xs border-l-4 border-green-700 relative">
            <button
              onClick={() => setSuccess("")}
              className="absolute top-2 right-2 text-white/80 hover:text-white transition-colors"
              aria-label="Cerrar notificación"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <svg
              className="w-6 h-6 text-white/80"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-medium">{success}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default Register;
