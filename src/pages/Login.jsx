import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, EyeOff, CreditCard, Lock, ArrowLeft } from "lucide-react";
import { useAuth } from "@/features/auth/useAuth";

function Login() {
  const [formData, setFormData] = useState({
    dni: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/homeusuario");
    }
  }, [isAuthenticated, navigate]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    // Llama al login con los datos correctos
    const result = await login(formData.dni, formData.password);
    if (result.success) {
      navigate("/homeusuario");
    } else {
      setError(result.error || "Credenciales incorrectas");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Lado izquierdo - Formulario */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-lg">
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
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Bienvenido a Hotel Princess</h2>
            <p className="text-gray-600">Ingresa a tu cuenta para continuar</p>
          </div>

          {/* Formulario */}
          <Card className="shadow-2xl border-0">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
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

                {/* Contraseña */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                      Contraseña
                    </Label>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
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

                {/* Recordarme */}
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember" className="text-sm text-gray-600">
                    Recordarme
                  </label>
                </div>

                {/* Botón de login */}
                <Button
                  type="submit"
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium text-base"
                >
                  Iniciar sesión
                </Button>

                {/* Link a registro */}
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    ¿No tienes una cuenta?{" "}
                    <Link to="/register" className="text-blue-600 hover:text-blue-800 font-medium">
                      Regístrate aquí
                    </Link>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
        {/* Notificaciones flotantes en la esquina inferior izquierda */}
        <div className="fixed bottom-8 left-8 z-50 flex flex-col items-start space-y-2">
          {error && (
            <div className="bg-red-500/90 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 animate-fade-in-up min-w-[280px] max-w-xs border-l-4 border-red-700 relative">
              <button
                onClick={() => setError("")}
                className="absolute top-2 right-2 text-white/80 hover:text-white transition-colors"
                aria-label="Cerrar notificación"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
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
        </div>
      </div>

      {/* Lado derecho - Imagen y contenido promocional */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/25 z-10"></div>
        <img
          src="/src/assets/hotel-princess.jpg"
          alt="Hotel Princess Background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 flex flex-col justify-between p-12 text-white">
          {/* Logo */}
          <div className="flex justify-start">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-blue-600 rounded" />
              </div>
              <span className="text-xl font-bold">Hotel Princess</span>
            </div>
          </div>

          {/* Contenido principal */}
          <div className="space-y-4">
            <h1 className="text-2xl font-semibold leading-relaxed">
              "Hotel Princess ofrece una experiencia única con instalaciones modernas y un servicio
              excepcional. El lugar perfecto para una estadía inolvidable."
            </h1>

            {/* Perfil del huésped */}
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">AC</span>
              </div>
              <div>
                <p className="font-semibold">Ana Castillo</p>
                <p className="text-blue-200 text-sm">Huésped frecuente</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
