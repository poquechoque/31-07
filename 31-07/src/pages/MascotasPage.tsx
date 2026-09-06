import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { mascotaApi } from "../api/mascotaApi";
import { tipoMascotaApi } from "../api/tipoMascotaApi";
import { razaApi } from "../api/razaApi";
import type { Mascota, TipoMascota, Raza } from "../types/mascota";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import toast from "react-hot-toast";

function MascotasPage() {
  const { user } = useAuth();

  const [mascotas, setMascotas] = useState<Mascota[]>([]);
  const [loading, setLoading] = useState(true);
  const [tipos, setTipos] = useState<TipoMascota[]>([]);
  const [razas, setRazas] = useState<Raza[]>([]);

  const [search, setSearch] = useState("");
  const [tipoSeleccionado, setTipoSeleccionado] = useState("");
  const [razaSeleccionada, setRazaSeleccionada] = useState("");
  const [sexoSeleccionado, setSexoSeleccionado] = useState("");
  const [tamanoSeleccionado, setTamanoSeleccionado] = useState("");

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        const [mascotasRes, tiposRes, razasRes] = await Promise.all([
          mascotaApi.listar({ estadoAdopcion: 'disponible' }),
          tipoMascotaApi.listar(),
          razaApi.listar(),
        ]);
        setMascotas(mascotasRes.data);
        setTipos(tiposRes.data);
        
        const razasNormalizadas = razasRes.data.map((raza: any) => ({
          ...raza,
          tipoMascota: typeof raza.tipoMascota === 'object' && raza.tipoMascota !== null
            ? raza.tipoMascota._id
            : raza.tipoMascota
        }));
        setRazas(razasNormalizadas);
        
      } catch (error) {
        toast.error('Error al cargar mascotas');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    cargarDatos();
  }, []);

  const filteredMascotas = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return mascotas.filter((mascota) => {
      // Búsqueda por nombre o raza
      if (normalizedSearch) {
        const matchName = mascota.nombre.toLowerCase().includes(normalizedSearch);
        const matchRaza = mascota.raza?.nombreRaza?.toLowerCase().includes(normalizedSearch) || false;
        if (!matchName && !matchRaza) return false;
      }

      // Filtro por tipo
      if (tipoSeleccionado && mascota.tipoMascota._id !== tipoSeleccionado) return false;
      
      // Filtro por raza
      if (razaSeleccionada && mascota.raza._id !== razaSeleccionada) return false;
      
      if (sexoSeleccionado && mascota.sexo !== sexoSeleccionado) return false;
      
      if (tamanoSeleccionado && mascota.tamano !== tamanoSeleccionado) return false;
      
      if (mascota.estadoAdopcion !== 'disponible') return false;

      return true;
    });
  }, [mascotas, search, tipoSeleccionado, razaSeleccionada, sexoSeleccionado, tamanoSeleccionado]);

  const razasFiltradas = useMemo(() => {
    if (!tipoSeleccionado) return razas;
    return razas.filter(r => r.tipoMascota === tipoSeleccionado);
  }, [razas, tipoSeleccionado]);

  const clearFilters = () => {
    setSearch("");
    setTipoSeleccionado("");
    setRazaSeleccionada("");
    setSexoSeleccionado("");
    setTamanoSeleccionado("");
  };

  if (loading) {
    return <LoadingSpinner message="Cargando mascotas..." />;
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div className="catalog-heading">
        <p className="eyebrow">Encuentra a tu compañero</p>
        <h1>Catálogo de mascotas</h1>
        <p>Usa los filtros para encontrar a la mascota ideal para tu familia.</p>
      </div>

      <div className="catalog-layout">
        <aside className="filter-panel" aria-label="Filtros del catálogo">
          <div className="filter-heading">
            <h2>Filtros</h2>
            <button type="button" onClick={clearFilters}>Limpiar</button>
          </div>

          <label htmlFor="tipo">Tipo de mascota</label>
          <select 
            id="tipo" 
            value={tipoSeleccionado} 
            onChange={(e) => { 
              setTipoSeleccionado(e.target.value); 
              setRazaSeleccionada(""); 
            }}
          >
            <option value="">Todos</option>
            {tipos.map(t => <option key={t._id} value={t._id}>{t.nombreTipo}</option>)}
          </select>

          <label htmlFor="raza">Raza</label>
          <select 
            id="raza" 
            value={razaSeleccionada} 
            onChange={(e) => setRazaSeleccionada(e.target.value)} 
            disabled={!tipoSeleccionado}
          >
            <option value="">Todas</option>
            {razasFiltradas.map(r => (
              <option key={r._id} value={r._id}>
                {r.nombreRaza}
              </option>
            ))}
          </select>

          <label htmlFor="sexo">Sexo</label>
          <select id="sexo" value={sexoSeleccionado} onChange={(e) => setSexoSeleccionado(e.target.value)}>
            <option value="">Todos</option>
            <option value="macho">Macho</option>
            <option value="hembra">Hembra</option>
          </select>

          <label htmlFor="tamano">Tamaño</label>
          <select id="tamano" value={tamanoSeleccionado} onChange={(e) => setTamanoSeleccionado(e.target.value)}>
            <option value="">Todos</option>
            <option value="pequeno">Pequeño</option>
            <option value="mediano">Mediano</option>
            <option value="grande">Grande</option>
          </select>
        </aside>

        <section className="catalog-results" aria-labelledby="catalog-results-title">
          <div className="catalog-toolbar">
            <div>
              <h2 id="catalog-results-title">Mascotas disponibles</h2>
              <p>{filteredMascotas.length} {filteredMascotas.length === 1 ? "resultado" : "resultados"}</p>
            </div>
            <label className="search-field" htmlFor="dog-search">
              <span>Buscar</span>
              <input 
                id="dog-search" 
                type="search" 
                placeholder="Nombre o raza" 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
              />
            </label>
          </div>

          {filteredMascotas.length > 0 ? (
            <div className="catalog-grid">
              {filteredMascotas.map((mascota) => (
                <Link className="catalog-card" key={mascota._id} to={`/mascotas/${mascota._id}`}>
                  <img 
                    src={mascota.fotoPrincipal || '/placeholder-dog.jpg'} 
                    alt={mascota.nombre} 
                    onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder-dog.jpg'; }} 
                  />
                  <div className="catalog-card-content">
                    <div className="pet-name-row">
                      <h3>{mascota.nombre}</h3>
                      <span>{mascota.sexo === 'macho' ? '♂' : '♀'}</span>
                    </div>
                    <p className="pet-meta">
                      {mascota.raza?.nombreRaza || 'Sin raza'} · {mascota.edadAproxMeses} meses
                    </p>
                    <p>{mascota.comportamiento || 'Esperando un hogar responsable'}</p>
                    <span className="details-link">Ver detalles</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="empty-catalog">No encontramos mascotas con esos filtros. Intenta de nuevo.</p>
          )}
        </section>
      </div>
    </div>
  );
}

export default MascotasPage;