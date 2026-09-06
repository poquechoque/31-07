import { useEffect, useState } from 'react';
import apiClient from '../../api/client';
import toast from 'react-hot-toast';

interface Usuario {
  _id: string;
  nombreUsuario: string;
  correo: string;
  rol: string;
  estado: boolean;
  fechaRegistro: string;
}

function AdminUsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);

  const cargarUsuarios = async () => {
    try {
      const res = await apiClient.get('/admin/usuarios');
      setUsuarios(res.data);
    } catch (error) {
      toast.error('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const handleCambiarEstado = async (id: string, estadoActual: boolean) => {
    try {
      await apiClient.put(`/admin/usuarios/${id}/estado`, { estado: !estadoActual });
      toast.success('Estado actualizado');
      cargarUsuarios();
    } catch (error) {
      toast.error('Error al actualizar estado');
    }
  };

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Cargando usuarios...</div>;
  }

  return (
    <div>
      <h1 style={{ margin: '0 0 2rem', color: '#0b1f3a' }}>Gestión de Usuarios</h1>

      <div style={{ overflowX: 'auto', background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#0b1f3a', color: 'white' }}>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Usuario</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Correo</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Rol</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Estado</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Registro</th>
              <th style={{ padding: '0.75rem', textAlign: 'center' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u._id} style={{ borderBottom: '1px solid #e2eaf3' }}>
                <td style={{ padding: '0.75rem' }}>{u.nombreUsuario}</td>
                <td style={{ padding: '0.75rem' }}>{u.correo}</td>
                <td style={{ padding: '0.75rem' }}>
                  <span className={`estado-badge ${u.rol === 'administrador' ? 'estado-badge-adoptado' : 'estado-badge-publicado'}`}>
                    {u.rol}
                  </span>
                </td>
                <td style={{ padding: '0.75rem' }}>
                  <span className={`estado-badge ${u.estado ? 'estado-badge-publicado' : 'estado-badge-borrador'}`}>
                    {u.estado ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td style={{ padding: '0.75rem' }}>
                  {new Date(u.fechaRegistro).toLocaleDateString('es-BO')}
                </td>
                <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                  <button
                    onClick={() => handleCambiarEstado(u._id, u.estado)}
                    className="login-button"
                    style={{ 
                      background: u.estado ? '#ffc107' : '#28a745',
                      padding: '0.4rem 1rem',
                      fontSize: '0.85rem'
                    }}
                  >
                    {u.estado ? 'Desactivar' : 'Activar'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {usuarios.length === 0 && (
          <p style={{ textAlign: 'center', padding: '2rem', color: '#49627c' }}>No hay usuarios registrados</p>
        )}
      </div>
    </div>
  );
}

export default AdminUsuariosPage;