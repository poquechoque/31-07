import { Link } from 'react-router-dom';

function ComoAdoptarPage() {
  const pasos = [
    {
      numero: 1,
      titulo: "Explora el catálogo",
      descripcion: "Navega por nuestro catálogo de mascotas disponibles. Filtra por tipo, raza, edad o tamaño para encontrar a tu compañero ideal.",
      icono: "🔍"
    },
    {
      numero: 2,
      titulo: "Conoce a la mascota",
      descripcion: "Revisa la información detallada de cada mascota: su historia, comportamiento, estado de salud y requisitos especiales.",
      icono: "🐾"
    },
    {
      numero: 3,
      titulo: "Regístrate como solicitante",
      descripcion: "Crea tu cuenta como solicitante. Completa tu perfil con información sobre tu hogar, experiencia y disponibilidad.",
      icono: "📝"
    },
    {
      numero: 4,
      titulo: "Envía tu solicitud",
      descripcion: "Postula a la mascota que te ha conquistado. Cuéntanos por qué quieres adoptarla y cómo sería su nuevo hogar.",
      icono: "📨"
    },
    {
      numero: 5,
      titulo: "Espera la evaluación",
      descripcion: "El oferente revisará tu solicitud. Podría contactarte para una entrevista o visita domiciliaria para conocerte mejor.",
      icono: "⏳"
    },
    {
      numero: 6,
      titulo: "¡Adopción exitosa!",
      descripcion: "Si tu solicitud es aprobada, coordinarán la entrega de la mascota. ¡Firma el compromiso y dale la bienvenida a tu nuevo amigo!",
      icono: "🎉"
    }
  ];

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '3rem 1.5rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <p className="eyebrow" style={{ textAlign: 'center' }}>Guía paso a paso</p>
        <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', margin: '0.5rem 0', color: '#0b1f3a' }}>
          ¿Cómo adoptar?
        </h1>
        <p style={{ color: '#49627c', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
          Te acompañamos en cada paso del proceso para que encuentres a tu compañero ideal.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
        {pasos.map((paso) => (
          <div
            key={paso.numero}
            style={{
              background: 'white',
              borderRadius: '16px',
              padding: '2rem',
              border: '1px solid #e2eaf3',
              boxShadow: '0 8px 24px rgb(11 31 58 / 6%)',
              transition: 'transform 0.2s',
              cursor: 'default',
              position: 'relative',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '-12px',
                left: '20px',
                background: '#1672c4',
                color: 'white',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '1.1rem',
              }}
            >
              {paso.numero}
            </div>

            <div style={{ marginTop: '1.5rem' }}>
              <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.5rem' }}>
                {paso.icono}
              </span>
              <h3 style={{ margin: '0.5rem 0', color: '#0b1f3a' }}>{paso.titulo}</h3>
              <p style={{ color: '#49627c', lineHeight: '1.6', margin: 0 }}>{paso.descripcion}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: '3rem', padding: '2rem', background: '#f8fbff', borderRadius: '16px' }}>
        <h3 style={{ color: '#0b1f3a' }}>¿Listo para empezar?</h3>
        <p style={{ color: '#49627c' }}>
          Explora nuestro catálogo y encuentra a tu nuevo mejor amigo.
        </p>
        <Link to="/mascotasLanding" className="hero-button" style={{ display: 'inline-block', marginTop: '0.5rem' }}>
          Ver mascotas disponibles
        </Link>
      </div>
    </div>
  );
}

export default ComoAdoptarPage;