import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Adopcion } from '../../api/adopcionApi';
import { adopcionApi } from '../../api/adopcionApi';
import toast from 'react-hot-toast';

// Importar iconos
import { 
  FaPaw, 
  FaHome, 
  FaHeart, 
  FaCalendarAlt, 
  FaUser, 
  FaPhone,
  FaCheck,
  FaTimes,
  FaDog,
  FaClipboardList,
  FaMapMarkerAlt,
  FaFileAlt
} from 'react-icons/fa';

function MisAdopcionesPage() {
  const [adopciones, setAdopciones] = useState<Adopcion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarAdopciones = async () => {
      try {
        const res = await adopcionApi.misAdopciones();
        setAdopciones(res.data);
      } catch (error) {
        toast.error('Error al cargar tus adopciones');
      } finally {
        setLoading(false);
      }
    };
    cargarAdopciones();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <FaPaw style={{ fontSize: '2rem', color: '#3B82F6', animation: 'spin 1s linear infinite' }} />
        <p style={{ marginTop: '1rem', color: '#64748B' }}>Cargando adopciones...</p>
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
        <FaHome style={{ fontSize: '2rem', color: '#3B82F6' }} />
        <h1 style={{ margin: 0, color: '#1E293B' }}>Mis Adopciones</h1>
        <span style={{ 
          marginLeft: 'auto', 
          background: '#EFF6FF', 
          color: '#3B82F6', 
          padding: '0.2rem 0.8rem', 
          borderRadius: '999px',
          fontSize: '0.85rem',
          fontWeight: 'bold'
        }}>
          {adopciones.length} {adopciones.length === 1 ? 'adopción' : 'adopciones'}
        </span>
      </div>

      {adopciones.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '3rem', 
          background: 'white', 
          borderRadius: '16px',
          border: '2px dashed #E2E8F0'
        }}>
          <FaHeart style={{ fontSize: '3rem', color: '#CBD5E1' }} />
          <h3 style={{ color: '#1E293B', margin: '1rem 0 0.5rem' }}>Aún no has adoptado ninguna mascota</h3>
          <p style={{ color: '#64748B' }}>Explora nuestro catálogo y encuentra a tu nuevo mejor amigo.</p>
          <Link to="/mascotas" className="hero-button" style={{ display: 'inline-block', marginTop: '1rem', background: '#3B82F6' }}>
            <FaPaw style={{ marginRight: '0.5rem' }} />
            Ver mascotas disponibles
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {adopciones.map((a) => {
            const estado = a.estado || 'activa';
            
            return (
              <div key={a._id} style={{ 
                border: '1px solid #E2E8F0', 
                borderRadius: '16px', 
                padding: '1.5rem', 
                background: 'white', 
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                borderLeft: estado === 'activa' ? '4px solid #22C55E' : 
                           estado === 'finalizada' ? '4px solid #3B82F6' : 
                           '4px solid #EF4444'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                      <h3 style={{ margin: 0, color: '#1E293B', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <FaDog style={{ color: '#3B82F6' }} />
                        {a.mascota?.nombre || 'Mascota'}
                        <span style={{ fontSize: '0.9rem', fontWeight: 'normal', color: '#64748B' }}>
                          (¡Adoptaste!)
                        </span>
                      </h3>
                      <span className={`estado-badge ${estado === 'activa' ? 'estado-badge-publicado' : estado === 'finalizada' ? 'estado-badge-adoptado' : 'estado-badge-borrador'}`}>
                        {estado === 'activa' && <FaCheck style={{ marginRight: '0.3rem', fontSize: '0.7rem' }} />}
                        {estado === 'finalizada' && <FaCheck style={{ marginRight: '0.3rem', fontSize: '0.7rem' }} />}
                        {estado === 'cancelada' && <FaTimes style={{ marginRight: '0.3rem', fontSize: '0.7rem' }} />}
                        {estado === 'activa' ? 'Activa' : 
                         estado === 'finalizada' ? 'Finalizada' : 'Cancelada'}
                      </span>
                    </div>
                    
                    <div style={{ marginTop: '0.5rem' }}>
                      <p style={{ margin: '0.25rem 0', color: '#64748B' }}>
                        <FaUser style={{ display: 'inline', marginRight: '0.3rem', fontSize: '0.8rem' }} />
                        <strong>Oferente:</strong> {a.oferente?.nombres} {a.oferente?.apellidos}
                      </p>
                      <p style={{ margin: '0.25rem 0', color: '#64748B' }}>
                        <FaPhone style={{ display: 'inline', marginRight: '0.3rem', fontSize: '0.8rem' }} />
                        <strong>Teléfono:</strong> {a.oferente?.telefono || 'No disponible'}
                      </p>
                      <p style={{ margin: '0.25rem 0', color: '#64748B' }}>
                        <FaCalendarAlt style={{ display: 'inline', marginRight: '0.3rem', fontSize: '0.8rem' }} />
                        <strong>Fecha de adopción:</strong> {new Date(a.fechaAdopcion).toLocaleDateString('es-BO')}
                      </p>
                      {/* ✅ ELIMINADO: condicionesAdopcion no existe en el modelo */}
                      {a.observaciones && (
                        <p style={{ margin: '0.25rem 0', color: '#64748B' }}>
                          <FaFileAlt style={{ display: 'inline', marginRight: '0.3rem', fontSize: '0.8rem' }} />
                          <strong>Observaciones:</strong> {a.observaciones}
                        </p>
                      )}
                    </div>
                  </div>
                  {/* ✅ ELIMINADO: compromisoFirmado no existe en el modelo */}
                </div>
                <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                  <Link to={`/mascotas/${a.solicitud?.mascota?._id}`} className="login-button" style={{ background: '#3B82F6', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <FaDog /> Ver mascota
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MisAdopcionesPage;