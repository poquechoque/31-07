import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

import { 
  FaPaw, 
  FaPlus, 
  FaEnvelope, 
  FaHome, 
  FaSignOutAlt, 
  FaUser,
  FaClipboardList,
  FaDog,
  FaArrowLeft
} from 'react-icons/fa';

export const SidebarOferente = () => {
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const menuItems = [
    { path: '/panel-oferente', icon: FaClipboardList, label: 'Mis Mascotas' },
    { path: '/mascotas/nueva', icon: FaPlus, label: 'Publicar Mascota' },
    { path: '/solicitudes/recibidas', icon: FaEnvelope, label: 'Solicitudes Recibidas' },
    { path: '/mis-adopciones-oferente', icon: FaHome, label: 'Mis Adopciones' },
  ];

  return (
    <aside style={{
      width: '250px',
      height: '100vh',
      position: 'fixed',
      top: 0,
      left: 0,
      background: '#0858bf',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      padding: '1.5rem 0',
      overflowY: 'auto',
      zIndex: 100,
    }}>
      {/* Logo */}
      <div style={{ padding: '0 1.5rem', marginBottom: '1.5rem' }}>
        <Link to="/panel-oferente" style={{ 
          color: 'white', 
          textDecoration: 'none', 
          fontSize: '1.3rem', 
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <FaPaw style={{ color: '#3B82F6' }} />
          adoptaSucre
        </Link>
        <p style={{ fontSize: '0.8rem', color: '#f9fcff', margin: '0.3rem 0 0', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <FaDog style={{ fontSize: '0.7rem' }} />
          Panel de Oferente
        </p>
      </div>

      {/* Usuario */}
      <div style={{ 
        padding: '0 1.5rem', 
        marginBottom: '1.5rem', 
        borderBottom: '1px solid #023974', 
        paddingBottom: '1rem' 
      }}>
        <p style={{ margin: 0, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FaUser style={{ fontSize: '0.8rem', color: '#3B82F6' }} />
          {user?.nombreUsuario || 'Oferente'}
        </p>
        <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: '#eef1f5', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#22C55E' }} />
          Oferente
        </p>
      </div>

      {/* Menú */}
      <nav style={{ flex: 1 }}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1.5rem',
                color: isActive(item.path) ? 'white' : '#f0f3f6',
                background: isActive(item.path) ? '#1a3a5c' : 'transparent',
                textDecoration: 'none',
                transition: 'all 0.2s',
                borderLeft: isActive(item.path) ? '3px solid #3B82F6' : '3px solid transparent',
              }}
              onMouseEnter={(e) => {
                if (!isActive(item.path)) {
                  e.currentTarget.style.background = '#1a3a5c';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive(item.path)) {
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              <Icon style={{ 
                fontSize: '1.1rem', 
                color: isActive(item.path) ? '#3B82F6' : '#f2f5f7',
                transition: 'color 0.2s'
              }} />
              <span>{item.label}</span>
              {isActive(item.path) && (
                <span style={{ 
                  marginLeft: 'auto', 
                  fontSize: '0.6rem', 
                  color: '#3B82F6',
                  background: 'rgba(59, 130, 246, 0.2)',
                  padding: '0.1rem 0.4rem',
                  borderRadius: '4px'
                }}>
                  ●
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Cerrar sesión */}
      <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid #1a3a5c' }}>
        <Link
          to="#"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            color: '#EF4444',
            textDecoration: 'none',
            padding: '0.5rem 0',
            transition: 'color 0.2s',
          }}
          onClick={(e) => {
            e.preventDefault();
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#F87171';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#EF4444';
          }}
        >
          <FaSignOutAlt style={{ fontSize: '1.1rem' }} />
          <span>Cerrar sesión</span>
        </Link>
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            color: '#8aa4c0',
            textDecoration: 'none',
            padding: '0.5rem 0',
            marginTop: '0.25rem',
            transition: 'color 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#f9f9f9';
          }}
        >
          <FaArrowLeft style={{ fontSize: '1.1rem' }} />
          <span>Ir al inicio</span>
        </Link>
      </div>
    </aside>
  );
};