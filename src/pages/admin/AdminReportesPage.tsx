import { useState } from 'react';
import { reporteApi } from '../../api/reporteApi';
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';

type TipoReporte = 'adopciones' | 'mascotas' | 'solicitudes';


function aplanarObjeto(obj: any, prefijo = ''): Record<string, any> {
  let resultado: Record<string, any> = {};

  Object.entries(obj || {}).forEach(([key, value]) => {
    const nuevaClave = prefijo ? `${prefijo}.${key}` : key;

    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      resultado = { ...resultado, ...aplanarObjeto(value, nuevaClave) };
    } else if (Array.isArray(value)) {
      resultado[nuevaClave] = value
        .map((v) => (typeof v === 'object' && v !== null ? JSON.stringify(v) : v))
        .join(', ');
    } else {
      resultado[nuevaClave] = value ?? '';
    }
  });

  return resultado;
}

function exportarExcel(data: any[], nombreArchivo: string, nombreHoja: string) {
  if (!data || data.length === 0) {
    toast.error('No hay datos para exportar');
    return;
  }

  const filasAplanadas = data.map((item) => aplanarObjeto(item));

  const hoja = XLSX.utils.json_to_sheet(filasAplanadas);

  const anchos = Object.keys(filasAplanadas[0]).map((key) => {
    const valores = filasAplanadas.map((fila) => String(fila[key] ?? ''));
    const maxLargo = Math.max(key.length, ...valores.map((v) => v.length));
    return { wch: Math.min(Math.max(maxLargo + 2, 10), 40) };
  });
  hoja['!cols'] = anchos;

  const libro = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(libro, hoja, nombreHoja);

  const fecha = new Date().toISOString().split('T')[0];
  XLSX.writeFile(libro, `${nombreArchivo}_${fecha}.xlsx`);
}

function AdminReportesPage() {
  const [loading, setLoading] = useState<TipoReporte | null>(null);

  const generarReporte = async (tipo: TipoReporte) => {
    try {
      setLoading(tipo);
      let res;
      let nombreHoja = '';

      switch (tipo) {
        case 'adopciones':
          res = await reporteApi.adopciones();
          nombreHoja = 'Adopciones';
          break;
        case 'mascotas':
          res = await reporteApi.mascotas();
          nombreHoja = 'Mascotas';
          break;
        case 'solicitudes':
          res = await reporteApi.solicitudes();
          nombreHoja = 'Solicitudes';
          break;
      }

      const datos = Array.isArray(res?.data) ? res.data : [];

      exportarExcel(datos, `reporte_${tipo}`, nombreHoja);
      toast.success(`Reporte de ${tipo} descargado`);
    } catch (error) {
      toast.error('Error al generar reporte');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div>
      <h1 style={{ margin: '0 0 2rem', color: '#0b1f3a' }}>Reportes</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
        <div style={{ padding: '2rem', background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', textAlign: 'center' }}>
          <span style={{ fontSize: '3rem' }}>📊</span>
          <h3 style={{ margin: '0.5rem 0', color: '#0b1f3a' }}>Adopciones</h3>
          <p style={{ color: '#49627c' }}>Reporte completo de adopciones</p>
          <button
            onClick={() => generarReporte('adopciones')}
            className="login-button"
            style={{ background: '#1672c4' }}
            disabled={loading !== null}
          >
            {loading === 'adopciones' ? 'Generando...' : 'Generar Excel'}
          </button>
        </div>

        <div style={{ padding: '2rem', background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', textAlign: 'center' }}>
          <span style={{ fontSize: '3rem' }}>🐾</span>
          <h3 style={{ margin: '0.5rem 0', color: '#0b1f3a' }}>Mascotas</h3>
          <p style={{ color: '#49627c' }}>Reporte de mascotas por estado</p>
          <button
            onClick={() => generarReporte('mascotas')}
            className="login-button"
            style={{ background: '#1672c4' }}
            disabled={loading !== null}
          >
            {loading === 'mascotas' ? 'Generando...' : 'Generar Excel'}
          </button>
        </div>

        <div style={{ padding: '2rem', background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', textAlign: 'center' }}>
          <span style={{ fontSize: '3rem' }}>📋</span>
          <h3 style={{ margin: '0.5rem 0', color: '#0b1f3a' }}>Solicitudes</h3>
          <p style={{ color: '#49627c' }}>Reporte de solicitudes por estado</p>
          <button
            onClick={() => generarReporte('solicitudes')}
            className="login-button"
            style={{ background: '#1672c4' }}
            disabled={loading !== null}
          >
            {loading === 'solicitudes' ? 'Generando...' : 'Generar Excel'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminReportesPage;