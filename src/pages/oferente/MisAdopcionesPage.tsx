import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adopcionApi } from '../../api/adopcionApi';
import type { Adopcion } from '../../api/adopcionApi';
import toast from 'react-hot-toast';

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
  FaFileAlt,
  FaEnvelope,
  FaInfoCircle
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
        console.error('❌ Error:', error);
        toast.error('Error al cargar tus adopciones');
      } finally {
        setLoading(false);
      }
    };
    cargarAdopciones();
  }, []);

  const getEstadoColor = (estado: string) => {
    const colores: Record<string, { bg: string; text: string; border: string; label: string }> = {
      activa: { 
        bg: '#D1FAE5', 
        text: '#065F46', 
        border: '#22C55E',
        label: 'Activa'
      },
      finalizada: { 
        bg: '#DBEAFE', 
        text: '#1E40AF', 
        border: '#3B82F6',
        label: 'Finalizada'
      },
      cancelada: { 
        bg: '#FEE2E2', 
        text: '#991B1B', 
        border: '#EF4444',
        label: 'Cancelada'
      }
    };
    return colores[estado] || colores.activa;
  };

  const formatearFecha = (fecha: string) => {
    if (!fecha) return 'No especificada';
    try {
      return new Date(fecha).toLocaleDateString('es-BO', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return fecha;
    }
  };

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
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 1rem' }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.75rem', 
        marginBottom: '2rem' 
      }}>
        <FaHome style={{ fontSize: '2rem', color: '#3B82F6' }} />
        <h1 style={{ margin: 0, color: '#0F172A' }}>Mis Adopciones</h1>
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
          <FaHome style={{ fontSize: '3rem', color: '#CBD5E1' }} />
          <h3 style={{ color: '#0F172A', margin: '1rem 0 0.5rem' }}>No tienes adopciones registradas</h3>
          <p style={{ color: '#64748B' }}>Cuando una de tus mascotas sea adoptada, aparecerá aquí.</p>
          <Link 
            to="/mascotas/nueva" 
            style={{ 
              display: 'inline-block', 
              marginTop: '1.5rem',
              padding: '0.6rem 2rem',
              background: '#3B82F6',
              color: 'white',
              borderRadius: '10px',
              textDecoration: 'none',
              fontWeight: '600'
            }}
          >
            <FaPaw style={{ marginRight: '0.5rem' }} />
            Publicar mascota
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {adopciones.map((a) => {
            const estado = getEstadoColor(a.estado);
            return (
              <div key={a._id} style={{ 
                border: '1px solid #E2E8F0', 
                borderRadius: '16px', 
                padding: '1.5rem', 
                background: 'white', 
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                borderLeft: `4px solid ${estado.border}`,
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
              }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                      <h3 style={{ margin: 0, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <FaDog style={{ color: '#3B82F6' }} />
                        {a.solicitud?.mascota?.nombre || 'Mascota'}
                        <span style={{ fontSize: '0.9rem', fontWeight: 'normal', color: '#64748B' }}>
                          (Adoptada)
                        </span>
                      </h3>
                      <span style={{
                        background: estado.bg,
                        color: estado.text,
                        padding: '0.2rem 0.8rem',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem'
                      }}>
                        {a.estado === 'activa' && <FaCheck size={10} />}
                        {a.estado === 'finalizada' && <FaCheck size={10} />}
                        {a.estado === 'cancelada' && <FaTimes size={10} />}
                        {estado.label}
                      </span>
                    </div>
                    
                    <div style={{ marginTop: '0.5rem' }}>
                      <p style={{ margin: '0.25rem 0', color: '#64748B' }}>
                        <FaUser style={{ display: 'inline', marginRight: '0.3rem', fontSize: '0.8rem' }} />
                        <strong>Adoptante:</strong> {a.solicitante?.nombres} {a.solicitante?.apellidos}
                      </p>
                      <p style={{ margin: '0.25rem 0', color: '#64748B' }}>
                        <FaPhone style={{ display: 'inline', marginRight: '0.3rem', fontSize: '0.8rem' }} />
                        <strong>Teléfono:</strong> {a.solicitante?.telefono || 'No disponible'}
                      </p>
                      <p style={{ margin: '0.25rem 0', color: '#64748B' }}>
                        <FaEnvelope style={{ display: 'inline', marginRight: '0.3rem', fontSize: '0.8rem' }} />
                        <strong>Email:</strong> {a.solicitante?.correo || 'No disponible'}
                      </p>
                      <p style={{ margin: '0.25rem 0', color: '#64748B' }}>
                        <FaCalendarAlt style={{ display: 'inline', marginRight: '0.3rem', fontSize: '0.8rem' }} />
                        <strong>Fecha de adopción:</strong> {formatearFecha(a.fechaAdopcion)}
                      </p>
                      {a.observaciones && (
                        <p style={{ margin: '0.25rem 0', color: '#64748B' }}>
                          <FaInfoCircle style={{ display: 'inline', marginRight: '0.3rem', fontSize: '0.8rem' }} />
                          <strong>Observaciones:</strong> {a.observaciones}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Botón "Ver mascota" */}
                <div style={{ 
                  marginTop: '1rem', 
                  paddingTop: '1rem', 
                  borderTop: '1px solid #E2E8F0',
                  display: 'flex',
                  gap: '0.5rem',
                  flexWrap: 'wrap'
                }}>
                  <Link 
                    to={`/mascotas/${a.solicitud?.mascota?._id}`} 
                    style={{ 
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '0.5rem 1.5rem',
                      background: '#3B82F6',
                      color: 'white',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      fontSize: '0.9rem',
                      fontWeight: '500',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#2563EB'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = '#3B82F6'; }}
                  >
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