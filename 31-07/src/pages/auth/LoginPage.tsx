import { useState } from "react";
import { Navigate } from "react-router-dom";
import LoginForm from "../../components/auth/LoginForm";
import { useAuth } from "../../context/AuthContext";
import type { LoginCredentials } from "../../types/auth";

function LoginPage() {
  const { login, user, isLoading } = useAuth();
  const [error, setError] = useState("");

  if (user && !isLoading) {
    if (user.rol === 'administrador') {
      return <Navigate to="/admin" replace />;
    } else if (user.rol === 'oferente') {
      return <Navigate to="/panel-oferente" replace />;
    } else if (user.rol === 'solicitante') {
      return <Navigate to="/mis-solicitudes" replace />;
    }
    return <Navigate to="/" replace />;
  }

  const handleLogin = async (credentials: LoginCredentials) => {
    setError("");
    try {
      // Convertir credentials al formato que espera el backend
      await login(credentials.email, credentials.password);
      // La redirección se maneja en el useEffect o en el return
    } catch (err: any) {
      setError(err.message || "Error al iniciar sesión");
    }
  };

  return (
    <main>
      <LoginForm error={error} onSubmit={handleLogin} />
    </main>
  );
}

export default LoginPage;