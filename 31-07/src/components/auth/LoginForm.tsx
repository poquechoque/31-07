import { useState } from "react";
import type { FormEventHandler } from "react";
import { Link } from "react-router-dom";
import { FaPaw, FaEye, FaEyeSlash } from "react-icons/fa";
import type { LoginCredentials } from "../../types/auth";

interface LoginFormProps {
  error?: string;
  onSubmit: (credentials: LoginCredentials) => void;
}

function LoginForm({ error, onSubmit }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      return;
    }

    onSubmit({
      email: normalizedEmail,
      password,
    });
  };

  return (
    <div className="af-page">
      <style>{`
        .af-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #F8FAFC;
          padding: 2rem 1rem;
        }
        .af-card {
          width: 100%;
          max-width: 400px;
          background: white;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.06);
          padding: 2rem 2rem 1.75rem;
        }
        .af-logo {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }
        .af-logo-badge {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          background: #2563EB;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 0.95rem;
          flex-shrink: 0;
        }
        .af-logo-text {
          font-size: 1.15rem;
          font-weight: 800;
          color: #0F172A;
        }
        .af-header { text-align: center; margin-bottom: 1.75rem; }
        .af-title { margin: 0; color: #0F172A; font-size: 1.25rem; font-weight: 700; }
        .af-subtitle { margin: 0.3rem 0 0; color: #64748B; font-size: 0.85rem; }

        .af-field { display: flex; flex-direction: column; margin-bottom: 1.1rem; }
        .af-label { font-size: 0.82rem; font-weight: 600; color: #334155; margin-bottom: 0.4rem; }
        .af-input-wrap { position: relative; }
        .af-input {
          width: 100%;
          box-sizing: border-box;
          padding: 0.75rem 0.9rem;
          border-radius: 10px;
          border: 1px solid #E2E8F0;
          background: #F8FAFC;
          font-size: 0.9rem;
          color: #0F172A;
        }
        .af-input:focus {
          outline: none;
          border-color: #2563EB;
          background: white;
          box-shadow: 0 0 0 3px #EFF6FF;
        }
        .af-eye-btn {
          position: absolute;
          right: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #94A3B8;
          cursor: pointer;
          display: flex;
          align-items: center;
          padding: 0.2rem;
        }
        .af-eye-btn:hover { color: #64748B; }

        .af-error {
          color: #DC2626;
          background: #FEF2F2;
          border: 1px solid #FCA5A5;
          border-radius: 8px;
          padding: 0.6rem 0.8rem;
          font-size: 0.83rem;
          margin: 0 0 1.1rem;
        }

        .af-submit {
          width: 100%;
          padding: 0.8rem;
          border: none;
          border-radius: 10px;
          background: #2563EB;
          color: white;
          font-size: 0.95rem;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.15s;
        }
        .af-submit:hover:not(:disabled) { background: #1D4ED8; }
        .af-submit:disabled { background: #93C5FD; cursor: not-allowed; }

        .af-links { text-align: center; margin-top: 1.25rem; display: flex; flex-direction: column; gap: 0.6rem; }
        .af-link { color: #2563EB; font-size: 0.85rem; text-decoration: none; font-weight: 500; }
        .af-link:hover { text-decoration: underline; }
        .af-muted { color: #64748B; font-size: 0.85rem; }
      `}</style>

      <div className="af-card">
        <div className="af-logo">
          <div className="af-logo-badge"><FaPaw /></div>
          <span className="af-logo-text">AdoptaSucre</span>
        </div>

        <div className="af-header">
          <h1 className="af-title">¡Bienvenido de vuelta!</h1>
          <p className="af-subtitle">Ingresa tus datos para continuar</p>
        </div>

        {error && <p className="af-error" role="alert" aria-live="polite">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="af-field">
            <label htmlFor="email" className="af-label">Correo electrónico</label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="ejemplo@correo.com"
              autoComplete="email"
              pattern="^[a-zA-Z0-9._%+\-]+@gmail\.com$"
              title="Ingrese un correo de Gmail válido"
              required
              className="af-input"
            />
          </div>

          <div className="af-field">
            <label htmlFor="password" className="af-label">Contraseña</label>
            <div className="af-input-wrap">
              <input
                id="password"
                name="password"
                type={mostrarPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Ingrese su contraseña"
                autoComplete="current-password"
                required
                className="af-input"
                style={{ paddingRight: "2.5rem" }}
              />
              <button
                type="button"
                className="af-eye-btn"
                onClick={() => setMostrarPassword((v) => !v)}
                aria-label={mostrarPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {mostrarPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
              </button>
            </div>
          </div>

          <button type="submit" className="af-submit">
            Iniciar sesión
          </button>
        </form>

        <div className="af-links">
          
          <span className="af-muted">
            ¿No tienes cuenta?{" "}
            <Link to="/registro" className="af-link">Regístrate</Link>
          </span>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;