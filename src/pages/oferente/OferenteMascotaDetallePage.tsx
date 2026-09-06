// src/pages/oferente/OferenteMascotaDetallePage.tsx
import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { mascotaApi } from '../../api/mascotaApi';
import { solicitudApi } from '../../api/solicitudApi';
import type { Mascota } from '../../types/mascota';
import type { SolicitudAdopcion } from '../../api/solicitudApi';
import toast from 'react-hot-toast';
import {
  FaArrowLeft,
  FaTrash,
  FaPaw,
  FaEnvelope,
  FaUser,
  FaPhone,
  FaClock,
  FaHome,
  FaFileAlt,
  FaCheck,
  FaTimes
} from 'react-icons/fa';

function OferenteMascotaDetallePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [mascota, setMascota] = useState<Mascota | null>(null);
  const [solicitudes, setSolicitudes] = useState<SolicitudAdopcion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cargandoSolicitudes, setCargandoSolicitudes] = useState(false);
  const [imagenAmpliada, setImagenAmpliada] = useState<string | null>(null);

  useEffect(() => {
    const cargarDatos = async () => {
      if (!id) {
        setError('No se especificó una mascota');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const mascotaRes = await mascotaApi.obtener(id);
        setMascota(mascotaRes.data);

        try {
          setCargandoSolicitudes(true);
          const solicitudesRes = await solicitudApi.obtenerPorMascota(id);
          setSolicitudes(solicitudesRes.data || []);
        } catch (err) {
          console.error('Error al cargar solicitudes:', err);
        } finally {
          setCargandoSolicitudes(false);
        }
      } catch (err) {
        console.error('Error:', err);
        setError('Error al cargar los datos de la mascota');
        toast.error('Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    };
    cargarDatos();
  }, [id]);

  const handleEliminar = async () => {
    if (!mascota) return;
    if (window.confirm(`¿Estás seguro de que deseas eliminar a ${mascota.nombre}?`)) {
      try {
        await mascotaApi.eliminar(mascota._id);
        toast.success('Mascota eliminada correctamente');
        navigate('/panel-oferente');
      } catch {
        toast.error('Error al eliminar la mascota');
      }
    }
  };

  const handleResponderSolicitud = async (solicitudId: string, accion: 'aprobada' | 'rechazada') => {
    try {
      await solicitudApi.responder(solicitudId, accion);
      toast.success(`Solicitud ${accion === 'aprobada' ? 'aprobada' : 'rechazada'}`);
      if (id) {
        const solicitudesRes = await solicitudApi.obtenerPorMascota(id);
        setSolicitudes(solicitudesRes.data || []);
      }
    } catch {
      toast.error('Error al responder la solicitud');
    }
  };

  const goBack = () => navigate('/panel-oferente');

  if (loading) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: '#64748B' }}>
        Cargando detalles...
      </div>
    );
  }

  if (error || !mascota) {
    return (
      <div style={{ maxWidth: '420px', margin: '2rem auto', textAlign: 'center' }}>
        <div className="card" style={{ padding: '2.5rem' }}>
          <FaPaw style={{ fontSize: '2.5rem', color: '#CBD5E1' }} />
          <h2 style={{ color: '#1E293B', margin: '1rem 0 0.5rem' }}>Mascota no encontrada</h2>
          <p style={{ color: '#64748B', marginBottom: '1.5rem' }}>
            La mascota que buscas no existe o ha sido eliminada.
          </p>
          <button onClick={goBack} className="btn btn-secondary">
            <FaArrowLeft /> Volver al panel
          </button>
        </div>
      </div>
    );
  }

  const estaDisponible = mascota.estadoAdopcion === 'publicado' || mascota.estadoAdopcion === 'disponible';
  const solicitudesPendientes = solicitudes.filter((s) => s.estadoSolicitud === 'pendiente');

  const datos = [
    ['Especie', mascota.tipoMascota?.nombreTipo || 'Sin especie'],
    ['Raza', mascota.raza?.nombreRaza || 'Sin raza'],
    ['Edad', `${mascota.edadAproxMeses} meses`],
    ['Sexo', mascota.sexo === 'macho' ? '♂ Macho' : '♀ Hembra'],
    ['Tamaño', mascota.tamano],
    ['Color', mascota.color],
    ['Ubicación', mascota.ubicacion || 'Sin ubicación'],
    ['Estado', mascota.estadoAdopcion]
  ];

  const salud = [
    ['Vacunado', mascota.vacunado],
    ['Esterilizado', mascota.esterilizado],
    ['Desparasitado', mascota.desparasitado]
  ] as const;

  const estadoBadgeClase = (estado: string) =>
    estado === 'pendiente' ? 'badge-pendiente' : estado === 'aprobada' ? 'badge-on' : 'badge-off';

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 1rem 2rem' }}>
      <style>{`
        .btn { display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem;
          padding: 0.7rem 1.2rem; border-radius: 10px; font-weight: 600; font-size: 0.9rem;
          border: none; cursor: pointer; text-decoration: none; }
        .btn-secondary { background: #3B82F6; color: #fff; }
        .btn-secondary:hover { background: #2563EB; }
        .btn-danger { background: #EF4444; color: #fff; }
        .btn-danger:hover { background: #DC2626; }
        .btn-approve { background: #22C55E; color: #fff; }
        .btn-approve:hover { background: #16A34A; }
        .card { background: #fff; border-radius: 16px; border: 1px solid #E2E8F0;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
        .badge { display: inline-flex; align-items: center; gap: 0.3rem; padding: 0.2rem 0.8rem;
          border-radius: 20px; font-size: 0.75rem; font-weight: 500; }
        .badge-on { background: #D1FAE5; color: #065F46; }
        .badge-off { background: #FEE2E2; color: #991B1B; }
        .badge-pendiente { background: #FEF3C7; color: #92400E; }
        .dato { padding: 0.75rem; background: #F8FAFC; border-radius: 8px; }
        .dato-label { margin: 0; font-size: 0.8rem; color: #64748B; }
        .dato-valor { margin: 0.25rem 0 0; font-weight: 500; color: #1E293B; }
        .thumb { width: 76px; height: 76px; object-fit: cover; border-radius: 8px;
          cursor: pointer; border: 2px solid #E2E8F0; }
        .detalle-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; padding: 2rem; }
        .datos-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
        @media (max-width: 680px) {
          .detalle-grid { grid-template-columns: 1fr; }
          .datos-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <button onClick={goBack} className="btn" style={{ background: 'none', color: '#3B82F6', padding: '0.5rem 0', marginTop: '1.5rem', marginBottom: '1rem' }}>
        <FaArrowLeft /> Volver al panel
      </button>

      {/* Header con nombre, estado y acción de eliminar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ margin: 0, color: '#1E293B', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            {mascota.nombre}
            <span className={`badge ${estaDisponible ? 'badge-on' : 'badge-off'}`}>
              {estaDisponible ? <FaCheck size={12} /> : <FaTimes size={12} />}
              {estaDisponible ? 'Disponible' : 'No disponible'}
            </span>
          </h1>
          <p style={{ margin: '0.25rem 0 0', color: '#64748B' }}>
            {mascota.raza?.nombreRaza || 'Sin raza'} · {mascota.edadAproxMeses} meses
          </p>
        </div>

        <button onClick={handleEliminar} className="btn btn-danger">
          <FaTrash /> Eliminar
        </button>
      </div>

      {/* Tarjeta única: imagen + galería + información */}
      <div className="card">
        <div className="detalle-grid">
          {/* Columna izquierda: imagen */}
          <div>
            <img
              src={mascota.fotoPrincipal || '/placeholder-dog.jpg'}
              alt={mascota.nombre}
              onClick={() => setImagenAmpliada(mascota.fotoPrincipal || '/placeholder-dog.jpg')}
              onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder-dog.jpg'; }}
              style={{ width: '100%', height: '320px', objectFit: 'cover', borderRadius: '12px', cursor: 'zoom-in' }}
            />
          </div>

          {/* Columna derecha: información */}
          <div>
            <h3 style={{ color: '#1E293B', marginBottom: '0.5rem' }}>Descripción</h3>
            <p style={{ color: '#49627c', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              {mascota.descripcionAdicional || `${mascota.nombre} está buscando un hogar responsable.`}
            </p>

            <div className="datos-grid" style={{ marginBottom: '1.5rem' }}>
              {datos.map(([label, valor]) => (
                <div key={label} className="dato">
                  <p className="dato-label">{label}</p>
                  <p className="dato-valor">{valor}</p>
                </div>
              ))}
            </div>

            <h3 style={{ color: '#1E293B', marginBottom: '0.5rem' }}>Salud y cuidados</h3>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
              {salud.map(([label, activo]) => (
                <span key={label} className={`badge ${activo ? 'badge-on' : 'badge-off'}`}>
                  {activo ? <FaCheck size={12} /> : <FaTimes size={12} />}
                  {label}
                </span>
              ))}
            </div>

            {mascota.comportamiento && (
              <div className="dato" style={{ marginBottom: '1rem' }}>
                <p className="dato-label" style={{ fontWeight: 600, color: '#1E293B' }}>Comportamiento</p>
                <p className="dato-valor" style={{ fontWeight: 400 }}>{mascota.comportamiento}</p>
              </div>
            )}

            {mascota.requisitos && (
              <div className="dato" style={{ marginBottom: '1.5rem' }}>
                <p className="dato-label" style={{ fontWeight: 600, color: '#1E293B' }}>Requisitos</p>
                <p className="dato-valor" style={{ fontWeight: 400 }}>{mascota.requisitos}</p>
              </div>
            )}

            {/* Más fotos, debajo de requisitos */}
            {mascota.fotografias && mascota.fotografias.length > 0 && (
              <div style={{ marginBottom: '1.5rem' }}>
                <p style={{ color: '#1E293B', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.5rem' }}>Más fotos</p>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {mascota.fotografias.map((foto, index) => (
                    <img
                      key={index}
                      src={foto}
                      alt={`${mascota.nombre} ${index + 1}`}
                      className="thumb"
                      onClick={() => setImagenAmpliada(foto)}
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Solicitudes recibidas para esta mascota */}
      {solicitudes.length > 0 && (
        <div className="card" style={{ marginTop: '1.5rem', padding: '2rem' }}>
          <h3 style={{ color: '#1E293B', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FaFileAlt style={{ color: '#3B82F6' }} />
            Solicitudes de adopción para {mascota.nombre}
            <span style={{ fontSize: '0.85rem', fontWeight: 400, color: '#64748B' }}>({solicitudes.length})</span>
          </h3>

          {cargandoSolicitudes ? (
            <p style={{ color: '#64748B', textAlign: 'center' }}>Cargando solicitudes...</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {solicitudes.map((s) => (
                <div
                  key={s._id}
                  style={{
                    border: '1px solid #E2E8F0',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    background: '#FAFBFC',
                    borderLeft: `4px solid ${
                      s.estadoSolicitud === 'pendiente' ? '#F59E0B' : s.estadoSolicitud === 'aprobada' ? '#22C55E' : '#EF4444'
                    }`
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <h4 style={{ margin: 0, color: '#1E293B' }}>
                      <FaUser style={{ marginRight: '0.4rem', color: '#3B82F6' }} />
                      {s.postulante?.nombres} {s.postulante?.apellidos}
                    </h4>
                    <span className={`badge ${estadoBadgeClase(s.estadoSolicitud)}`}>{s.estadoSolicitud}</span>
                  </div>

                  <div style={{ marginTop: '0.5rem', color: '#64748B', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <span><FaPhone style={{ marginRight: '0.3rem' }} /> {s.postulante?.telefono || 'No especificado'}</span>
                    <span><FaEnvelope style={{ marginRight: '0.3rem' }} /> {s.postulante?.correo || 'No especificado'}</span>
                    <span style={{ color: '#1E293B' }}><strong>Motivo:</strong> {s.motivoPostulacion || 'No especificado'}</span>
                    {s.tiempoDisponible && (
                      <span><FaClock style={{ marginRight: '0.3rem' }} /> <strong>Tiempo disponible:</strong> {s.tiempoDisponible.replace('_', ' ')}</span>
                    )}
                    {s.tipoVivienda && (
                      <span><FaHome style={{ marginRight: '0.3rem' }} /> <strong>Vivienda:</strong> {s.tipoVivienda.replace('_', ' ')}</span>
                    )}
                  </div>

                  {s.estadoSolicitud === 'pendiente' && (
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', borderTop: '1px solid #E2E8F0', paddingTop: '1rem' }}>
                      <button onClick={() => handleResponderSolicitud(s._id, 'aprobada')} className="btn btn-approve">
                        <FaCheck /> Aprobar
                      </button>
                      <button onClick={() => handleResponderSolicitud(s._id, 'rechazada')} className="btn btn-danger">
                        <FaTimes /> Rechazar
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Lightbox: click en cualquier imagen para ampliarla */}
      {imagenAmpliada && (
        <div
          onClick={() => setImagenAmpliada(null)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.85)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '1.5rem', cursor: 'zoom-out', zIndex: 1000
          }}
        >
          <button
            onClick={() => setImagenAmpliada(null)}
            style={{
              position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'rgba(255,255,255,0.15)',
              border: 'none', color: '#fff', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer'
            }}
          >
            <FaTimes />
          </button>
          <img src={imagenAmpliada} alt="Vista ampliada" style={{ maxWidth: '100%', maxHeight: '90vh', borderRadius: '12px' }} />
        </div>
      )}
    </div>
  );
}

export default OferenteMascotaDetallePage;