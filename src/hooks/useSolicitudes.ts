import { useState, useEffect } from 'react';
import { solicitudApi } from '../api/solicitudApi';
import type{ SolicitudAdopcion  } from '../api/solicitudApi';
import toast from 'react-hot-toast';

export const useMisSolicitudes = () => {
  const [solicitudes, setSolicitudes] = useState<SolicitudAdopcion[]>([]);
  const [loading, setLoading] = useState(true);

  const cargar = async () => {
    try {
      setLoading(true);
      const res = await solicitudApi.misSolicitudes();
      setSolicitudes(res.data);
    } catch (error) {
      toast.error('Error al cargar tus solicitudes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  return { solicitudes, loading, recargar: cargar };
};

export const useSolicitudesRecibidas = () => {
  const [solicitudes, setSolicitudes] = useState<SolicitudAdopcion[]>([]);
  const [loading, setLoading] = useState(true);

  const cargar = async () => {
    try {
      setLoading(true);
      const res = await solicitudApi.recibidas();
      setSolicitudes(res.data);
    } catch (error) {
      toast.error('Error al cargar solicitudes recibidas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  return { solicitudes, loading, recargar: cargar };
};