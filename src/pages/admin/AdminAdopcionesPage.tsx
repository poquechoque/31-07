import { useEffect, useState } from 'react';
import { adopcionApi } from '../../api/adopcionApi';
import type{  Adopcion } from '../../api/adopcionApi';
import toast from 'react-hot-toast';

function AdminAdopcionesPage() {
  const [adopciones, setAdopciones] = useState<Adopcion[]>([]);
  const [loading, setLoading] = useState(true);

  const cargarAdopciones = async () => {
    try {
      const res = await adopcionApi.listar();
      setAdopciones(res.data);
    } catch (error) {
      toast.error('Error al cargar adopciones');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarAdopciones();
  }, []);

  const handleCambiarEstado = async (id: string, estado: 'activa' | 'anulada' | 'finalizada') => {
    if (!confirm(`¿Cambiar estado a ${estado}?`)) return;
    try {
      await adopcionApi.actualizarEstado(id, estado);
      toast.success('Estado actualizado');
      cargarAdopciones();
    } catch (error) {
      toast.error('Error al actualizar estado');
    }
  };

  const handleEliminar = async (id: string) => {
    if (!confirm('¿Eliminar esta adopción?')) return;
    try {
      await adopcionApi.eliminar(id);
      toast.success('Adopción eliminada');
      cargarAdopciones();
    } catch (error) {
      toast.error('Error al eliminar');
    }
  };

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Cargando adopciones...</div>;
  }

  return (
    <div>
      <h1 style={{ margin: '0 0 2rem', color: '#0b1f3a' }}>Gestión de Adopciones</h1>

      <div style={{ overflowX: 'auto', background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#0b1f3a', color: 'white' }}>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Mascota</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Adoptante</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Fecha</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Estado</th>

            </tr>
          </thead>
          <tbody>
            {adopciones.map((a) => (
              <tr key={a._id} style={{ borderBottom: '1px solid #e2eaf3' }}>
                <td style={{ padding: '0.75rem' }}>{a.solicitud?.mascota?.nombre || 'N/A'}</td>
                <td style={{ padding: '0.75rem' }}>
                  {a.solicitud?.postulante?.nombres} {a.solicitud?.postulante?.apellidos}
                </td>
                <td style={{ padding: '0.75rem' }}>
                  {new Date(a.fechaAdopcion).toLocaleDateString('es-BO')}
                </td>
                <td style={{ padding: '0.75rem' }}>
                  <span className={`estado-badge ${a.solicitud?.estadoSolicitud === 'activa' ? 'estado-badge-publicado' : a.solicitud?.estadoSolicitud === 'finalizada' ? 'estado-badge-adoptado' : 'estado-badge-borrador'}`}>
                    {a.solicitud?.estadoSolicitud}
                  </span>
                </td>
                
              </tr>
            ))}
          </tbody>
        </table>
        {adopciones.length === 0 && (
          <p style={{ textAlign: 'center', padding: '2rem', color: '#49627c' }}>No hay adopciones registradas</p>
        )}
      </div>
    </div>
  );
}

export default AdminAdopcionesPage;