import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { mascotaApi } from '../api/mascotaApi';
import type { Mascota } from '../types/mascota';

function HomePage() {
  const [mascotasRecientes, setMascotasRecientes] = useState<Mascota[]>([]);
  const [totalDisponibles, setTotalDisponibles] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarMascotas = async () => {
      try {
        const res = await mascotaApi.listar();
        const disponibles = res.data.filter((m) => m.estadoAdopcion === 'disponible');

        // ordenadas por fecha de registro descendente
        const recientes = [...disponibles]
          .sort((a, b) => new Date(b.fechaRegistro).getTime() - new Date(a.fechaRegistro).getTime())
          .slice(0, 4);

        setMascotasRecientes(recientes);
        setTotalDisponibles(disponibles.length);
      } catch (error) {
        // Si falla, la página igual se muestra, solo sin datos dinámicos
        setMascotasRecientes([]);
      } finally {
        setLoading(false);
      }
    };
    cargarMascotas();
  }, []);

  const fotoHero = mascotasRecientes[0]?.fotoPrincipal;

  return (
    <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
      <style>{`
        .hp-hero {
          display: grid;
          grid-template-columns: 1.05fr 1fr;
          gap: 2.5rem;
          align-items: center;
          padding: 3rem 0 2rem;
        }
        .hp-btn-primary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.8rem 1.75rem;
          background: #2563EB;
          color: white;
          border: none;
          border-radius: 10px;
          text-decoration: none;
          font-weight: 600;
          font-size: 0.95rem;
          transition: background 0.2s;
        }
        .hp-btn-primary:hover { background: #1D4ED8; }
        .hp-btn-outline {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.8rem 1.75rem;
          background: white;
          color: #2563EB;
          border: 1.5px solid #2563EB;
          border-radius: 10px;
          text-decoration: none;
          font-weight: 600;
          font-size: 0.95rem;
          transition: background 0.2s;
        }
        .hp-btn-outline:hover { background: #EFF6FF; }
        .hp-stats {
          display: flex;
          gap: 3rem;
          flex-wrap: wrap;
          padding: 1.5rem 0 2.5rem;
          border-bottom: 1px solid #E2E8F0;
          margin-bottom: 2.5rem;
        }
        .hp-stat-num {
          margin: 0;
          font-size: 2rem;
          font-weight: 800;
          color: #0F172A;
        }
        .hp-stat-label {
          margin: 0.15rem 0 0;
          color: #64748B;
          font-size: 0.9rem;
        }
        .hp-recientes-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.25rem;
        }
        .hp-recientes-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.25rem;
          margin-bottom: 3rem;
        }
        .hp-mascota-card {
          text-decoration: none;
          display: block;
        }
        .hp-mascota-img {
          width: 100%;
          aspect-ratio: 1 / 1;
          object-fit: cover;
          border-radius: 18px;
          background: #F1F5F9;
          transition: transform 0.2s;
        }
        .hp-mascota-card:hover .hp-mascota-img { transform: scale(1.02); }
        .hp-mascota-nombre {
          margin: 0.5rem 0 0;
          font-size: 0.9rem;
          font-weight: 600;
          color: #0F172A;
        }
        @media (max-width: 860px) {
          .hp-hero { grid-template-columns: 1fr; padding-top: 2rem; }
          .hp-recientes-grid { grid-template-columns: repeat(2, 1fr); }
          .hp-stats { gap: 1.75rem; }
        }
      `}</style>

      {/* Hero */}
      <section className="hp-hero" aria-labelledby="hero-title">
        <div>
          <h1 id="hero-title" style={{ margin: 0, fontSize: '2.4rem', lineHeight: 1.15, color: '#0F172A', fontWeight: 800 }}>
            Encuentra un nuevo mejor amigo
          </h1>
          <p style={{ margin: '1rem 0 1.75rem', color: '#64748B', fontSize: '1.05rem' }}>
            Adopta con amor, cambia dos vidas.
          </p>
          <div style={{ display: 'flex', gap: '0.9rem', flexWrap: 'wrap' }}>
            <Link className="hp-btn-primary" to="/mascotas">
              Adoptar ahora
            </Link>
            <Link className="hp-btn-outline" to="/mascotas/nueva">
              Publicar mascota
            </Link>
          </div>
        </div>

        <div>
          <img
            src={fotoHero || '/placeholder-dog.jpg'}
            alt="Mascota en adopción"
            style={{
              width: '100%',
              height: '320px',
              objectFit: 'cover',
              borderRadius: '24px',
            }}
            onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder-dog.jpg'; }}
          />
        </div>
      </section>

      {/* Estadísticas */}
      <section className="hp-stats">
        <div>
          <p className="hp-stat-num">{loading ? '—' : totalDisponibles}</p>
          <p className="hp-stat-label">Mascotas disponibles</p>
        </div>
        {/*
          Estos dos valores no vienen de un endpoint público en el código actual.
          Los dejo fijos como referencia visual; si tienes (o agregas) un endpoint
          público de estadísticas, reemplázalos por datos reales igual que arriba.
        */}
        <div>
          <p className="hp-stat-num">85</p>
          <p className="hp-stat-label">Adopciones exitosas</p>
        </div>
        <div>
          <p className="hp-stat-num">300+</p>
          <p className="hp-stat-label">Usuarios registrados</p>
        </div>
      </section>

      {/* Mascotas recientes */}
      <section aria-labelledby="recientes-title">
        <div className="hp-recientes-header">
          <h2 id="recientes-title" style={{ margin: 0, fontSize: '1.3rem', color: '#0F172A' }}>
            Mascotas recientes
          </h2>
          <Link to="/mascotas" style={{ color: '#2563EB', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none' }}>
            Ver todas
          </Link>
        </div>

        {loading ? (
          <p style={{ color: '#94A3B8' }}>Cargando mascotas...</p>
        ) : mascotasRecientes.length === 0 ? (
          <p style={{ color: '#94A3B8' }}>Aún no hay mascotas disponibles.</p>
        ) : (
          <div className="hp-recientes-grid">
            {mascotasRecientes.map((m) => (
              <Link key={m._id} className="hp-mascota-card" to={`/mascotas/${m._id}`}>
                <img
                  src={m.fotoPrincipal || '/placeholder-dog.jpg'}
                  alt={m.nombre}
                  className="hp-mascota-img"
                  onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder-dog.jpg'; }}
                />
                <p className="hp-mascota-nombre">{m.nombre}</p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default HomePage;