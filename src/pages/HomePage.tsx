import { useNavigate } from "react-router-dom";


import lunaImage from "../assets/dogs/luna.svg";
import maxImage from "../assets/dogs/max.svg";
import nalaImage from "../assets/dogs/nala.svg";
import { authRepository } from "../repositories/authRepository";


function HomePage() {
  const navigate = useNavigate();
  const user = authRepository.getCurrentUser();

  const handleLogout = () => {
    authRepository.logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="brand" href="#inicio" aria-label="adoptaSucre, ir al inicio">
          <svg className="brand-paw" viewBox="0 0 64 64" aria-hidden="true">
            <circle cx="16" cy="18" r="7" />
            <circle cx="31" cy="11" r="7" />
            <circle cx="47" cy="18" r="7" />
            <circle cx="53" cy="33" r="7" />
            <path d="M31.5 26C22 26 16 34.1 16 42.1c0 7.5 6.1 11.9 15.5 11.9S47 49.6 47 42.1C47 34.1 41 26 31.5 26Z" />
          </svg>
          <span>adoptaSucre</span>
        </a>
 codex/mostrar-estructura-de-archivos-cr5ycf

        <nav className="site-nav" aria-label="Navegación principal">
          <a href="#inicio">Inicio</a>
          <a href="#mascotas">Mascotas</a>
          <a href="#como-adoptar">Cómo adoptar</a>
          <a href="#nosotros">Sobre nosotros</a>
        </nav>


 codex/mostrar-estructura-de-archivos-nmpous
        <nav className="site-nav" aria-label="Navegación principal">
          <a href="#inicio">Inicio</a>
          <a href="#mascotas">Mascotas</a>
          <a href="#como-adoptar">Cómo adoptar</a>
          <a href="#nosotros">Sobre nosotros</a>
        </nav>

      {user ? (
        <>
          <p>Bienvenido, {user.name}</p>
          <p>Correo: {user.email}</p>
          <p>Rol: {user.role}</p>
          <p>Estado: {user.status}</p>
main
 main

        {user ? (
          <button className="session-button" type="button" onClick={handleLogout}>
            Cerrar sesión
          </button>
        ) : (
          <button className="login-button" type="button" onClick={() => navigate("/login")}>
            Iniciar sesión
          </button>
        )}
      </header>

      <main className="home-main">
        <section className="hero" id="inicio" aria-labelledby="hero-title">
          <div className="hero-content">
            <p className="eyebrow">Una segunda oportunidad</p>
            <h1 id="hero-title">Encuentra un amigo para toda la vida.</h1>
            <p>
              En adoptaSucre conectamos mascotas que buscan un hogar con personas listas para
              brindarles cariño y cuidado.
            </p>
            <a className="hero-button" href="#mascotas">Conoce a nuestras mascotas</a>
          </div>
          <div className="hero-paw" aria-hidden="true">♥</div>
        </section>

        <section className="home-section" id="mascotas" aria-labelledby="mascotas-title">
          <p className="eyebrow">Ellos te esperan</p>
          <h2 id="mascotas-title">Mascotas que buscan hogar</h2>
 codex/mostrar-estructura-de-archivos-cr5ycf
          <p className="section-intro">
            Conoce a algunos de los perritos que están listos para formar parte de tu familia.
          </p>

          <div className="pet-grid">
            <article className="pet-card">
              <img src={lunaImage} alt="Luna, perrita color miel con pañuelo azul" />
              <div className="pet-card-content">
                <h3>Luna</h3>
                <p>2 años · Cariñosa y juguetona</p>
              </div>
            </article>

            <article className="pet-card">
              <img src={maxImage} alt="Max, perrito blanco y café con pañuelo azul marino" />
              <div className="pet-card-content">
                <h3>Max</h3>
                <p>3 años · Leal y tranquilo</p>
              </div>
            </article>

            <article className="pet-card">
              <img src={nalaImage} alt="Nala, perrita gris con pañuelo amarillo" />
              <div className="pet-card-content">
                <h3>Nala</h3>
                <p>1 año · Dulce y curiosa</p>
              </div>
            </article>
          </div>

          <p>Muy pronto podrás conocer a cada una y comenzar su proceso de adopción.</p>
 main
        </section>

        <section className="home-section" id="como-adoptar" aria-labelledby="adopcion-title">
          <p className="eyebrow">Paso a paso</p>
          <h2 id="adopcion-title">Cómo adoptar</h2>
          <p>Explora las mascotas, completa tu solicitud y acompáñanos en el proceso de encuentro.</p>
        </section>

        <section className="home-section" id="nosotros" aria-labelledby="nosotros-title">
          <p className="eyebrow">Nuestra misión</p>
          <h2 id="nosotros-title">Sobre nosotros</h2>
          <p>Trabajamos para que más mascotas de Sucre encuentren una familia responsable.</p>
        </section>
      </main>
    </div>
  );
}


export default HomePage;
