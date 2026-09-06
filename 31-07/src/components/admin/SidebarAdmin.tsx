import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

import {
  BarChart3,
  Users,
  PawPrint,
  Bone,
  Home,
  FileBarChart,
  LogOut,
  LayoutDashboard,
} from 'lucide-react';

export const SidebarAdmin = () => {
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const menuItems = [
    {
      path: '/admin',
      icon: LayoutDashboard,
      label: 'Dashboard',
    },
    {
      path: '/admin/usuarios',
      icon: Users,
      label: 'Usuarios',
    },
    {
      path: '/admin/tipos',
      icon: PawPrint,
      label: 'Tipos de Mascota',
    },
    {
      path: '/admin/razas',
      icon: Bone,
      label: 'Razas',
    },
    {
      path: '/admin/adopciones',
      icon: Home,
      label: 'Adopciones',
    },
    {
      path: '/admin/reportes',
      icon: FileBarChart,
      label: 'Reportes',
    },
  ];

  return (
    <aside
      style={{
        width: '250px',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        background: '#0b1f3a',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        padding: '1.5rem 0',
        overflowY: 'auto',
        zIndex: 100,
      }}
    >
      {/* Logo */}
      <div style={{ padding: '0 1.5rem', marginBottom: '1.5rem' }}>
        <Link
          to="/admin"
          style={{
            color: 'white',
            textDecoration: 'none',
            fontSize: '1.3rem',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <PawPrint size={24} />
          <span>adoptaSucre</span>
        </Link>

        <p
          style={{
            fontSize: '0.8rem',
            color: '#8aa4c0',
            margin: '0.3rem 0 0',
          }}
        >
          Panel de Administración
        </p>
      </div>

      {/* Usuario */}
      <div
        style={{
          padding: '0 1.5rem',
          marginBottom: '1.5rem',
          borderBottom: '1px solid #1a3a5c',
          paddingBottom: '1rem',
        }}
      >
        <p style={{ margin: 0, fontWeight: 'bold' }}>
          {user?.nombreUsuario || 'Admin'}
        </p>

        <p
          style={{
            margin: '0.2rem 0 0',
            fontSize: '0.8rem',
            color: '#8aa4c0',
          }}
        >
          Administrador
        </p>
      </div>

      {/* Menú */}
      <nav style={{ flex: 1 }}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1.5rem',
                color: active ? 'white' : '#8aa4c0',
                background: active ? '#1a3a5c' : 'transparent',
                textDecoration: 'none',
                transition: 'background 0.2s',
                borderLeft: active
                  ? '3px solid #1672c4'
                  : '3px solid transparent',
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.background = '#1a3a5c';
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              <Icon size={20} strokeWidth={2} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Cerrar sesión */}
      <div
        style={{
          padding: '1rem 1.5rem',
          borderTop: '1px solid #1a3a5c',
        }}
      >
        <Link
          to="#"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            color: '#dc3545',
            textDecoration: 'none',
          }}
          onClick={(e) => {
            e.preventDefault();

            localStorage.removeItem('token');
            localStorage.removeItem('user');

            window.location.href = '/login';
          }}
        >
          <LogOut size={20} />
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
            marginTop: '0.5rem',
          }}
        >
          <Home size={20} />
          <span>Ir al inicio</span>
        </Link>
      </div>
    </aside>
  );
};

