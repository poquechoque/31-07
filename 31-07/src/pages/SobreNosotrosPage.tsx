import { Link } from 'react-router-dom';

function SobreNosotrosPage() {
  const valores = [
    {
      titulo: "Bienestar Animal",
      descripcion: "Priorizamos la salud y felicidad de cada mascota, asegurando que encuentre un hogar donde sea amada y respetada.",
      icono: "❤️"
    },
    {
      titulo: "Adopción Responsable",
      descripcion: "Promovemos la tenencia responsable, educando y guiando a los adoptantes para que cada adopción sea un éxito.",
      icono: "🏠"
    },
    {
      titulo: "Compromiso Comunitario",
      descripcion: "Trabajamos junto a rescatistas, organizaciones y la comunidad para reducir el abandono animal en Sucre.",
      icono: "🤝"
    },
    {
      titulo: "Transparencia",
      descripcion: "Cada proceso de adopción es claro y documentado, garantizando confianza entre oferentes y adoptantes.",
      icono: "🔍"
    }
  ];

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '3rem 1.5rem' }}>
      {/* Sección Hero */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <p className="eyebrow" style={{ textAlign: 'center' }}>Nuestra historia</p>
        <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', margin: '0.5rem 0', color: '#0b1f3a' }}>
          Sobre nosotros
        </h1>
        <p style={{ color: '#49627c', fontSize: '1.1rem', maxWidth: '650px', margin: '0 auto' }}>
          Somos un equipo comprometido con el bienestar animal y la adopción responsable en Sucre.
        </p>
      </div>

      {/* Misión y Visión */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
        <div style={{ padding: '2rem', background: 'white', borderRadius: '16px', border: '1px solid #e2eaf3' }}>
          <span style={{ fontSize: '2rem' }}>🎯</span>
          <h2 style={{ color: '#0b1f3a', margin: '0.5rem 0' }}>Misión</h2>
          <p style={{ color: '#49627c', lineHeight: '1.6' }}>
            Conectar mascotas en situación de abandono con familias responsables en Sucre, 
            facilitando un proceso de adopción transparente, seguro y efectivo a través de nuestra 
            plataforma tecnológica.
          </p>
        </div>
        <div style={{ padding: '2rem', background: 'white', borderRadius: '16px', border: '1px solid #e2eaf3' }}>
          <span style={{ fontSize: '2rem' }}>👁️</span>
          <h2 style={{ color: '#0b1f3a', margin: '0.5rem 0' }}>Visión</h2>
          <p style={{ color: '#49627c', lineHeight: '1.6' }}>
            Ser la plataforma líder en adopción de mascotas en Bolivia, promoviendo una cultura 
            de tenencia responsable y reduciendo significativamente el abandono animal en nuestra región.
          </p>
        </div>
      </div>

      {/* Valores */}
      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ textAlign: 'center', color: '#0b1f3a', marginBottom: '2rem' }}>Nuestros valores</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
          {valores.map((valor) => (
            <div
              key={valor.titulo}
              style={{
                padding: '1.5rem',
                background: '#f8fbff',
                borderRadius: '12px',
                border: '1px solid #e2eaf3',
                textAlign: 'center',
              }}
            >
              <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.5rem' }}>
                {valor.icono}
              </span>
              <h3 style={{ margin: '0.5rem 0', color: '#0b1f3a' }}>{valor.titulo}</h3>
              <p style={{ color: '#49627c', fontSize: '0.95rem', lineHeight: '1.5', margin: 0 }}>
                {valor.descripcion}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Proyecto */}
      <div style={{ padding: '2.5rem', background: '#0b1f3a', borderRadius: '16px', color: 'white', textAlign: 'center' }}>
        <h2 style={{ margin: '0 0 1rem' }}>Proyecto educativo</h2>
        <p style={{ color: '#8aa4c0', maxWidth: '600px', margin: '0 auto 1rem', lineHeight: '1.6' }}>
          Este sistema es desarrollado como proyecto de grado por estudiantes de la 
          Unidad Educativa Técnico Humanístico Don Bosco, como parte de su formación 
          en Sistemas Informáticos.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', marginTop: '1rem' }}>
          <div>
            <p style={{ margin: 0, fontWeight: 'bold', color: 'white' }}>Florencia Poquechoque</p>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#8aa4c0' }}>Desarrolladora</p>
          </div>
          <div>
            <p style={{ margin: 0, fontWeight: 'bold', color: 'white' }}>Adrián Núñez</p>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#8aa4c0' }}>Desarrollador</p>
          </div>
        </div>
        <div style={{ marginTop: '1.5rem' }}>
          <Link to="/mascotas" className="hero-button" style={{ display: 'inline-block' }}>
            Conoce a nuestras mascotas
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SobreNosotrosPage;