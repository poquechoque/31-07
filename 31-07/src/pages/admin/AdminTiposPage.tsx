import { useEffect, useState } from 'react';
import { tipoMascotaApi } from '../../api/tipoMascotaApi';
import type { TipoMascota } from '../../api/tipoMascotaApi';
import toast from 'react-hot-toast';

// Importar iconos
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaCheck, 
  FaTimes, 
  FaPaw,
  FaList,
  FaSave,
  FaTimesCircle,
  FaSpinner
} from 'react-icons/fa';

function AdminTiposPage() {
  const [tipos, setTipos] = useState<TipoMascota[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editando, setEditando] = useState<TipoMascota | null>(null);
  const [nombreTipo, setNombreTipo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const cargarTipos = async () => {
    try {
      setLoading(true);
      const res = await tipoMascotaApi.listar();
      setTipos(res.data);
    } catch (error) {
      toast.error('Error al cargar tipos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarTipos();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nombreTipo.trim()) {
      toast.error('El nombre del tipo es obligatorio');
      return;
    }

    try {
      setSubmitting(true);
      if (editando) {
        await tipoMascotaApi.actualizar(editando._id, { 
          nombreTipo: nombreTipo.trim(), 
          descripcion: descripcion.trim() || undefined 
        });
        toast.success('Tipo actualizado correctamente');
      } else {
        await tipoMascotaApi.crear({ 
          nombreTipo: nombreTipo.trim(), 
          descripcion: descripcion.trim() || undefined 
        });
        toast.success('Tipo creado correctamente');
      }
      setShowForm(false);
      setEditando(null);
      setNombreTipo('');
      setDescripcion('');
      cargarTipos();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al guardar');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEliminar = async (id: string) => {
    if (!confirm('¿Eliminar este tipo de mascota?')) return;
    try {
      await tipoMascotaApi.eliminar(id);
      toast.success('Tipo eliminado correctamente');
      cargarTipos();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al eliminar');
    }
  };

  const handleEditar = (tipo: TipoMascota) => {
    setEditando(tipo);
    setNombreTipo(tipo.nombreTipo);
    setDescripcion(tipo.descripcion || '');
    setShowForm(true);
  };

  const handleCancelar = () => {
    setShowForm(false);
    setEditando(null);
    setNombreTipo('');
    setDescripcion('');
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <FaSpinner style={{ fontSize: '2rem', color: '#3B82F6', animation: 'spin 1s linear infinite' }} />
        <p style={{ marginTop: '1rem', color: '#64748B' }}>Cargando tipos...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ padding: '0 0.5rem' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <h1 style={{ 
            margin: 0, 
            color: '#0F172A', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem',
            fontSize: '1.75rem'
          }}>
            <FaList style={{ color: '#3B82F6' }} />
            Gestión de Tipos de Mascota
          </h1>
          <p style={{ margin: '0.25rem 0 0', color: '#64748B' }}>
            <FaPaw style={{ display: 'inline', marginRight: '0.3rem', fontSize: '0.8rem' }} />
            {tipos.length} {tipos.length === 1 ? 'tipo registrado' : 'tipos registrados'}
          </p>
        </div>
        <button
          onClick={() => {
            if (!showForm) {
              setEditando(null);
              setNombreTipo('');
              setDescripcion('');
            }
            setShowForm(!showForm);
          }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.6rem 1.5rem',
            background: showForm ? '#EF4444' : '#3B82F6',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            fontSize: '0.95rem',
            fontWeight: '600',
            transition: 'background 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = showForm ? '#DC2626' : '#2563EB';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = showForm ? '#EF4444' : '#3B82F6';
          }}
        >
          {showForm ? <FaTimesCircle /> : <FaPlus />}
          {showForm ? 'Cancelar' : 'Nuevo Tipo'}
        </button>
      </div>

      {/* Formulario */}
      {showForm && (
        <form 
          onSubmit={handleSubmit} 
          style={{ 
            padding: '1.5rem', 
            background: 'white', 
            borderRadius: '12px', 
            marginBottom: '2rem', 
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            border: '1px solid #E2E8F0'
          }}
        >
          <h3 style={{ 
            margin: '0 0 1rem', 
            color: '#0F172A',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <FaPaw style={{ color: '#3B82F6' }} />
            {editando ? 'Editar Tipo' : 'Nuevo Tipo'}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label htmlFor="nombreTipo" style={{ display: 'block', marginBottom: '0.3rem', fontWeight: '600', color: '#334155' }}>
                Nombre *
              </label>
              <input
                id="nombreTipo"
                value={nombreTipo}
                onChange={(e) => setNombreTipo(e.target.value)}
                placeholder="Ej: Perro, Gato, Conejo"
                required
                style={{ 
                  width: '100%', 
                  padding: '0.7rem 1rem', 
                  borderRadius: '10px', 
                  border: '1px solid #E2E8F0',
                  fontSize: '0.95rem'
                }}
              />
            </div>
            <div>
              <label htmlFor="descripcion" style={{ display: 'block', marginBottom: '0.3rem', fontWeight: '600', color: '#334155' }}>
                Descripción
              </label>
              <input
                id="descripcion"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Descripción del tipo de mascota"
                style={{ 
                  width: '100%', 
                  padding: '0.7rem 1rem', 
                  borderRadius: '10px', 
                  border: '1px solid #E2E8F0',
                  fontSize: '0.95rem'
                }}
              />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
            <button 
              type="submit" 
              disabled={submitting}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.6rem 1.5rem',
                background: '#3B82F6',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                cursor: submitting ? 'not-allowed' : 'pointer',
                fontSize: '0.95rem',
                fontWeight: '600',
                transition: 'background 0.2s',
                opacity: submitting ? 0.7 : 1
              }}
              onMouseEnter={(e) => {
                if (!submitting) e.currentTarget.style.background = '#2563EB';
              }}
              onMouseLeave={(e) => {
                if (!submitting) e.currentTarget.style.background = '#3B82F6';
              }}
            >
              {submitting ? <FaSpinner style={{ animation: 'spin 1s linear infinite' }} /> : <FaSave />}
              {submitting ? 'Guardando...' : editando ? 'Actualizar' : 'Crear'}
            </button>
            <button
              type="button"
              onClick={handleCancelar}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.6rem 1.5rem',
                background: '#E2E8F0',
                color: '#475569',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '0.95rem',
                fontWeight: '600',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#CBD5E1'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#E2E8F0'; }}
            >
              <FaTimes /> Cancelar
            </button>
          </div>
        </form>
      )}

      {/* Tabla */}
      <div style={{ 
        overflowX: 'auto', 
        background: 'white', 
        borderRadius: '12px', 
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        border: '1px solid #E2E8F0'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#0F172A', color: 'white' }}>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.85rem' }}>Nombre</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.85rem' }}>Descripción</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.85rem' }}>Estado</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'center', fontSize: '0.85rem' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {tipos.map((t) => (
              <tr key={t._id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                <td style={{ padding: '0.75rem 1rem', color: '#0F172A', fontWeight: '500' }}>
                  <FaPaw style={{ display: 'inline', marginRight: '0.5rem', color: '#3B82F6', fontSize: '0.8rem' }} />
                  {t.nombreTipo}
                </td>
                <td style={{ padding: '0.75rem 1rem', color: '#64748B' }}>{t.descripcion || '-'}</td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    padding: '0.2rem 0.8rem',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    background: t.estado ? '#D1FAE5' : '#FEE2E2',
                    color: t.estado ? '#065F46' : '#991B1B'
                  }}>
                    {t.estado ? <FaCheck size={10} /> : <FaTimes size={10} />}
                    {t.estado ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                    <button
                      onClick={() => handleEditar(t)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        padding: '0.3rem 0.8rem',
                        background: '#3B82F6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        transition: 'background 0.2s'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = '#2563EB'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = '#3B82F6'; }}
                    >
                      <FaEdit size={12} /> Editar
                    </button>
                    <button
                      onClick={() => handleEliminar(t._id)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        padding: '0.3rem 0.8rem',
                        background: '#EF4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        transition: 'background 0.2s'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = '#DC2626'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = '#EF4444'; }}
                    >
                      <FaTrash size={12} /> Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {tipos.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#94A3B8' }}>
            <FaPaw style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }} />
            <p>No hay tipos de mascota registrados</p>
            <button
              onClick={() => {
                setEditando(null);
                setNombreTipo('');
                setDescripcion('');
                setShowForm(true);
              }}
              style={{
                marginTop: '0.5rem',
                padding: '0.5rem 1.5rem',
                background: '#3B82F6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              <FaPlus style={{ marginRight: '0.3rem' }} /> Crear primer tipo
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminTiposPage;