import { useEffect, useState } from 'react';
import { solicitudApi } from '../api/solicitudApi';
import type { SolicitudAdopcion } from '../api/solicitudApi';
import toast from 'react-hot-toast';

function SolicitudesRecibidasPage() {
  const [solicitudes, setSolicitudes] = useState<SolicitudAdopcion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarSolicitudes = async () => {
      try {
        const res = await solicitudApi.recibidas();
        setSolicitudes(res.data);
      } catch (error) {
        toast.error('Error al cargar solicitudes');
      } finally {
        setLoading(false);
      }
    };
    cargarSolicitudes();
  }, []);

  const handleResponder = async (solicitudId: string, accion: 'aprobada' | 'rechazada') => {
    try {
      await solicitudApi.responder(solicitudId, accion);
      toast.success(`Solicitud ${accion === 'aprobada' ? 'aprobada' : 'rechazada'}`);
      const res = await solicitudApi.recibidas();
      setSolicitudes(res.data);
    } catch (error) {
      toast.error('Error al responder');
    }
  };

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Cargando...</div>;
  }

  return (
    <div>
      <h1 style={{ margin: '0 0 2rem', color: '#0b1f3a' }}>Solicitudes Recibidas</h1>

      {solicitudes.length === 0 ? (
        <p style={{ color: '#49627c' }}>No tienes solicitudes pendientes.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {solicitudes.map((s) => (
            <div key={s._id} style={{ border: '1px solid #e2eaf3', borderRadius: '16px', padding: '1.5rem', background: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap' }}>
                <div>
                  <h3 style={{ margin: 0 }}>{s.mascota?.nombre || 'Mascota'}</h3>
                  <p style={{ margin: '0.5rem 0', color: '#49627c' }}>
                    Solicitante: {s.postulante?.nombres} {s.postulante?.apellidos}
                  </p>
                  <p style={{ margin: '0.25rem 0', color: '#49627c' }}>
                    Teléfono: {s.postulante?.telefono}
                  </p>
                  <p style={{ margin: '0.25rem 0', color: '#49627c' }}>
                    Email: {s.postulante?.correo}
                  </p>
                  <p style={{ margin: '0.5rem 0', color: '#49627c' }}>
                    <strong>Motivo:</strong> {s.motivoPostulacion}
                  </p>
                  {s.tiempoDisponible && (
                    <p style={{ margin: '0.25rem 0', color: '#49627c', fontSize: '0.9rem' }}>
                      <strong>Tiempo disponible:</strong> {s.tiempoDisponible.replace('_', ' ')}
                    </p>
                  )}
                  {s.tipoVivienda && (
                    <p style={{ margin: '0.25rem 0', color: '#49627c', fontSize: '0.9rem' }}>
                      <strong>Vivienda:</strong> {s.tipoVivienda.replace('_', ' ')}
                    </p>
                  )}
                </div>
                <span className={`estado-badge ${s.estadoSolicitud === 'pendiente' ? 'estado-badge-pendiente' : s.estadoSolicitud === 'aprobada' ? 'estado-badge-publicado' : 'estado-badge-borrador'}`}>
                  {s.estadoSolicitud}
                </span>
              </div>

              {s.estadoSolicitud === 'pendiente' && (
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                  <button
                    onClick={() => handleResponder(s._id, 'aprobada')}
                    className="login-button"
                    style={{ background: '#28a745' }}
                  >
                    ✅ Aprobar
                  </button>
                  <button
                    onClick={() => handleResponder(s._id, 'rechazada')}
                    className="login-button"
                    style={{ background: '#dc3545' }}
                  >
                    ❌ Rechazar
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SolicitudesRecibidasPage;