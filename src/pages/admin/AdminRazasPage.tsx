import { useEffect, useState } from 'react';
import { razaApi } from '../../api/razaApi';
import type{  Raza } from '../../api/razaApi';
import { tipoMascotaApi } from '../../api/tipoMascotaApi';
import type{  TipoMascota } from '../../api/tipoMascotaApi';
import toast from 'react-hot-toast';

function AdminRazasPage() {
  const [razas, setRazas] = useState<Raza[]>([]);
  const [tipos, setTipos] = useState<TipoMascota[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editando, setEditando] = useState<Raza | null>(null);
  const [tipoMascota, setTipoMascota] = useState('');
  const [nombreRaza, setNombreRaza] = useState('');
  const [descripcion, setDescripcion] = useState('');

  const cargarDatos = async () => {
    try {
      const [razasRes, tiposRes] = await Promise.all([
        razaApi.listar(),
        tipoMascotaApi.listar(),
      ]);
      setRazas(razasRes.data);
      setTipos(tiposRes.data);
    } catch (error) {
      toast.error('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editando) {
        await razaApi.actualizar(editando._id, { nombreRaza, descripcion });
        toast.success('Raza actualizada');
      } else {
        await razaApi.crear({ tipoMascota, nombreRaza, descripcion });
        toast.success('Raza creada');
      }
      setShowForm(false);
      setEditando(null);
      setTipoMascota('');
      setNombreRaza('');
      setDescripcion('');
      cargarDatos();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al guardar');
    }
  };

  const handleEliminar = async (id: string) => {
    if (!confirm('¿Eliminar esta raza?')) return;
    try {
      await razaApi.eliminar(id);
      toast.success('Raza eliminada');
      cargarDatos();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al eliminar');
    }
  };

  const handleEditar = (raza: Raza) => {
    setEditando(raza);
    setTipoMascota(typeof raza.tipoMascota === 'string' ? raza.tipoMascota : raza.tipoMascota._id);
    setNombreRaza(raza.nombreRaza);
    setDescripcion(raza.descripcion || '');
    setShowForm(true);
  };

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Cargando razas...</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ margin: 0, color: '#0b1f3a' }}>Gestión de Razas</h1>
        <button
          className="hero-button"
          onClick={() => {
            setEditando(null);
            setTipoMascota('');
            setNombreRaza('');
            setDescripcion('');
            setShowForm(!showForm);
          }}
        >
          {showForm ? 'Cancelar' : '+ Nueva Raza'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ padding: '1.5rem', background: 'white', borderRadius: '12px', marginBottom: '2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <h3 style={{ margin: '0 0 1rem' }}>{editando ? 'Editar Raza' : 'Nueva Raza'}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label htmlFor="tipoMascota" style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 'bold' }}>Tipo de Mascota *</label>
              <select
                id="tipoMascota"
                value={tipoMascota}
                onChange={(e) => setTipoMascota(e.target.value)}
                required
                style={{ width: '100%', padding: '0.7rem', borderRadius: '10px', border: '1px solid #bfd0e3' }}
              >
                <option value="">Selecciona...</option>
                {tipos.map(t => <option key={t._id} value={t._id}>{t.nombreTipo}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="nombreRaza" style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 'bold' }}>Nombre de la Raza *</label>
              <input
                id="nombreRaza"
                value={nombreRaza}
                onChange={(e) => setNombreRaza(e.target.value)}
                required
                style={{ width: '100%', padding: '0.7rem', borderRadius: '10px', border: '1px solid #bfd0e3' }}
              />
            </div>
          </div>
          <div>
            <label htmlFor="descripcion" style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 'bold' }}>Descripción</label>
            <textarea
              id="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              rows={2}
              style={{ width: '100%', padding: '0.7rem', borderRadius: '10px', border: '1px solid #bfd0e3' }}
            />
          </div>
          <button type="submit" className="login-button" style={{ background: '#1672c4', marginTop: '1rem' }}>
            {editando ? 'Actualizar' : 'Crear'}
          </button>
        </form>
      )}

      <div style={{ overflowX: 'auto', background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#0b1f3a', color: 'white' }}>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Raza</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Tipo</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Descripción</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Estado</th>
              <th style={{ padding: '0.75rem', textAlign: 'center' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {razas.map((r) => {
              const tipoNombre = typeof r.tipoMascota === 'string'
                ? tipos.find(t => t._id === r.tipoMascota)?.nombreTipo || r.tipoMascota
                : r.tipoMascota.nombreTipo;
              return (
                <tr key={r._id} style={{ borderBottom: '1px solid #e2eaf3' }}>
                  <td style={{ padding: '0.75rem' }}>{r.nombreRaza}</td>
                  <td style={{ padding: '0.75rem' }}>{tipoNombre}</td>
                  <td style={{ padding: '0.75rem' }}>{r.descripcion || '-'}</td>
                  <td style={{ padding: '0.75rem' }}>
                    <span className={`estado-badge ${r.estado ? 'estado-badge-publicado' : 'estado-badge-borrador'}`}>
                      {r.estado ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                    <button
                      onClick={() => handleEditar(r)}
                      className="login-button"
                      style={{ background: '#1672c4', marginRight: '0.5rem', padding: '0.3rem 0.8rem' }}
                    >
                    Editar
                    </button>
                    <button
                      onClick={() => handleEliminar(r._id)}
                      className="login-button"
                      style={{ background: '#dc3545', padding: '0.3rem 0.8rem' }}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {razas.length === 0 && (
          <p style={{ textAlign: 'center', padding: '2rem', color: '#49627c' }}>No hay razas registradas</p>
        )}
      </div>
    </div>
  );
}

export default AdminRazasPage;