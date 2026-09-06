// src/pages/MascotaDetallePage.tsx
import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { mascotaApi } from '../api/mascotaApi';
import type { Mascota } from '../types/mascota';
import toast from 'react-hot-toast';
import { FaArrowLeft, FaPaw, FaHeart, FaEdit, FaTrash, FaUser, FaTimes } from 'react-icons/fa';

function MascotaDetallePage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mascota, setMascota] = useState<Mascota | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imagenAmpliada, setImagenAmpliada] = useState<string | null>(null);

  useEffect(() => {
    const cargarMascota = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const response = await mascotaApi.obtener(id);
        setMascota(response.data);
      } catch (err) {
        console.error('Error:', err);
        setError('Error al cargar la mascota');
      } finally {
        setLoading(false);
      }
    };
    cargarMascota();
  }, [id]);

  const goBack = () => navigate(-1);

  const formatearEdad = (meses: number) => {
    if (!meses) return 'No especificada';
    if (meses < 12) return `${meses} mes${meses > 1 ? 'es' : ''}`;
    const anos = Math.floor(meses / 12);
    const resto = meses % 12;
    if (resto === 0) return `${anos} año${anos > 1 ? 's' : ''}`;
    return `${anos} año${anos > 1 ? 's' : ''} y ${resto} mes${resto > 1 ? 'es' : ''}`;
  };

  if (loading) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: '#64748B' }}>
        Cargando...
      </div>
    );
  }

  if (error || !mascota) {
    return (
      <div style={{ maxWidth: '420px', margin: '2rem auto', textAlign: 'center' }}>
        <div className="card" style={{ padding: '2.5rem' }}>
          <FaPaw style={{ fontSize: '2.5rem', color: '#CBD5E1' }} />
          <h2 style={{ color: '#1E293B', margin: '1rem 0 0.5rem' }}>Mascota no encontrada</h2>
          <p style={{ color: '#64748B', marginBottom: '1.5rem' }}>La mascota no existe o fue eliminada.</p>
          <button onClick={goBack} className="btn btn-primary">
            <FaArrowLeft /> Volver al catálogo
          </button>
        </div>
      </div>
    );
  }

  const estaDisponible = mascota.estadoAdopcion === 'publicado' || mascota.estadoAdopcion === 'disponible';
  const esOferente = user?.id === mascota.oferente?._id;

  const handleSolicitarAdopcion = () => {
    if (!user) return navigate('/login');
    navigate(`/solicitudes/nueva/${mascota._id}`);
  };

  const atributos = [
    ['Edad', formatearEdad(mascota.edadAproxMeses)],
    ['Sexo', mascota.sexo === 'macho' ? 'Macho' : 'Hembra'],
    ['Tamaño', mascota.tamano === 'pequeno' ? 'Pequeño' : mascota.tamano === 'mediano' ? 'Mediano' : 'Grande'],
    ['Color', mascota.color || '—'],
    ['Ubicación', mascota.ubicacion || 'Sin ubicación'],
    ['Peso', mascota.pesoKg ? `${mascota.pesoKg} kg` : 'No especificado']
  ];

  const salud = [
    ['Vacunado', mascota.vacunado],
    ['Esterilizado', mascota.esterilizado],
    ['Desparasitado', mascota.desparasitado]
  ] as const;

  return (
    <div style={{ maxWidth: '900px', margin: '2rem auto', padding: '0 1rem' }}>
      <style>{`
        .btn { display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem;
          padding: 0.8rem; border-radius: 12px; font-weight: 600; font-size: 0.95rem;
          border: none; cursor: pointer; text-decoration: none; width: 100%; }
        .btn-primary { background: #10B981; color: #fff; }
        .btn-primary:hover { background: #059669; }
        .btn-secondary { background: #3B82F6; color: #fff; }
        .btn-secondary:hover { background: #2563EB; }
        .btn-danger { background: #EF4444; color: #fff; }
        .btn-danger:hover { background: #DC2626; }
        .card { background: #fff; border-radius: 20px; border: 1px solid #E2E8F0;
          box-shadow: 0 8px 24px rgba(0,0,0,0.06); }
        .chip { background: #F1F5F9; color: #475569; padding: 0.25rem 0.9rem;
          border-radius: 20px; font-size: 0.85rem; font-weight: 500; }
        .badge { padding: 0.2rem 0.8rem; border-radius: 20px; font-size: 0.75rem; font-weight: 500; }
        .badge-on { background: #D1FAE5; color: #065F46; }
        .badge-off { background: #FEE2E2; color: #991B1B; }
        .thumb { width: 72px; height: 72px; object-fit: cover; border-radius: 10px;
          cursor: pointer; border: 2px solid #E2E8F0; }
        .detalle-grid { display: grid; grid-template-columns: 1fr 1fr; }
        .atributos-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem 1.5rem; }
        @media (max-width: 680px) {
          .detalle-grid { grid-template-columns: 1fr; }
          .atributos-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <button onClick={goBack} className="btn" style={{ width: 'auto', background: 'none', color: '#3B82F6', marginBottom: '1.25rem', padding: '0.5rem 0' }}>
        <FaArrowLeft /> Volver atrás
      </button>

      <div className="card" style={{ overflow: 'hidden' }}>
        <div className="detalle-grid">
          {/* Columna izquierda: imagen + acciones */}
          <div style={{ background: '#F8FAFC', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <img
              src={mascota.fotoPrincipal || '/placeholder-dog.jpg'}
              alt={mascota.nombre}
              onClick={() => setImagenAmpliada(mascota.fotoPrincipal || '/placeholder-dog.jpg')}
              onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder-dog.jpg'; }}
              style={{ width: '100%', height: '320px', objectFit: 'cover', borderRadius: '16px', cursor: 'zoom-in' }}
            />

            <div className={`badge ${estaDisponible ? 'badge-on' : 'badge-off'}`} style={{ textAlign: 'center', padding: '0.5rem' }}>
              {estaDisponible ? 'Disponible para adopción' : 'No disponible'}
            </div>

            {estaDisponible && !esOferente && user && (
              <button onClick={handleSolicitarAdopcion} className="btn btn-primary">
                <FaHeart /> Solicitar adopción
              </button>
            )}

            {estaDisponible && !user && (
              <Link to="/login" className="btn btn-secondary">
                <FaUser /> Inicia sesión para adoptar
              </Link>
            )}

            {esOferente && (
              <div style={{ display: 'flex', gap: '0.6rem' }}>
                <Link to={`/mascotas/editar/${mascota._id}`} className="btn btn-secondary">
                  <FaEdit /> Editar
                </Link>
                <button
                  className="btn btn-danger"
                  onClick={async () => {
                    if (confirm('¿Eliminar esta publicación?')) {
                      try {
                        await mascotaApi.eliminar(mascota._id);
                        toast.success('Mascota eliminada');
                        navigate('/mascotas');
                      } catch {
                        toast.error('Error al eliminar');
                      }
                    }
                  }}
                >
                  <FaTrash /> Eliminar
                </button>
              </div>
            )}
          </div>

          {/* Columna derecha: información */}
          <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <h1 style={{ margin: 0, color: '#0F172A', fontSize: '2rem', fontWeight: 700 }}>{mascota.nombre}</h1>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span className="chip">{mascota.tipoMascota?.nombreTipo || 'Perro'}</span>
              <span className="chip">{mascota.raza?.nombreRaza || 'Mestizo'}</span>
            </div>

            <div className="atributos-grid">
              {atributos.map(([label, valor]) => (
                <span key={label} style={{ color: '#475569', fontSize: '0.9rem' }}>
                  <strong>{label}:</strong> {valor}
                </span>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {salud.map(([label, activo]) => (
                <span key={label} className={`badge ${activo ? 'badge-on' : 'badge-off'}`}>{label}</span>
              ))}
            </div>

            <div style={{ background: '#F8FAFC', padding: '0.75rem 1rem', borderRadius: '12px' }}>
              <strong style={{ color: '#0F172A', fontSize: '0.9rem' }}>Descripción</strong>
              <p style={{ margin: '0.2rem 0 0', color: '#475569', fontSize: '0.9rem', lineHeight: 1.5 }}>
                {mascota.descripcionAdicional || `${mascota.nombre} es una mascota cariñosa en busca de un hogar responsable.`}
              </p>
            </div>

            {mascota.comportamiento && (
              <p style={{ margin: 0, color: '#475569', fontSize: '0.85rem' }}>
                <strong>Comportamiento:</strong> {mascota.comportamiento}
              </p>
            )}

            {mascota.requisitos && (
              <p style={{ margin: 0, color: '#475569', fontSize: '0.85rem' }}>
                <strong>Requisitos:</strong> {mascota.requisitos}
              </p>
            )}

            {/* Más fotos, justo debajo de requisitos */}
            {mascota.fotografias && mascota.fotografias.length > 0 && (
              <div>
                <strong style={{ color: '#0F172A', fontSize: '0.85rem', display: 'block', marginBottom: '0.5rem' }}>
                  Más fotos
                </strong>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {mascota.fotografias.map((foto, i) => (
                    <img
                      key={i}
                      src={foto}
                      alt={`${mascota.nombre} ${i + 1}`}
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
          <img
            src={imagenAmpliada}
            alt="Vista ampliada"
            style={{ maxWidth: '100%', maxHeight: '90vh', borderRadius: '12px' }}
          />
        </div>
      )}
    </div>
  );
}

export default MascotaDetallePage;