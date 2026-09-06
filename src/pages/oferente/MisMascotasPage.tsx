import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { mascotaApi } from '../../api/mascotaApi';
import type { Mascota } from '../../types/mascota';
import toast from 'react-hot-toast';

function MisMascotasPage() {
  const [mascotas, setMascotas] = useState<Mascota[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarMascotas = async () => {
      try {
        const res = await mascotaApi.misMascotas();
        setMascotas(res.data);
      } catch (error) {
        toast.error('Error al cargar tus mascotas');
      } finally {
        setLoading(false);
      }
    };
    cargarMascotas();
  }, []);

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Cargando...</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ margin: 0, color: '#0b1f3a' }}>Mis Mascotas</h1>
        <Link to="/mascotas/nueva" className="hero-button">
          + Publicar mascota
        </Link>
      </div>

      {mascotas.length === 0 ? (
        <p style={{ color: '#49627c' }}>Aún no has publicado mascotas.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {mascotas.map((m) => (
            <div key={m._id} style={{ border: '1px solid #e2eaf3', borderRadius: '16px', padding: '1rem', background: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <img
                src={m.fotoPrincipal || '/placeholder-dog.jpg'}
                alt={m.nombre}
                style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '12px' }}
                onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder-dog.jpg'; }}
              />
              <h3 style={{ margin: '0.5rem 0 0' }}>{m.nombre}</h3>
              <p style={{ color: '#49627c', margin: '0.25rem 0' }}>{m.raza?.nombreRaza || 'Sin raza'} · {m.edadAproxMeses} meses</p>
              <p>
                <strong>Estado:</strong>{' '}
                <span className={`estado-badge estado-badge-${m.estadoAdopcion}`}>
                  {m.estadoAdopcion}
                </span>
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                <Link to={`/mascotas/${m._id}`} className="login-button" style={{ flex: 1, textAlign: 'center', background: '#1672c4' }}>
                  Ver
                </Link>
                <Link to={`/mascotas/editar/${m._id}`} className="login-button" style={{ flex: 1, textAlign: 'center', background: '#0b1f3a' }}>
                  Editar
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MisMascotasPage;