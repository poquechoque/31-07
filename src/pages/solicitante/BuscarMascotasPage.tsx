import { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { mascotaApi } from '../../api/mascotaApi';
import { tipoMascotaApi } from '../../api/tipoMascotaApi';
import { razaApi } from '../../api/razaApi';
import type { Mascota, TipoMascota, Raza } from '../../types/mascota';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

// Iconos
import { 
  FaSearch, 
  FaFilter, 
  FaDog, 
  FaCat, 
  FaPaw,
  FaTimes,
  FaSync,
  FaCheck,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaVenusMars,
  FaRuler
} from 'react-icons/fa';

function BuscarMascotasPage() {
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
        setRazas(razasRes.data);
      } catch (error) {
        console.error('❌ Error al cargar datos:', error);
        toast.error('Error al cargar mascotas');
      } finally {
        setLoading(false);
      }
    };
    cargarDatos();
  }, []);

  const filteredMascotas = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return mascotas.filter((mascota) => {
      if (normalizedSearch) {
        const matchName = mascota.nombre?.toLowerCase().includes(normalizedSearch) || false;
        const matchRaza = mascota.raza?.nombreRaza?.toLowerCase().includes(normalizedSearch) || false;
        if (!matchName && !matchRaza) return false;
      }
      
      if (tipoSeleccionado && mascota.tipoMascota?._id !== tipoSeleccionado) return false;
      if (razaSeleccionada && mascota.raza?._id !== razaSeleccionada) return false;
      if (sexoSeleccionado && mascota.sexo !== sexoSeleccionado) return false;
      if (tamanoSeleccionado && mascota.tamano !== tamanoSeleccionado) return false;
      
      if (mascota.estadoAdopcion !== 'publicado' && mascota.estadoAdopcion !== 'disponible') return false;
      
      return true;
    });
  }, [mascotas, search, tipoSeleccionado, razaSeleccionada, sexoSeleccionado, tamanoSeleccionado]);

  const razasFiltradas = useMemo(() => {
    if (!tipoSeleccionado) return razas;
    return razas.filter(r => {
      if (r.tipoMascota && typeof r.tipoMascota === 'object' && '_id' in r.tipoMascota) {
        return r.tipoMascota._id === tipoSeleccionado;
      }
      return r.tipoMascota === tipoSeleccionado;
    });
  }, [razas, tipoSeleccionado]);

  const clearFilters = () => {
    setSearch("");
    setTipoSeleccionado("");
    setRazaSeleccionada("");
    setSexoSeleccionado("");
    setTamanoSeleccionado("");
  };

  const hasActiveFilters = search || tipoSeleccionado || razaSeleccionada || sexoSeleccionado || tamanoSeleccionado;

  if (loading) {
    return <LoadingSpinner message="Cargando mascotas disponibles..." />;
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.75rem', 
          color: '#0F172A',
          fontSize: '1.75rem',
          margin: 0
        }}>
          <FaSearch style={{ color: '#3B82F6' }} />
          Buscar Mascotas
        </h1>
        <p style={{ 
          color: '#64748B',
          margin: '0.25rem 0 0',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <FaPaw style={{ fontSize: '0.8rem' }} />
          Encuentra a tu nuevo mejor amigo
          <span style={{ 
            background: '#DBEAFE',
            color: '#1E40AF',
            padding: '0.1rem 0.8rem',
            borderRadius: '20px',
            fontSize: '0.75rem',
            fontWeight: '600'
          }}>
            {mascotas.length} disponibles
          </span>
        </p>
      </div>

      {/* Layout con filtros y resultados */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '280px 1fr',
        gap: '2rem',
        alignItems: 'start'
      }}>
        {/* ✅ Panel de filtros */}
        <aside style={{
          background: 'white',
          borderRadius: '16px',
          padding: '1.5rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          border: '1px solid #E2E8F0',
          position: 'sticky',
          top: '1rem'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem'
          }}>
            <h2 style={{ 
              margin: 0,
              fontSize: '1.1rem',
              color: '#0F172A',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <FaFilter style={{ color: '#3B82F6' }} />
              Filtros
            </h2>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#EF4444',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}
              >
                <FaTimes size={12} /> Limpiar
              </button>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Tipo */}
            <div>
              <label htmlFor="tipo" style={{ 
                fontWeight: '600', 
                display: 'block', 
                marginBottom: '0.3rem',
                fontSize: '0.9rem',
                color: '#334155'
              }}>
                <FaDog style={{ marginRight: '0.3rem', fontSize: '0.8rem' }} />
                Tipo de mascota
              </label>
              <select
                id="tipo"
                value={tipoSeleccionado}
                onChange={(e) => {
                  setTipoSeleccionado(e.target.value);
                  setRazaSeleccionada("");
                }}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.8rem',
                  borderRadius: '10px',
                  border: '1px solid #E2E8F0',
                  fontSize: '0.9rem',
                  background: 'white'
                }}
              >
                <option value="">Todos</option>
                {tipos.map(t => (
                  <option key={t._id} value={t._id}>{t.nombreTipo}</option>
                ))}
              </select>
            </div>

            {/* Raza */}
            <div>
              <label htmlFor="raza" style={{ 
                fontWeight: '600', 
                display: 'block', 
                marginBottom: '0.3rem',
                fontSize: '0.9rem',
                color: '#334155'
              }}>
                <FaPaw style={{ marginRight: '0.3rem', fontSize: '0.8rem' }} />
                Raza
              </label>
              <select
                id="raza"
                value={razaSeleccionada}
                onChange={(e) => setRazaSeleccionada(e.target.value)}
                disabled={!tipoSeleccionado}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.8rem',
                  borderRadius: '10px',
                  border: '1px solid #E2E8F0',
                  fontSize: '0.9rem',
                  background: tipoSeleccionado ? 'white' : '#F1F5F9',
                  cursor: tipoSeleccionado ? 'pointer' : 'not-allowed'
                }}
              >
                <option value="">Todas</option>
                {razasFiltradas.map(r => (
                  <option key={r._id} value={r._id}>{r.nombreRaza}</option>
                ))}
              </select>
              {!tipoSeleccionado && (
                <p style={{ fontSize: '0.75rem', color: '#94A3B8', margin: '0.2rem 0 0' }}>
                  Selecciona un tipo primero
                </p>
              )}
            </div>

            {/* Sexo */}
            <div>
              <label htmlFor="sexo" style={{ 
                fontWeight: '600', 
                display: 'block', 
                marginBottom: '0.3rem',
                fontSize: '0.9rem',
                color: '#334155'
              }}>
                <FaVenusMars style={{ marginRight: '0.3rem', fontSize: '0.8rem' }} />
                Sexo
              </label>
              <select
                id="sexo"
                value={sexoSeleccionado}
                onChange={(e) => setSexoSeleccionado(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.8rem',
                  borderRadius: '10px',
                  border: '1px solid #E2E8F0',
                  fontSize: '0.9rem',
                  background: 'white'
                }}
              >
                <option value="">Todos</option>
                <option value="macho">Macho</option>
                <option value="hembra">Hembra</option>
              </select>
            </div>

            {/* Tamaño */}
            <div>
              <label htmlFor="tamano" style={{ 
                fontWeight: '600', 
                display: 'block', 
                marginBottom: '0.3rem',
                fontSize: '0.9rem',
                color: '#334155'
              }}>
                <FaRuler style={{ marginRight: '0.3rem', fontSize: '0.8rem' }} />
                Tamaño
              </label>
              <select
                id="tamano"
                value={tamanoSeleccionado}
                onChange={(e) => setTamanoSeleccionado(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.8rem',
                  borderRadius: '10px',
                  border: '1px solid #E2E8F0',
                  fontSize: '0.9rem',
                  background: 'white'
                }}
              >
                <option value="">Todos</option>
                <option value="pequeno">Pequeño</option>
                <option value="mediano">Mediano</option>
                <option value="grande">Grande</option>
              </select>
            </div>

            {/* Resultados del filtro */}
            <div style={{
              marginTop: '0.5rem',
              padding: '0.75rem',
              background: '#F8FAFC',
              borderRadius: '10px',
              textAlign: 'center'
            }}>
              <p style={{ margin: 0, color: '#475569', fontSize: '0.9rem' }}>
                <strong>{filteredMascotas.length}</strong> mascota{filteredMascotas.length !== 1 ? 's' : ''} encontrada{filteredMascotas.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </aside>

        {/* ✅ Resultados */}
        <section style={{ minHeight: '400px' }}>
          {/* Toolbar */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <h2 style={{ margin: 0, color: '#0F172A', fontSize: '1.3rem' }}>
                Mascotas disponibles
              </h2>
              <p style={{ margin: '0.2rem 0 0', color: '#64748B', fontSize: '0.9rem' }}>
                {filteredMascotas.length} {filteredMascotas.length === 1 ? "resultado" : "resultados"}
              </p>
            </div>
            <div style={{ position: 'relative', width: '250px' }}>
              <FaSearch style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#94A3B8'
              }} />
              <input
                type="search"
                placeholder="Buscar por nombre o raza"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.8rem 0.6rem 2.5rem',
                  borderRadius: '10px',
                  border: '1px solid #E2E8F0',
                  fontSize: '0.9rem',
                  background: 'white'
                }}
              />
            </div>
          </div>

          {/* Grid de mascotas */}
          {filteredMascotas.length > 0 ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: '1.5rem'
            }}>
              {filteredMascotas.map((mascota) => (
                <Link
                  key={mascota._id}
                  to={`/mascotas/${mascota._id}`}
                  style={{
                    textDecoration: 'none',
                    background: 'white',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    border: '1px solid #E2E8F0',
                    transition: 'transform 0.2s, box-shadow 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
                  }}
                >
                  <img
                    src={mascota.fotoPrincipal || '/placeholder-dog.jpg'}
                    alt={mascota.nombre}
                    style={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'cover',
                      background: '#F1F5F9'
                    }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder-dog.jpg';
                    }}
                  />
                  <div style={{ padding: '1rem' }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <h3 style={{
                        margin: 0,
                        color: '#0F172A',
                        fontSize: '1.05rem'
                      }}>
                        {mascota.nombre}
                      </h3>
                      <span style={{
                        fontSize: '1rem',
                        color: mascota.sexo === 'macho' ? '#3B82F6' : '#EC4899'
                      }}>
                        {mascota.sexo === 'macho' ? '♂' : '♀'}
                      </span>
                    </div>
                    <p style={{
                      margin: '0.25rem 0',
                      color: '#64748B',
                      fontSize: '0.85rem'
                    }}>
                      {mascota.raza?.nombreRaza || 'Sin raza'} · {mascota.edadAproxMeses} meses
                    </p>
                    <p style={{
                      margin: '0.25rem 0 0',
                      color: '#475569',
                      fontSize: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem'
                    }}>
                      <FaMapMarkerAlt style={{ fontSize: '0.7rem', color: '#94A3B8' }} />
                      {mascota.ubicacion || 'Sin ubicación'}
                    </p>
                    <div style={{
                      marginTop: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        padding: '0.15rem 0.6rem',
                        borderRadius: '20px',
                        fontSize: '0.7rem',
                        fontWeight: '600',
                        background: '#D1FAE5',
                        color: '#065F46'
                      }}>
                        <FaCheck size={10} />
                        Disponible
                      </span>
                      <span style={{
                        fontSize: '0.8rem',
                        color: '#3B82F6',
                        fontWeight: '500'
                      }}>
                        Ver detalles →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '4rem 2rem',
              background: 'white',
              borderRadius: '16px',
              border: '2px dashed #E2E8F0'
            }}>
              <FaPaw style={{ fontSize: '3rem', color: '#CBD5E1' }} />
              <h3 style={{ color: '#0F172A', margin: '1rem 0 0.5rem' }}>
                No se encontraron mascotas
              </h3>
              <p style={{ color: '#64748B' }}>
                {hasActiveFilters 
                  ? 'Intenta ajustar los filtros de búsqueda'
                  : 'No hay mascotas disponibles en este momento'}
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  style={{
                    marginTop: '1rem',
                    padding: '0.6rem 2rem',
                    background: '#3B82F6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <FaSync /> Limpiar filtros
                </button>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default BuscarMascotasPage;