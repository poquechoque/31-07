import { useEffect, useState } from 'react';
import { reporteApi } from '../../api/reporteApi';
import type { Estadisticas } from '../../api/reporteApi';
import { mascotaApi } from '../../api/mascotaApi';
import toast from 'react-hot-toast';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

interface EstadisticasExtendidas extends Estadisticas {
  mascotasPorTipo?: { _id: string; count: number }[];
}

interface DatoPie {
  name: string;
  value: number;
}

const COLORES_PIE = ['#3B82F6', '#22C55E', '#F59E0B', '#8B5CF6', '#EC4899', '#14B8A6'];

function AdminDashboardPage() {
  const [estadisticas, setEstadisticas] = useState<EstadisticasExtendidas | null>(null);
  const [mascotasPorTipo, setMascotasPorTipo] = useState<DatoPie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarEstadisticas = async () => {
      try {
        const res = await reporteApi.estadisticas();
        const data = res.data as EstadisticasExtendidas;
        setEstadisticas(data);

        if (data.mascotasPorTipo && data.mascotasPorTipo.length > 0) {
          setMascotasPorTipo(
            data.mascotasPorTipo.map((item) => ({ name: item._id, value: item.count }))
          );
        } else {
          try {
            const mascotasRes = await mascotaApi.listar();
            const conteo: Record<string, number> = {};
            mascotasRes.data.forEach((m) => {
              const nombreTipo = m.tipoMascota?.nombreTipo || 'Otro';
              conteo[nombreTipo] = (conteo[nombreTipo] || 0) + 1;
            });
            setMascotasPorTipo(
              Object.entries(conteo).map(([name, value]) => ({ name, value }))
            );
          } catch {
            setMascotasPorTipo([]);
          }
        }
      } catch (error) {
        toast.error('Error al cargar estadísticas');
      } finally {
        setLoading(false);
      }
    };
    cargarEstadisticas();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#64748B' }}>
        Cargando estadísticas...
      </div>
    );
  }

  const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

  const datosAdopcionesPorMes = (estadisticas?.adopcionesPorMes || []).map((item) => ({
    mes: `${meses[item._id.month - 1]}`,
    adopciones: item.count,
  }));

  return (
    <div style={{ padding: '0 0.5rem' }}>
      <h1 style={{ margin: '0 0 2rem', color: '#0F172A', fontSize: '1.75rem' }}>Dashboard</h1>

      {/* Tarjetas de estadísticas */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', 
        gap: '1rem', 
        marginBottom: '2rem' 
      }}>
        <div style={{ padding: '1.25rem', background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', textAlign: 'center' }}>
          <p style={{ margin: 0, color: '#64748B', fontSize: '0.85rem' }}>Usuarios</p>
          <h2 style={{ margin: 0, fontSize: '1.75rem', color: '#0F172A' }}>{estadisticas?.totalUsuarios || 0}</h2>
        </div>
        <div style={{ padding: '1.25rem', background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', textAlign: 'center' }}>
          <p style={{ margin: 0, color: '#64748B', fontSize: '0.85rem' }}>Mascotas</p>
          <h2 style={{ margin: 0, fontSize: '1.75rem', color: '#0F172A' }}>{estadisticas?.totalMascotas || 0}</h2>
        </div>
        <div style={{ padding: '1.25rem', background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', textAlign: 'center' }}>
          <p style={{ margin: 0, color: '#64748B', fontSize: '0.85rem' }}>Solicitudes</p>
          <h2 style={{ margin: 0, fontSize: '1.75rem', color: '#0F172A' }}>{estadisticas?.totalSolicitudes || 0}</h2>
        </div>
        <div style={{ padding: '1.25rem', background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', textAlign: 'center' }}>
          <p style={{ margin: 0, color: '#64748B', fontSize: '0.85rem' }}>Adopciones</p>
          <h2 style={{ margin: 0, fontSize: '1.75rem', color: '#0F172A' }}>{estadisticas?.totalAdopciones || 0}</h2>
        </div>
        <div style={{ padding: '1.25rem', background: '#D1FAE5', borderRadius: '12px', textAlign: 'center' }}>
          <p style={{ margin: 0, color: '#065F46', fontSize: '0.85rem' }}>Disponibles</p>
          <h2 style={{ margin: 0, fontSize: '1.75rem', color: '#065F46' }}>{estadisticas?.mascotasPublicadas || 0}</h2>
        </div>
        <div style={{ padding: '1.25rem', background: '#FEF3C7', borderRadius: '12px', textAlign: 'center' }}>
          <p style={{ margin: 0, color: '#92400E', fontSize: '0.85rem' }}>Pendientes</p>
          <h2 style={{ margin: 0, fontSize: '1.75rem', color: '#92400E' }}>{estadisticas?.solicitudesPendientes || 0}</h2>
        </div>
        <div style={{ padding: '1.25rem', background: '#DBEAFE', borderRadius: '12px', textAlign: 'center' }}>
          <p style={{ margin: 0, color: '#1E40AF', fontSize: '0.85rem' }}>Adoptadas</p>
          <h2 style={{ margin: 0, fontSize: '1.75rem', color: '#1E40AF' }}>{estadisticas?.mascotasAdoptadas || 0}</h2>
        </div>
      </div>

      {/* Gráficos */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '2rem',
      
      }}>
        {/* Gráfico de barras */}
        <div style={{ padding: '1.5rem', background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <h3 style={{ margin: '0 0 1rem', color: '#0F172A', fontSize: '1rem' }}>Adopciones por mes</h3>
          {datosAdopcionesPorMes.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={datosAdopcionesPorMes} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="mes" tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '0.85rem' }}
                  cursor={{ fill: '#F1F5F9' }}
                />
                <Bar dataKey="adopciones" name="Adopciones" fill="#3B82F6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p style={{ color: '#94A3B8', textAlign: 'center', padding: '2rem 0' }}>Sin datos aún</p>
          )}
        </div>

        {/* Gráfico circular */}
        <div style={{ padding: '1.5rem', background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <h3 style={{ margin: '0 0 1rem', color: '#0F172A', fontSize: '1rem' }}>Mascotas por tipo</h3>
          {mascotasPorTipo.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={mascotasPorTipo}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={2}
                >
                  {mascotasPorTipo.map((_, index) => (
                    <Cell key={index} fill={COLORES_PIE[index % COLORES_PIE.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '0.85rem' }} />
                <Legend
                  layout="vertical"
                  verticalAlign="middle"
                  align="right"
                  iconType="circle"
                  wrapperStyle={{ fontSize: '0.85rem', color: '#64748B' }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p style={{ color: '#94A3B8', textAlign: 'center', padding: '2rem 0' }}>Sin datos aún</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboardPage;