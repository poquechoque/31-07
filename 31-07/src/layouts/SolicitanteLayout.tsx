import { Outlet } from 'react-router-dom';
import { SidebarSolicitante } from '../components/solicitante/SidebarSolicitante';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

function SolicitanteLayout() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Cargando...</div>;
  }

  if (!user || user.rol !== 'solicitante') {
    return <Navigate to="/" replace />;
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <SidebarSolicitante />
      <div style={{ flex: 1, marginLeft: '250px', padding: '2rem', background: '#F8FAFC', minHeight: '100vh' }}>
        <Outlet />  {/* ✅ Esto renderiza las páginas hijas */}
      </div>
    </div>
  );
}

export default SolicitanteLayout;