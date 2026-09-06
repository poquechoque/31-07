import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const Header = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handlePanelClick = () => {
    if (user?.rol === 'administrador') {
      navigate('/admin');
    } else if (user?.rol === 'oferente') {
      navigate('/panel-oferente');
    } else if (user?.rol === 'solicitante') {
      navigate('/buscar-mascotas');
    } else {
      navigate('/login');
    }
  };

  return (
    <header className="site-header">
      <Link className="brand" to="/" aria-label="adoptaSucre">
        <svg className="brand-paw" viewBox="0 0 64 64" aria-hidden="true">
          <circle cx="16" cy="18" r="7" />
          <circle cx="31" cy="11" r="7" />
          <circle cx="47" cy="18" r="7" />
          <circle cx="53" cy="33" r="7" />
          <path d="M31.5 26C22 26 16 34.1 16 42.1c0 7.5 6.1 11.9 15.5 11.9S47 49.6 47 42.1C47 34.1 41 26 31.5 26Z" />
        </svg>
        <span>adoptaSucre</span>
      </Link>

      <nav className="site-nav" aria-label="Navegación principal">
        <Link to="/">Inicio</Link>
        <Link to="/mascotasLanding">Mascotas</Link>
        <Link to="/como-adoptar">Cómo adoptar</Link>
        <Link to="/sobre-nosotros">Sobre nosotros</Link>
      </nav>

      {user ? (
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.9rem', color: '#29435f' }}>
            {user.nombreUsuario}
          </span>
          <button 
            className="login-button" 
            style={{ background: '#1672c4', border: 'none', cursor: 'pointer' }}
            onClick={handlePanelClick}
          >
            Panel
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Link to="/login" className="login-button">
            Iniciar sesión
          </Link>
          <Link to="/registro" className="login-button" style={{ background: '#1672c4' }}>
            Registrarse
          </Link>
        </div>
      )}
    </header>
  );
};