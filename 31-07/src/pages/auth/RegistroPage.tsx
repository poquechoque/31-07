// src/pages/auth/RegistroPage.tsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaPaw } from 'react-icons/fa';

type RolRegistro = 'oferente' | 'solicitante';

function RegistroPage() {
  const navigate = useNavigate();
  const { registerOferente, registerSolicitante } = useAuth();
  const [rol, setRol] = useState<RolRegistro>('solicitante');
  const [isLoading, setIsLoading] = useState(false);
  const [contrasena, setContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [errorConfirmacion, setErrorConfirmacion] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (contrasena !== confirmarContrasena) {
      setErrorConfirmacion('Las contraseñas no coinciden');
      return;
    }
    setErrorConfirmacion('');

    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      if (rol === 'oferente') {
        await registerOferente({
          nombreUsuario: data.nombreUsuario as string,
          correo: data.correo as string,
          contrasena: data.contrasena as string,
          rol: 'oferente',
          nombres: data.nombres as string,
          apellidos: data.apellidos as string,
          ci: data.ci as string,
          telefono: data.telefono as string,
          direccion: data.direccion as string,
          ciudad: data.ciudad as string || 'Sucre',
          tipoOferente: 'persona',
        });
      } else {
        await registerSolicitante({
          nombreUsuario: data.nombreUsuario as string,
          correo: data.correo as string,
          contrasena: data.contrasena as string,
          rol: 'solicitante',
          nombres: data.nombres as string,
          apellidos: data.apellidos as string,
          ci: data.ci as string,
          fechaNacimiento: data.fechaNacimiento as string,
          edad: parseInt(data.edad as string),
          telefono: data.telefono as string,
          direccion: data.direccion as string,
          ciudad: data.ciudad as string || 'Sucre',
          ocupacion: data.ocupacion as string,
          tipoVivienda: data.tipoVivienda as any,
          tenenciaVivienda: data.tenenciaVivienda as any,
          tienePatio: data.tienePatio === 'on',
          tieneOtrasMascotas: data.tieneOtrasMascotas === 'on',
        });
      }
      navigate('/');
    } catch (error) {
      // Error ya manejado por toast en el contexto
    } finally {
      setIsLoading(false);
    }
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
          max-width: 440px;
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
          background: #16A34A;
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
        .af-header { text-align: center; margin-bottom: 1.5rem; }
        .af-title { margin: 0; color: #0F172A; font-size: 1.25rem; font-weight: 700; }
        .af-subtitle { margin: 0.3rem 0 0; color: #64748B; font-size: 0.85rem; }

        .af-section-title {
          font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;
          color: #94A3B8; margin: 1.4rem 0 0.75rem;
        }
        .af-section-title:first-of-type { margin-top: 0; }

        .af-field { display: flex; flex-direction: column; margin-bottom: 1rem; }
        .af-label { font-size: 0.82rem; font-weight: 600; color: #334155; margin-bottom: 0.4rem; }
        .af-input, .af-select {
          width: 100%;
          box-sizing: border-box;
          padding: 0.75rem 0.9rem;
          border-radius: 10px;
          border: 1px solid #E2E8F0;
          background: #F8FAFC;
          font-size: 0.9rem;
          color: #0F172A;
          font-family: inherit;
        }
        .af-input:focus, .af-select:focus {
          outline: none;
          border-color: #16A34A;
          background: white;
          box-shadow: 0 0 0 3px #F0FDF4;
        }

        .af-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 0.9rem; }

        .af-chips { display: flex; flex-wrap: wrap; gap: 0.6rem; margin-bottom: 1rem; }
        .af-chip {
          display: flex; align-items: center; gap: 0.5rem; cursor: pointer;
          padding: 0.6rem 0.9rem; border: 1px solid #E2E8F0; border-radius: 10px;
          font-size: 0.85rem; color: #334155; background: #F8FAFC; flex: 1 1 180px;
        }
        .af-chip:hover { border-color: #86EFAC; }
        .af-chip input { accent-color: #16A34A; width: 15px; height: 15px; flex-shrink: 0; }

        .af-field-error { color: #DC2626; font-size: 0.78rem; margin-top: 0.35rem; }

        .af-submit {
          width: 100%;
          margin-top: 0.5rem;
          padding: 0.8rem;
          border: none;
          border-radius: 10px;
          background: #16A34A;
          color: white;
          font-size: 0.95rem;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.15s;
        }
        .af-submit:hover:not(:disabled) { background: #15803D; }
        .af-submit:disabled { background: #86EFAC; cursor: not-allowed; }

        .af-links { text-align: center; margin-top: 1.25rem; }
        .af-link { color: #16A34A; font-size: 0.85rem; text-decoration: none; font-weight: 500; }
        .af-link:hover { text-decoration: underline; }
        .af-muted { color: #64748B; font-size: 0.85rem; }

        @media (max-width: 480px) {
          .af-grid-2 { grid-template-columns: 1fr; }
          .af-card { padding: 1.5rem; }
        }
      `}</style>

      <div className="af-card">
        <div className="af-logo">
          <div className="af-logo-badge"><FaPaw /></div>
          <span className="af-logo-text">AdoptaSucre</span>
        </div>

        <div className="af-header">
          <h1 className="af-title">Crea tu cuenta</h1>
          <p className="af-subtitle">Únete para empezar a adoptar</p>
        </div>

        <form onSubmit={handleSubmit}>
          <p className="af-section-title">Tipo de cuenta</p>
          <div className="af-field">
            <label htmlFor="rol" className="af-label">Quiero registrarme como</label>
            <select
              id="rol"
              value={rol}
              onChange={(e) => setRol(e.target.value as RolRegistro)}
              className="af-select"
            >
              <option value="solicitante">Solicitante (Quiero adoptar)</option>
              <option value="oferente">Oferente (Quiero dar en adopción)</option>
            </select>
          </div>

          <p className="af-section-title">Datos de acceso</p>

          <div className="af-field">
            <label htmlFor="nombreUsuario" className="af-label">Nombre de usuario</label>
            <input id="nombreUsuario" name="nombreUsuario" required className="af-input" placeholder="Ej: juanperez" />
          </div>

          <div className="af-field">
            <label htmlFor="correo" className="af-label">Correo electrónico</label>
            <input id="correo" name="correo" type="email" required className="af-input" placeholder="ejemplo@correo.com" />
          </div>

          <div className="af-grid-2">
            <div className="af-field">
              <label htmlFor="contrasena" className="af-label">Contraseña</label>
              <input
                id="contrasena"
                name="contrasena"
                type="password"
                required
                minLength={6}
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                className="af-input"
                placeholder="Mínimo 6 caracteres"
              />
            </div>
            <div className="af-field">
              <label htmlFor="confirmarContrasena" className="af-label">Confirmar contraseña</label>
              <input
                id="confirmarContrasena"
                type="password"
                required
                minLength={6}
                value={confirmarContrasena}
                onChange={(e) => setConfirmarContrasena(e.target.value)}
                className="af-input"
                placeholder="Repite la contraseña"
              />
            </div>
          </div>
          {errorConfirmacion && (
            <p className="af-field-error" style={{ marginTop: '-0.4rem', marginBottom: '1rem' }}>
              {errorConfirmacion}
            </p>
          )}

          <p className="af-section-title">Datos personales</p>

          <div className="af-grid-2">
            <div className="af-field">
              <label htmlFor="nombres" className="af-label">Nombres</label>
              <input id="nombres" name="nombres" required className="af-input" />
            </div>
            <div className="af-field">
              <label htmlFor="apellidos" className="af-label">Apellidos</label>
              <input id="apellidos" name="apellidos" required className="af-input" />
            </div>
          </div>

          <div className="af-grid-2">
            <div className="af-field">
              <label htmlFor="ci" className="af-label">CI</label>
              <input id="ci" name="ci" required pattern="[0-9]{6,10}" className="af-input" />
            </div>
            <div className="af-field">
              <label htmlFor="telefono" className="af-label">Teléfono</label>
              <input id="telefono" name="telefono" required pattern="[0-9]{7,10}" className="af-input" />
            </div>
          </div>

          <div className="af-field">
            <label htmlFor="direccion" className="af-label">Dirección</label>
            <input id="direccion" name="direccion" required className="af-input" />
          </div>

          <div className="af-field">
            <label htmlFor="ciudad" className="af-label">Ciudad</label>
            <input id="ciudad" name="ciudad" defaultValue="Sucre" className="af-input" />
          </div>

          {rol === 'solicitante' && (
            <>
              <p className="af-section-title">Datos para adopción</p>

              <div className="af-grid-2">
                <div className="af-field">
                  <label htmlFor="fechaNacimiento" className="af-label">Fecha de nacimiento</label>
                  <input id="fechaNacimiento" name="fechaNacimiento" type="date" required className="af-input" />
                </div>
                <div className="af-field">
                  <label htmlFor="edad" className="af-label">Edad</label>
                  <input id="edad" name="edad" type="number" required min={18} className="af-input" />
                </div>
              </div>

              <div className="af-field">
                <label htmlFor="ocupacion" className="af-label">Ocupación</label>
                <input id="ocupacion" name="ocupacion" required className="af-input" />
              </div>

              <div className="af-grid-2">
                <div className="af-field">
                  <label htmlFor="tipoVivienda" className="af-label">Tipo de vivienda</label>
                  <select id="tipoVivienda" name="tipoVivienda" required className="af-select">
                    <option value="casa">Casa</option>
                    <option value="departamento">Departamento</option>
                    <option value="habitacion">Habitación</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
                <div className="af-field">
                  <label htmlFor="tenenciaVivienda" className="af-label">Tenencia de vivienda</label>
                  <select id="tenenciaVivienda" name="tenenciaVivienda" required className="af-select">
                    <option value="propia">Propia</option>
                    <option value="alquilada">Alquilada</option>
                    <option value="familiar">Familiar</option>
                    <option value="anticretico">Anticrético</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
              </div>

              <div className="af-chips">
                <label className="af-chip">
                  <input type="checkbox" name="tienePatio" />
                  ¿Tiene patio?
                </label>
                <label className="af-chip">
                  <input type="checkbox" name="tieneOtrasMascotas" />
                  ¿Tiene otras mascotas?
                </label>
              </div>
            </>
          )}

          <button type="submit" disabled={isLoading} className="af-submit">
            {isLoading ? 'Registrando...' : 'Registrarme'}
          </button>
        </form>

        <div className="af-links">
          <span className="af-muted">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="af-link">Inicia sesión</Link>
          </span>
        </div>
      </div>
    </div>
  );
}

export default RegistroPage;