import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { solicitudApi } from '../../api/solicitudApi';
import type{ SolicitudAdopcion } from '../../api/solicitudApi';
import toast from 'react-hot-toast';

import { 
  FaPaw, 
  FaClock, 
  FaCheck, 
  FaTimes, 
  FaCalendarAlt, 
  FaFileAlt,
  FaTrash,
  FaEnvelope,
  FaUser,
  FaDog,
  FaHome,
  FaInfoCircle
} from 'react-icons/fa';

function MisSolicitudesPage() {
  const [solicitudes, setSolicitudes] = useState<SolicitudAdopcion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarSolicitudes = async () => {
      try {
        const res = await solicitudApi.misSolicitudes();
        setSolicitudes(res.data);
      } catch (error) {
        toast.error('Error al cargar solicitudes');
      } finally {
        setLoading(false);
      }
    };
    cargarSolicitudes();
  }, []);

  const handleCancelar = async (id: string) => {
    if (!confirm('¿Cancelar esta solicitud?')) return;
    try {
      await solicitudApi.cancelar(id);
      toast.success('Solicitud cancelada');
      const res = await solicitudApi.misSolicitudes();
      setSolicitudes(res.data);
    } catch (error) {
      toast.error('Error al cancelar');
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <FaPaw style={{ fontSize: '2rem', color: '#3B82F6', animation: 'spin 1s linear infinite' }} />
        <p style={{ marginTop: '1rem', color: '#64748B' }}>Cargando solicitudes...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
        <FaClipboardList style={{ fontSize: '2rem', color: '#3B82F6' }} />
        <h1 style={{ margin: 0, color: '#1E293B' }}>Mis Solicitudes de Adopción</h1>
      </div>

      {solicitudes.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '3rem', 
          background: 'white', 
          borderRadius: '16px',
          border: '2px dashed #E2E8F0'
        }}>
          <FaFileAlt style={{ fontSize: '3rem', color: '#CBD5E1' }} />
          <h3 style={{ color: '#1E293B', margin: '1rem 0 0.5rem' }}>No has realizado ninguna solicitud</h3>
          <p style={{ color: '#64748B' }}>Explora el catálogo y encuentra a tu nueva mascota.</p>
          <Link to="/mascotas" className="hero-button" style={{ display: 'inline-block', marginTop: '1rem', background: '#3B82F6' }}>
            <FaSearch style={{ marginRight: '0.5rem' }} />
            Ver mascotas disponibles
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {solicitudes.map((s) => (
            <div key={s._id} style={{ 
              border: '1px solid #E2E8F0', 
              borderRadius: '16px', 
              padding: '1.5rem', 
              background: 'white', 
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              borderLeft: s.estadoSolicitud === 'pendiente' ? '4px solid #F59E0B' : 
                         s.estadoSolicitud === 'aprobada' ? '4px solid #22C55E' : 
                         s.estadoSolicitud === 'cancelada' ? '4px solid #94A3B8' :
                         '4px solid #EF4444'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <Link to={`/mascotas/${s.mascota._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <h3 style={{ margin: 0, color: '#1E293B', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <FaDog style={{ color: '#3B82F6' }} />
                        {s.mascota?.nombre || 'Mascota'}
                      </h3>
                    </Link>
                    <span className={`estado-badge ${
                      s.estadoSolicitud === 'pendiente' ? 'estado-badge-pendiente' : 
                      s.estadoSolicitud === 'aprobada' ? 'estado-badge-publicado' : 
                      s.estadoSolicitud === 'cancelada' ? 'estado-badge-borrador' : 'estado-badge-borrador'
                    }`}>
                      {s.estadoSolicitud === 'pendiente' && <FaClock style={{ marginRight: '0.3rem', fontSize: '0.7rem' }} />}
                      {s.estadoSolicitud === 'aprobada' && <FaCheck style={{ marginRight: '0.3rem', fontSize: '0.7rem' }} />}
                      {s.estadoSolicitud === 'rechazada' && <FaTimes style={{ marginRight: '0.3rem', fontSize: '0.7rem' }} />}
                      {s.estadoSolicitud === 'cancelada' && <FaTimes style={{ marginRight: '0.3rem', fontSize: '0.7rem' }} />}
                      {s.estadoSolicitud === 'pendiente' ? 'Pendiente' : 
                       s.estadoSolicitud === 'aprobada' ? 'Aprobada' : 
                       s.estadoSolicitud === 'cancelada' ? 'Cancelada' : 'Rechazada'}
                    </span>
                  </div>
                  
                  <div style={{ marginTop: '0.5rem' }}>
                    <p style={{ margin: '0.25rem 0', color: '#64748B' }}>
                      <FaCalendarAlt style={{ display: 'inline', marginRight: '0.3rem', fontSize: '0.8rem' }} />
                      <strong>Fecha:</strong> {new Date(s.fechaSolicitud).toLocaleDateString('es-BO')}
                    </p>
                    <p style={{ margin: '0.25rem 0', color: '#1E293B' }}>
                      <FaFileAlt style={{ display: 'inline', marginRight: '0.3rem', fontSize: '0.8rem' }} />
                      <strong>Motivo:</strong> {s.motivoPostulacion}
                    </p>
                    {s.tiempoDisponible && (
                      <p style={{ margin: '0.25rem 0', color: '#64748B', fontSize: '0.9rem' }}>
                        <FaClock style={{ display: 'inline', marginRight: '0.3rem', fontSize: '0.7rem' }} />
                        <strong>Tiempo disponible:</strong> {s.tiempoDisponible.replace('_', ' ')}
                      </p>
                    )}
                    {s.tipoVivienda && (
                      <p style={{ margin: '0.25rem 0', color: '#64748B', fontSize: '0.9rem' }}>
                        <FaHome style={{ display: 'inline', marginRight: '0.3rem', fontSize: '0.7rem' }} />
                        <strong>Vivienda:</strong> {s.tipoVivienda.replace('_', ' ')}
                      </p>
                    )}
                    {s.fechaRespuesta && (
                      <p style={{ margin: '0.25rem 0', color: '#64748B', fontSize: '0.9rem' }}>
                        <FaCalendarAlt style={{ display: 'inline', marginRight: '0.3rem', fontSize: '0.7rem' }} />
                        <strong>Respuesta:</strong> {new Date(s.fechaRespuesta).toLocaleDateString('es-BO')}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {s.estadoSolicitud === 'pendiente' && (
                <button
                  onClick={() => handleCancelar(s._id)}
                  className="login-button"
                  style={{ 
                    background: '#EF4444', 
                    marginTop: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <FaTrash /> Cancelar solicitud
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import { FaSearch, FaClipboardList } from 'react-icons/fa';

export default MisSolicitudesPage;