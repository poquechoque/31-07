import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import lunaImage from "../assets/dogs/luna.svg";
import maxImage from "../assets/dogs/max.svg";
import nalaImage from "../assets/dogs/nala.svg";
import { authRepository } from "../repositories/authRepository";

const dogs = [
  {
    slug: "luna",
    age: "Joven",
    ageDetail: "2 años",
    breed: "Mestiza",
    description: "Cariñosa, sociable y muy juguetona.",
    image: lunaImage,
    imageAlt: "Luna, perrita color miel con pañuelo azul",
    name: "Luna",
    sex: "Hembra",
  },
  {
    slug: "max",
    age: "Adulto",
    ageDetail: "3 años",
    breed: "Labrador",
    description: "Leal, tranquilo y amante de los paseos.",
    image: maxImage,
    imageAlt: "Max, perrito blanco y café con pañuelo azul marino",
    name: "Max",
    sex: "Macho",
  },
  {
    slug: "nala",
    age: "Cachorro",
    ageDetail: "1 año",
    breed: "Criolla",
    description: "Dulce, curiosa y lista para aprender.",
    image: nalaImage,
    imageAlt: "Nala, perrita gris con pañuelo amarillo",
    name: "Nala",
    sex: "Hembra",
  },
];

function MascotasPage() {
  const navigate = useNavigate();
  const user = authRepository.getCurrentUser();

  const [search, setSearch] = useState("");
  const [breed, setBreed] = useState("Todas");
  const [age, setAge] = useState("Todas");
  const [sex, setSex] = useState("Todos");

  const filteredDogs = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return dogs.filter(
      (dog) =>
        (breed === "Todas" || dog.breed === breed) &&
        (age === "Todas" || dog.age === age) &&
        (sex === "Todos" || dog.sex === sex) &&
        (!normalizedSearch ||
          `${dog.name} ${dog.breed}`
            .toLowerCase()
            .includes(normalizedSearch))
    );
  }, [age, breed, search, sex]);

  const handleLogout = () => {
    authRepository.logout();
    navigate("/login", { replace: true });
  };

  const clearFilters = () => {
    setSearch("");
    setBreed("Todas");
    setAge("Todas");
    setSex("Todos");
  };

  return (
    <div className="site-shell">
      <header className="site-header">
        <Link
          className="brand"
          to="/"
          aria-label="adoptaSucre, ir al inicio"
        >
          <svg
            className="brand-paw"
            viewBox="0 0 64 64"
            aria-hidden="true"
          >
            <circle cx="16" cy="18" r="7" />
            <circle cx="31" cy="11" r="7" />
            <circle cx="47" cy="18" r="7" />
            <circle cx="53" cy="33" r="7" />
            <path d="M31.5 26C22 26 16 34.1 16 42.1c0 7.5 6.1 11.9 15.5 11.9S47 49.6 47 42.1C47 34.1 41 26 31.5 26Z" />
          </svg>

          <span>adoptaSucre</span>
        </Link>

        <nav className="site-nav" aria-label="Navegación principal">
          <Link to="/">Inicio</Link>
          <Link to="/mascotas" aria-current="page">
            Mascotas
          </Link>
          <Link to="/#como-adoptar">Cómo adoptar</Link>
          <Link to="/#nosotros">Sobre nosotros</Link>
        </nav>

        {user ? (
          <button
            className="session-button"
            type="button"
            onClick={handleLogout}
          >
            Cerrar sesión
          </button>
        ) : (
          <button
            className="login-button"
            type="button"
            onClick={() => navigate("/login")}
          >
            Iniciar sesión
          </button>
        )}
      </header>

      <main className="catalog-main">
        <div className="catalog-heading">
          <p className="eyebrow">Encuentra a tu compañero</p>

          <h1>Catálogo de mascotas</h1>

          <p>
            Usa los filtros para encontrar al perrito ideal para tu familia.
          </p>
        </div>

        <div className="catalog-layout">
          <aside
            className="filter-panel"
            aria-label="Filtros del catálogo"
          >
            <div className="filter-heading">
              <h2>Filtros</h2>

              <button type="button" onClick={clearFilters}>
                Limpiar
              </button>
            </div>

            <label htmlFor="breed">Raza</label>

            <select
              id="breed"
              value={breed}
              onChange={(event) => setBreed(event.target.value)}
            >
              <option>Todas</option>
              <option>Mestiza</option>
              <option>Labrador</option>
              <option>Criolla</option>
            </select>

            <label htmlFor="age">Edad</label>

            <select
              id="age"
              value={age}
              onChange={(event) => setAge(event.target.value)}
            >
              <option>Todas</option>
              <option>Cachorro</option>
              <option>Joven</option>
              <option>Adulto</option>
            </select>

            <label htmlFor="sex">Sexo</label>

            <select
              id="sex"
              value={sex}
              onChange={(event) => setSex(event.target.value)}
            >
              <option>Todos</option>
              <option>Hembra</option>
              <option>Macho</option>
            </select>
          </aside>

          <section
            className="catalog-results"
            aria-labelledby="catalog-results-title"
          >
            <div className="catalog-toolbar">
              <div>
                <h2 id="catalog-results-title">
                  Perritos disponibles
                </h2>

                <p>
                  {filteredDogs.length}{" "}
                  {filteredDogs.length === 1
                    ? "resultado"
                    : "resultados"}
                </p>
              </div>

              <label
                className="search-field"
                htmlFor="dog-search"
              >
                <span>Buscar</span>

                <input
                  id="dog-search"
                  type="search"
                  placeholder="Nombre o raza"
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                />
              </label>
            </div>

            {filteredDogs.length > 0 ? (
              <div className="catalog-grid">
                {filteredDogs.map((dog) => (
                  <Link
                    className="catalog-card"
                    key={dog.name}
                    to={`/mascotas/${dog.slug}`}
                  >
                    <img
                      src={dog.image}
                      alt={dog.imageAlt}
                    />

                    <div className="catalog-card-content">
                      <div className="pet-name-row">
                        <h3>{dog.name}</h3>
                        <span>{dog.sex}</span>
                      </div>

                      <p className="pet-meta">
                        {dog.breed} · {dog.ageDetail}
                      </p>

                      <p>{dog.description}</p>

                      <span className="details-link">
                        Ver detalles
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="empty-catalog">
                No encontramos mascotas con esos filtros. Intenta
                de nuevo.
              </p>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default MascotasPage;