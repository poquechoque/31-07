import { useState, useEffect } from 'react';
import { mascotaApi } from '../api/mascotaApi';
import type { Mascota, FiltrosMascota } from '../api/mascotaApi';
import toast from 'react-hot-toast';

export const useMascotas = (filtros?: FiltrosMascota) => {
  const [mascotas, setMascotas] = useState<Mascota[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargar = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await mascotaApi.listar(filtros);
      setMascotas(res.data);
    } catch (err) {
      setError('Error al cargar mascotas');
      toast.error('Error al cargar mascotas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargar();
  }, [JSON.stringify(filtros)]);

  return { mascotas, loading, error, recargar: cargar };
};

export const useMisMascotas = () => {
  const [mascotas, setMascotas] = useState<Mascota[]>([]);
  const [loading, setLoading] = useState(true);

  const cargar = async () => {
    try {
      setLoading(true);
      const res = await mascotaApi.misMascotas();
      setMascotas(res.data);
    } catch (error) {
      toast.error('Error al cargar tus mascotas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  return { mascotas, loading, recargar: cargar };
};