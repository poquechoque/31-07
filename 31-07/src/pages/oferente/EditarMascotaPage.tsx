import { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { MascotaForm } from '../../components/mascotas/MascotaForm';
import { mascotaApi } from '../../api/mascotaApi';
import type { Mascota } from '../../types/mascota';

function EditarMascotaPage() {
  const { id } = useParams<{ id: string }>();
  const [mascota, setMascota] = useState<Mascota | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarMascota = async () => {
      if (!id) return;
      try {
        const res = await mascotaApi.obtener(id);
        setMascota(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    cargarMascota();
  }, [id]);

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Cargando...</div>;
  }

  if (!mascota) {
    return <Navigate to="/panel-oferente" replace />;
  }

  return (
    <div>
      <h1 style={{ margin: '0 0 2rem', color: '#0b1f3a' }}>Editar Mascota</h1>
      <MascotaForm mascotaId={id} initialData={mascota} isEditing />
    </div>
  );
}

export default EditarMascotaPage;