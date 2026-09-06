import { Outlet } from 'react-router-dom';
import { SidebarOferente } from '../components/oferente/SidebarOferente';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

function OferenteLayout() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Cargando...</div>;
  }

  if (!user || user.rol !== 'oferente') {
    return <Navigate to="/" replace />;
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <SidebarOferente />
      <div style={{ flex: 1, marginLeft: '250px', padding: '2rem', background: '#f8fbff', minHeight: '100vh' }}>
        <Outlet />
      </div>
    </div>
  );
}

export default OferenteLayout;