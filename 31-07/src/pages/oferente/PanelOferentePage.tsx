import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { mascotaApi } from '../../api/mascotaApi';
import { solicitudApi } from '../../api/solicitudApi';
import type { Mascota } from '../../types/mascota';
import type { SolicitudAdopcion } from '../../api/solicitudApi';
import toast from 'react-hot-toast';

import { 
  FaPlus, 
  FaPaw, 
  FaEnvelope, 
  FaPhone, 
  FaUser, 
  FaCheck, 
  FaTimes,
  FaEdit,
  FaEye,
  FaClock,
  FaHome,
  FaDog,
  FaMapMarkerAlt,
  FaClipboardList,
  FaBell,
  FaFileAlt,
  FaHeart
} from 'react-icons/fa';

function PanelOferentePage() {
  const [mascotas, setMascotas] = useState<Mascota[]>([]);
  const [solicitudes, setSolicitudes] = useState<SolicitudAdopcion[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'mascotas' | 'solicitudes'>('mascotas');

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [mascotasRes, solicitudesRes] = await Promise.all([
          mascotaApi.misMascotas(),
          solicitudApi.recibidas(),
        ]);
        setMascotas(mascotasRes.data);
        setSolicitudes(solicitudesRes.data);
      } catch (error) {
        toast.error('Error al cargar datos');
      } finally {
        setLoading(false);
      }
    };
    cargarDatos();
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
    return (
      <div style={{ padding: '3rem', textAlign: 'center' }}>
        <FaPaw style={{ fontSize: '2.5rem', color: '#3B82F6', animation: 'spin 1s linear infinite' }} />
        <p style={{ marginTop: '1rem', color: '#64748B' }}>Cargando...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  const solicitudesPendientes = solicitudes.filter(s => s.estadoSolicitud === 'pendiente');
  const adopcionesRealizadas = mascotas.filter(m => m.estadoAdopcion === 'adoptado').length;

  // Cantidad de solicitudes por mascota (para el badge "X solicitudes")
  const solicitudesPorMascota = (mascotaId: string) =>
    solicitudes.filter(s => s.mascota?._id === mascotaId).length;

  // Función para obtener el color del estado
  const getEstadoColor = (estado: string) => {
    const colores: Record<string, { bg: string; text: string; dot: string }> = {
      borrador: { bg: '#F1F5F9', text: '#64748B', dot: '#94A3B8' },
      pendiente: { bg: '#FEF3C7', text: '#92400E', dot: '#F59E0B' },
      publicado: { bg: '#DBEAFE', text: '#1E40AF', dot: '#3B82F6' },
      disponible: { bg: '#D1FAE5', text: '#065F46', dot: '#22C55E' },
      adoptado: { bg: '#FCE4EC', text: '#B71C1C', dot: '#EF4444' },
      cancelado: { bg: '#FEE2E2', text: '#991B1B', dot: '#DC2626' },
    };
    return colores[estado] || colores.borrador;
  };

  // Función para obtener el color del estado de solicitud
  const getSolicitudColor = (estado: string) => {
    const colores: Record<string, { bg: string; text: string; border: string }> = {
      pendiente: { bg: '#FEF3C7', text: '#92400E', border: '#F59E0B' },
      aprobada: { bg: '#D1FAE5', text: '#065F46', border: '#22C55E' },
      rechazada: { bg: '#FEE2E2', text: '#991B1B', border: '#EF4444' },
    };
    return colores[estado] || colores.pendiente;
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
      {/* Card contenedor tipo "Dashboard" */}
      <div style={{
        background: 'white',
        borderRadius: '20px',
        border: '1px solid #E2E8F0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        padding: '1.75rem',
        marginBottom: '2rem'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <h1 style={{ margin: 0, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '1.5rem' }}>
              <FaClipboardList style={{ color: '#3B82F6' }} />
              Dashboard
            </h1>
            <p style={{ margin: '0.25rem 0 0', color: '#94A3B8', fontSize: '0.9rem' }}>
              Gestiona tus mascotas y solicitudes de adopción
            </p>
          </div>
          <Link 
            to="/mascotas/nueva" 
            style={{ 
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.6rem 1.5rem',
              background: '#f00a0a',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '0.9rem',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#2563EB'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#3B82F6'; }}
          >
            <FaPlus size={13} />
            Publicar mascota
          </Link>
        </div>

        {/* Stat cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', 
          gap: '1rem' 
        }}>
          <div style={{ 
            background: '#EFF6FF', 
            borderRadius: '16px', 
            padding: '1.1rem 1.25rem' 
          }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#2563EB' }}>{mascotas.length}</div>
            <div style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '0.15rem' }}>Mascotas publicadas</div>
          </div>
          <div style={{ 
            background: '#FFF7ED', 
            borderRadius: '16px', 
            padding: '1.1rem 1.25rem' 
          }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#EA580C' }}>{solicitudes.length}</div>
            <div style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '0.15rem' }}>Solicitudes recibidas</div>
          </div>
          <div style={{ 
            background: '#F0FDF4', 
            borderRadius: '16px', 
            padding: '1.1rem 1.25rem' 
          }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#16A34A' }}>{adopcionesRealizadas}</div>
            <div style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '0.15rem' }}>Adopciones realizadas</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ 
        display: 'flex', 
        gap: '0.5rem', 
        marginBottom: '1.5rem', 
        borderBottom: '2px solid #E2E8F0',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={() => setTab('mascotas')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.7rem 1.5rem',
            border: 'none',
            background: tab === 'mascotas' ? '#3B82F6' : 'transparent',
            color: tab === 'mascotas' ? 'white' : '#64748B',
            borderRadius: '10px 10px 0 0',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '0.95rem',
            transition: 'all 0.2s',
          }}
        >
          <FaDog />
          Mis mascotas ({mascotas.length})
        </button>
        <button
          onClick={() => setTab('solicitudes')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.7rem 1.5rem',
            border: 'none',
            background: tab === 'solicitudes' ? '#3B82F6' : 'transparent',
            color: tab === 'solicitudes' ? 'white' : '#64748B',
            borderRadius: '10px 10px 0 0',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '0.95rem',
            transition: 'all 0.2s',
          }}
        >
          <FaEnvelope />
          Solicitudes recibidas 
          {solicitudesPendientes.length > 0 && (
            <span style={{
              background: '#EF4444',
              color: 'white',
              borderRadius: '50%',
              padding: '0.1rem 0.5rem',
              fontSize: '0.7rem',
              fontWeight: 'bold',
              marginLeft: '0.2rem'
            }}>
              {solicitudesPendientes.length}
            </span>
          )}
        </button>
      </div>

      {/* Tab: Mis Mascotas — estilo lista igual a la imagen */}
      {tab === 'mascotas' && (
        <div style={{
          background: 'white',
          borderRadius: '20px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          padding: '1.5rem'
        }}>
          <h3 style={{ margin: '0 0 1rem', color: '#0F172A', fontSize: '1.05rem' }}>
            Mis mascotas publicadas
          </h3>

          {mascotas.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '4rem 2rem', 
              background: '#F8FAFC', 
              borderRadius: '16px',
              border: '2px dashed #E2E8F0'
            }}>
              <FaPaw style={{ fontSize: '3.5rem', color: '#CBD5E1' }} />
              <h3 style={{ color: '#0F172A', margin: '1rem 0 0.5rem' }}>Aún no has publicado mascotas</h3>
              <p style={{ color: '#64748B', maxWidth: '400px', margin: '0 auto' }}>
                Comienza publicando tu primera mascota en adopción.
              </p>
              <Link 
                to="/mascotas/nueva" 
                style={{ 
                  display: 'inline-block', 
                  marginTop: '1.5rem',
                  padding: '0.6rem 2rem',
                  background: '#fc0202',
                  color: 'white',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  fontWeight: '600'
                }}
              >
                <FaPlus style={{ marginRight: '0.5rem' }} />
                Publicar mascota
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {mascotas.map((m) => {
                const estadoColor = getEstadoColor(m.estadoAdopcion);
                const numSolicitudes = solicitudesPorMascota(m._id);
                return (
                  <div 
                    key={m._id} 
                    style={{ 
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      border: '1px solid #E2E8F0', 
                      borderRadius: '14px', 
                      padding: '0.75rem 1rem', 
                      background: 'white',
                      flexWrap: 'wrap'
                    }}
                  >
                    <img
                      src={m.fotoPrincipal || '/placeholder-dog.jpg'}
                      alt={m.nombre}
                      style={{ 
                        width: '56px', 
                        height: '56px', 
                        objectFit: 'cover', 
                        borderRadius: '50%',
                        flexShrink: 0
                      }}
                      onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder-dog.jpg'; }}
                    />

                    <div style={{ flex: 1, minWidth: '140px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <h4 style={{ margin: 0, color: '#0F172A', fontSize: '1rem' }}>{m.nombre}</h4>
                        <span style={{
                          background: estadoColor.bg,
                          color: estadoColor.text,
                          padding: '0.1rem 0.6rem',
                          borderRadius: '20px',
                          fontSize: '0.65rem',
                          fontWeight: '600',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.3rem'
                        }}>
                          <span style={{
                            display: 'inline-block',
                            width: '5px',
                            height: '5px',
                            borderRadius: '50%',
                            background: estadoColor.dot
                          }} />
                          {m.estadoAdopcion}
                        </span>
                      </div>
                      <p style={{ margin: '0.2rem 0 0', color: '#94A3B8', fontSize: '0.85rem' }}>
                        {m.edadAproxMeses} meses
                        {m.ubicacion && (
                          <>
                            {' · '}
                            <FaMapMarkerAlt style={{ display: 'inline', fontSize: '0.7rem' }} /> {m.ubicacion}
                          </>
                        )}
                      </p>
                    </div>

                    <span style={{
                      background: '#F1F5F9',
                      color: '#475569',
                      padding: '0.35rem 0.8rem',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: '500',
                      whiteSpace: 'nowrap'
                    }}>
                      {numSolicitudes} solicitud{numSolicitudes === 1 ? '' : 'es'}
                    </span>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <Link 
                        to={`/oferente/mascota/${m._id}`} 
                        style={{ 
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          padding: '0.45rem 1rem',
                          background: '#EFF6FF', 
                          color: '#2563EB',
                          borderRadius: '10px',
                          textDecoration: 'none',
                          fontSize: '0.85rem',
                          fontWeight: '600',
                          whiteSpace: 'nowrap',
                          transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = '#DBEAFE'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = '#EFF6FF'; }}
                      >
                        <FaEye size={13} /> Ver detalles
                      </Link>
                      <Link 
                        to={`/mascotas/editar/${m._id}`} 
                        title="Editar"
                        style={{ 
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '0.45rem 0.7rem',
                          background: '#F1F5F9', 
                          color: '#334155',
                          borderRadius: '10px',
                          textDecoration: 'none',
                          fontSize: '0.85rem',
                          transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = '#E2E8F0'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = '#F1F5F9'; }}
                      >
                        <FaEdit size={13} />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab: Solicitudes Recibidas */}
      {tab === 'solicitudes' && (
        <div>
          {solicitudes.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '4rem 2rem', 
              background: 'white', 
              borderRadius: '16px',
              border: '2px dashed #E2E8F0'
            }}>
              <FaBell style={{ fontSize: '3.5rem', color: '#CBD5E1' }} />
              <h3 style={{ color: '#0F172A', margin: '1rem 0 0.5rem' }}>No tienes solicitudes</h3>
              <p style={{ color: '#64748B' }}>Cuando alguien quiera adoptar una de tus mascotas, lo verás aquí.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {solicitudes.map((s) => {
                const solicitudColor = getSolicitudColor(s.estadoSolicitud);
                return (
                  <div key={s._id} style={{ 
                    border: '1px solid #E2E8F0', 
                    borderRadius: '16px', 
                    padding: '1.5rem', 
                    background: 'white', 
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    borderLeft: `4px solid ${solicitudColor.border}`
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                          <h3 style={{ margin: 0, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <FaDog style={{ color: '#3B82F6' }} />
                            {s.mascota?.nombre || 'Mascota'}
                          </h3>
                          <span style={{
                            background: solicitudColor.bg,
                            color: solicitudColor.text,
                            padding: '0.2rem 0.7rem',
                            borderRadius: '20px',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.3rem'
                          }}>
                            {s.estadoSolicitud === 'pendiente' && <FaClock size={12} />}
                            {s.estadoSolicitud === 'aprobada' && <FaCheck size={12} />}
                            {s.estadoSolicitud === 'rechazada' && <FaTimes size={12} />}
                            {s.estadoSolicitud}
                          </span>
                        </div>
                        
                        <div style={{ marginTop: '0.5rem' }}>
                          <p style={{ margin: '0.25rem 0', color: '#64748B', fontSize: '0.9rem' }}>
                            <FaUser style={{ display: 'inline', marginRight: '0.3rem', fontSize: '0.8rem' }} />
                            Solicitante: {s.postulante?.nombres} {s.postulante?.apellidos}
                          </p>
                          <p style={{ margin: '0.25rem 0', color: '#64748B', fontSize: '0.9rem' }}>
                            <FaPhone style={{ display: 'inline', marginRight: '0.3rem', fontSize: '0.8rem' }} />
                            Teléfono: {s.postulante?.telefono || 'No especificado'}
                          </p>
                          <p style={{ margin: '0.25rem 0', color: '#64748B', fontSize: '0.9rem' }}>
                            <FaEnvelope style={{ display: 'inline', marginRight: '0.3rem', fontSize: '0.8rem' }} />
                            Email: {s.postulante?.correo || 'No especificado'}
                          </p>
                          
                          <div style={{ 
                            marginTop: '0.75rem', 
                            padding: '0.75rem', 
                            background: '#F8FAFC', 
                            borderRadius: '8px' 
                          }}>
                            <p style={{ margin: 0, color: '#0F172A', fontSize: '0.9rem' }}>
                              <FaFileAlt style={{ display: 'inline', marginRight: '0.3rem', fontSize: '0.8rem' }} />
                              <strong>Motivo:</strong> {s.motivoPostulacion || 'No especificado'}
                            </p>
                          </div>
                          
                          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                            {s.tiempoDisponible && (
                              <p style={{ margin: 0, color: '#64748B', fontSize: '0.85rem' }}>
                                <FaClock style={{ display: 'inline', marginRight: '0.3rem', fontSize: '0.65rem' }} />
                                <strong>Tiempo disponible:</strong> {s.tiempoDisponible.replace('_', ' ')}
                              </p>
                            )}
                            {s.tipoVivienda && (
                              <p style={{ margin: 0, color: '#64748B', fontSize: '0.85rem' }}>
                                <FaHome style={{ display: 'inline', marginRight: '0.3rem', fontSize: '0.65rem' }} />
                                <strong>Vivienda:</strong> {s.tipoVivienda.replace('_', ' ')}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {s.estadoSolicitud === 'pendiente' && (
                      <div style={{ 
                        display: 'flex', 
                        gap: '0.5rem', 
                        marginTop: '1rem', 
                        borderTop: '1px solid #E2E8F0', 
                        paddingTop: '1rem' 
                      }}>
                        <button
                          onClick={() => handleResponder(s._id, 'aprobada')}
                          style={{ 
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.5rem 1.2rem',
                            background: '#22C55E',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            fontWeight: '500',
                            transition: 'background 0.2s'
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = '#16A34A'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = '#22C55E'; }}
                        >
                          <FaCheck /> Aprobar
                        </button>
                        <button
                          onClick={() => handleResponder(s._id, 'rechazada')}
                          style={{ 
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.5rem 1.2rem',
                            background: '#EF4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            fontWeight: '500',
                            transition: 'background 0.2s'
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = '#DC2626'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = '#EF4444'; }}
                        >
                          <FaTimes /> Rechazar
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default PanelOferentePage;