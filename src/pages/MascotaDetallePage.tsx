import { Link, Navigate, useParams } from "react-router-dom";


import { dogs } from "../data/pets";


function MascotaDetallePage() {
  const { slug } = useParams();
  const dog = dogs.find((item) => item.slug === slug);

  if (!dog?.image) {
    return <Navigate to="/mascotas" replace />;
  }

  return (
    <div className="site-shell">
      <header className="site-header">
        <Link className="brand" to="/" aria-label="adoptaSucre, ir al inicio">
          <svg className="brand-paw" viewBox="0 0 64 64" aria-hidden="true">
            <circle cx="16" cy="18" r="7" />
            <circle cx="31" cy="11" r="7" />
            <circle cx="47" cy="18" r="7" />
            <circle cx="53" cy="33" r="7" />
            <path d="M31.5 26C22 26 16 34.1 16 42.1c0 7.5 6.1 11.9 15.5 11.9S47 49.6 47 42.1C47 34.1 41 26 31.5 26Z" />
          </svg>
          <span>adoptaSucre</span>
        </Link>
      </header>

      <main className="pet-detail-main">
        <Link className="back-link" to="/mascotas">← Volver al catálogo</Link>
        <article className="pet-detail-card">
          <img src={dog.image} alt={dog.imageAlt} />
          <div className="pet-detail-content">
            <p className="eyebrow">Perrito disponible</p>
            <h1>{dog.name}</h1>
            <p className="pet-detail-description">{dog.description}</p>
            <dl className="pet-detail-list">
              <div><dt>Raza</dt><dd>{dog.breed}</dd></div>
              <div><dt>Edad</dt><dd>{dog.ageDetail}</dd></div>
              <div><dt>Sexo</dt><dd>{dog.sex}</dd></div>
            </dl>
          </div>
        </article>
      </main>
    </div>
  );
}


export default MascotaDetallePage;
