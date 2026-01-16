import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/auth.context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { authAPI } from "@/lib/api";
import { toast } from "sonner";

export const RegisterPage = () => {
  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await authAPI.sendVerificationCode(email);
      toast.success("Código de verificación enviado a su correo");
      setStep(2);
    } catch (err: any) {
      console.log("Email Verification...");
      console.log(err);
      setError(err.response?.data?.error?.message || "Error al enviar código");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setIsLoading(true);

    try {
      await register(email, password, name, code);
      toast.success("Cuenta creada exitosamente");
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al registrarse");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/10 backdrop-blur-md border-white/20 shadow-xl">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl font-bold text-white">
            SIMAUD-LEX
          </CardTitle>
          <CardDescription className="text-blue-100 text-base">
            {step === 1 ? "Validación de Correo" : "Completa tu Registro"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={step === 1 ? handleSendCode : handleRegister}
            className="space-y-4"
          >
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-white">
                Correo Electrónico
              </label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading || step === 2}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
            </div>

            {step === 2 && (
              <>
                <div className="space-y-2">
                  <label
                    htmlFor="code"
                    className="text-sm font-medium text-white"
                  >
                    Código de Verificación
                  </label>
                  <Input
                    id="code"
                    type="text"
                    placeholder="12345"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                    disabled={isLoading}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 tracking-widest text-center text-lg"
                    maxLength={5}
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="text-sm font-medium text-white"
                  >
                    Nombre Completo
                  </label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Juan Pérez"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={isLoading}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-white"
                  >
                    Contraseña
                  </label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    minLength={6}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="confirmPassword"
                    className="text-sm font-medium text-white"
                  >
                    Confirmar Contraseña
                  </label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    minLength={6}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                </div>
              </>
            )}

            <Button
              type="submit"
              className="w-full bg-accent hover:bg-accent-600 text-white"
              disabled={isLoading}
            >
              {isLoading
                ? step === 1
                  ? "Enviando..."
                  : "Registrando..."
                : step === 1
                ? "Enviar Código"
                : "Registrarse"}
            </Button>

            <p className="text-center text-sm text-blue-100">
              ¿Ya tienes cuenta?{" "}
              <Link
                to="/login"
                className="text-accent hover:text-accent-400 font-medium underline"
              >
                Inicia sesión aquí
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
