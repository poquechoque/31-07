import { useState } from 'react';
import { reporteApi } from '../../api/reporteApi';
import toast from 'react-hot-toast';
import ExcelJS from 'exceljs';

type TipoReporte = 'adopciones' | 'mascotas' | 'solicitudes';

const ETIQUETAS: Record<string, string> = {
  'nombre': 'Nombre',
  'sexo': 'Sexo',
  'edadAproxMeses': 'Edad (meses)',
  'tamano': 'Tamaño',
  'color': 'Color',
  'estadoSalud': 'Estado de salud',
  'ubicacion': 'Ubicación',
  'vacunado': 'Vacunado',
  'esterilizado': 'Esterilizado',
  'desparasitado': 'Desparasitado',
  'estadoAdopcion': 'Estado',
  'comportamiento': 'Comportamiento',
  'descripcionAdicional': 'Descripción adicional',
  'requisitos': 'Requisitos',
  'fechaRegistro': 'Fecha de registro',
  'fechaPublicacion': 'Fecha de publicación',
  'fechaAdopcion': 'Fecha de adopción',
  'oferente.nombres': 'Oferente (nombres)',
  'oferente.apellidos': 'Oferente (apellidos)',
  'oferente.telefono': 'Teléfono del oferente',
  'mascota.nombre': 'Mascota',
  'solicitud.mascota.nombre': 'Mascota',
  'solicitud.postulante.nombres': 'Solicitante (nombres)',
  'solicitud.postulante.apellidos': 'Solicitante (apellidos)',
  'solicitud.postulante.correo': 'Correo del solicitante',
  'solicitud.postulante.telefono': 'Teléfono del solicitante',
  'postulante.nombres': 'Solicitante (nombres)',
  'postulante.apellidos': 'Solicitante (apellidos)',
  'postulante.correo': 'Correo del solicitante',
  'postulante.telefono': 'Teléfono del solicitante',
  'motivoPostulacion': 'Motivo',
  'solicitud.motivoPostulacion': 'Motivo',
  'tiempoDisponible': 'Tiempo disponible',
  'tipoVivienda': 'Tipo de vivienda',
  'tenenciaVivienda': 'Tenencia de vivienda',
  'tienePatio': 'Tiene patio',
  'tieneOtrasMascotas': 'Tiene otras mascotas',
  'estadoSolicitud': 'Estado de la solicitud',
  'solicitud.estadoSolicitud': 'Estado de la solicitud',
  'fechaSolicitud': 'Fecha de solicitud',
  'solicitud.fechaSolicitud': 'Fecha de solicitud',
  'estado': 'Estado de la adopción',
  'observaciones': 'Observaciones',
  'nombreUsuario': 'Usuario',
  'correo': 'Correo',
  'rol': 'Rol',
  'ci': 'CI',
  'telefono': 'Teléfono',
  'direccion': 'Dirección',
  'ciudad': 'Ciudad',
  'ocupacion': 'Ocupación',
  'fotoPrincipal': 'Foto',
  'fotografias': 'Foto',
};

const CAMPOS_NOMBRE_PREFERIDOS = ['nombreCompleto', 'nombre', 'nombreTipo', 'nombreRaza'];

// Campos que NUNCA queremos en NINGÚN reporte: identificadores internos y
// metadatos técnicos de Mongo/Mongoose. Se excluyen a cualquier nivel
// de anidación (root o dentro de un sub-objeto poblado), por NOMBRE suelto.
const CAMPOS_A_EXCLUIR = new Set(['_id', '__v', 'createdAt', 'updatedAt']);

// ObjectIds duplicados a nivel raíz cuando la misma info ya está poblada
// en otro lado (ver adopciones: solicitante/oferente/mascota sueltos vs.
// solicitud.postulante/solicitud.mascota ya poblados).
const CAMPOS_ID_DUPLICADOS_A_OCULTAR = new Set(['solicitante', 'oferente', 'mascota']);

// ✅ NUEVO: campos a excluir SOLO del reporte de Adopciones, identificados
// por su RUTA COMPLETA (no por nombre suelto), para no afectar los
// reportes de Mascotas o Solicitudes donde esos mismos nombres de campo
// (raza, tipoMascota, estado...) sí deben mostrarse.
const RUTAS_EXCLUIR_POR_REPORTE: Record<TipoReporte, Set<string>> = {
  adopciones: new Set([
    'solicitud.mascota.raza',
    'solicitud.mascota.tipoMascota',
    'solicitud.entrevistaRealizada',
    'solicitud.visitaDomiciliaria',
    'estado', // "Estado de la adopción" a nivel raíz del documento de adopción
    'solicitud.oferente',
  ]),
  mascotas: new Set(),
  solicitudes: new Set(),
};

function esObjectIdComoString(value: any): boolean {
  return typeof value === 'string' && /^[a-f0-9]{24}$/i.test(value);
}

function esUrlImagenIndividual(value: any): value is string {
  if (typeof value !== 'string') return false;
  return /\.(jpe?g|png|gif|webp|bmp)(\?.*)?$/i.test(value) || /\/uploads\//i.test(value);
}

function formatearValor(value: any): any {
  if (value === null || value === undefined) return '';
  if (typeof value === 'boolean') return value ? 'Sí' : 'No';
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(value)) {
    const fecha = new Date(value);
    if (!isNaN(fecha.getTime())) {
      return fecha.toLocaleDateString('es-BO', { year: 'numeric', month: '2-digit', day: '2-digit' });
    }
  }
  return value;
}

interface FilaProcesada {
  valores: Record<string, any>;
  imagenes: Record<string, string>;
  imagenesExtra: Record<string, number>;
}

// Recorre el objeto y separa: (a) texto normal, (b) campos que son URLs de
// imagen (para incrustar), (c) conteo de imágenes adicionales en arrays
// tipo "fotografias" (solo se incrusta la primera, el resto se cuenta).
// "rutasExcluir" son rutas completas (ej: "solicitud.mascota.raza") que se
// omiten SOLO para este reporte en particular.
function procesarFila(obj: any, prefijo = '', rutasExcluir: Set<string> = new Set()): FilaProcesada {
  let valores: Record<string, any> = {};
  let imagenes: Record<string, string> = {};
  let imagenesExtra: Record<string, number> = {};

  Object.entries(obj || {}).forEach(([key, value]) => {
    if (CAMPOS_A_EXCLUIR.has(key)) return;
    if (prefijo === '' && CAMPOS_ID_DUPLICADOS_A_OCULTAR.has(key) && esObjectIdComoString(value)) return;

    const nuevaClave = prefijo ? `${prefijo}.${key}` : key;

    // ✅ Excluye por ruta completa (específico del reporte actual)
    if (rutasExcluir.has(nuevaClave)) return;

    if (esUrlImagenIndividual(value)) {
      imagenes[nuevaClave] = value;
      return;
    }

    if (Array.isArray(value) && value.length > 0 && value.every((v) => esUrlImagenIndividual(v))) {
      imagenes[nuevaClave] = value[0];
      if (value.length > 1) imagenesExtra[nuevaClave] = value.length - 1;
      return;
    }

    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      const sub = procesarFila(value, nuevaClave, rutasExcluir);
      valores = { ...valores, ...sub.valores };
      imagenes = { ...imagenes, ...sub.imagenes };
      imagenesExtra = { ...imagenesExtra, ...sub.imagenesExtra };
    } else if (Array.isArray(value)) {
      valores[nuevaClave] = value
        .map((v) => {
          if (v !== null && typeof v === 'object') {
            const campo = CAMPOS_NOMBRE_PREFERIDOS.find((c) => c in v);
            return campo ? v[campo] : JSON.stringify(v);
          }
          return v;
        })
        .join(', ');
    } else if (esObjectIdComoString(value)) {
      valores[nuevaClave] = `(sin datos: ${value})`;
    } else {
      valores[nuevaClave] = formatearValor(value);
    }
  });

  return { valores, imagenes, imagenesExtra };
}

function extraerFilas(data: any): any[] {
  if (Array.isArray(data)) return data;
  if (data && typeof data === 'object') {
    return data.mascotas || data.solicitudes || data.adopciones || data.items || data.data || [];
  }
  return [];
}

// Descarga la imagen (fetch), la decodifica y la redibuja en un <canvas>
// como PNG. Esto normaliza cualquier formato (incluido .webp, que Excel
// no soporta nativamente) y de paso genera una miniatura liviana.
async function convertirUrlAImagenPng(
  url: string,
  maxDim = 70
): Promise<{ base64: string; width: number; height: number } | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    const blob = await response.blob();
    const bitmap = await createImageBitmap(blob);

    const escala = Math.min(maxDim / bitmap.width, maxDim / bitmap.height, 1);
    const width = Math.max(1, Math.round(bitmap.width * escala));
    const height = Math.max(1, Math.round(bitmap.height * escala));

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.drawImage(bitmap, 0, 0, width, height);

    return { base64: canvas.toDataURL('image/png'), width, height };
  } catch (error) {
    console.warn('⚠️ No se pudo incrustar la imagen en el Excel:', url, error);
    return null;
  }
}

// Paleta del reporte
const COLOR_HEADER_BG = 'FF1672C4';
const COLOR_HEADER_FONT = 'FFFFFFFF';
const COLOR_ROW_PAR = 'FFEAF2FB';
const COLOR_ROW_IMPAR = 'FFFFFFFF';
const COLOR_BORDE = 'FFD3DEE9';

async function exportarExcelConEstilos(
  data: any[],
  nombreArchivo: string,
  nombreHoja: string,
  rutasExcluir: Set<string> = new Set()
) {
  if (!data || data.length === 0) {
    toast.error('No hay datos para exportar');
    return;
  }

  const filas = data.map((item) => procesarFila(item, '', rutasExcluir));

  const columnasImagen = Array.from(new Set(filas.flatMap((f) => Object.keys(f.imagenes))));
  const columnasImagenExtra = columnasImagen.filter((c) => filas.some((f) => f.imagenesExtra[c] > 0));
  const columnasTexto = Array.from(new Set(filas.flatMap((f) => Object.keys(f.valores))));

  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'AdoptaSucre';
  workbook.created = new Date();

  const worksheet = workbook.addWorksheet(nombreHoja, {
    views: [{ state: 'frozen', ySplit: 1 }],
  });

  // --- Encabezados ---
  const encabezados: string[] = ['N°'];
  columnasImagen.forEach((c) => encabezados.push(ETIQUETAS[c] || 'Foto'));
  columnasImagenExtra.forEach((c) => encabezados.push(`${ETIQUETAS[c] || 'Foto'} (adicionales)`));
  columnasTexto.forEach((c) => encabezados.push(ETIQUETAS[c] || c));

  const headerRow = worksheet.addRow(encabezados);
  headerRow.height = 26;
  headerRow.eachCell((cell) => {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLOR_HEADER_BG } };
    cell.font = { color: { argb: COLOR_HEADER_FONT }, bold: true, size: 11 };
    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    cell.border = {
      top: { style: 'thin', color: { argb: COLOR_BORDE } },
      left: { style: 'thin', color: { argb: COLOR_BORDE } },
      bottom: { style: 'thin', color: { argb: COLOR_BORDE } },
      right: { style: 'thin', color: { argb: COLOR_BORDE } },
    };
  });

  // --- Anchos de columna ---
  worksheet.getColumn(1).width = 6;
  columnasImagen.forEach((_, i) => { worksheet.getColumn(2 + i).width = 14; });
  columnasImagenExtra.forEach((_, i) => { worksheet.getColumn(2 + columnasImagen.length + i).width = 14; });
  columnasTexto.forEach((c, i) => {
    const idx = 2 + columnasImagen.length + columnasImagenExtra.length + i;
    const maxLargo = Math.max((ETIQUETAS[c] || c).length, ...filas.map((f) => String(f.valores[c] ?? '').length));
    worksheet.getColumn(idx).width = Math.min(Math.max(maxLargo + 2, 10), 40);
  });

  // --- Filas de datos ---
  for (let i = 0; i < filas.length; i++) {
    const fila = filas[i];
    const valoresFila: any[] = [i + 1];
    columnasImagen.forEach(() => valoresFila.push(''));
    columnasImagenExtra.forEach((c) => valoresFila.push(fila.imagenesExtra[c] ? `+${fila.imagenesExtra[c]}` : ''));
    columnasTexto.forEach((c) => valoresFila.push(fila.valores[c] ?? ''));

    const row = worksheet.addRow(valoresFila);
    const colorFondo = i % 2 === 0 ? COLOR_ROW_PAR : COLOR_ROW_IMPAR;
    row.eachCell((cell) => {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: colorFondo } };
      cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
      cell.border = {
        top: { style: 'thin', color: { argb: COLOR_BORDE } },
        left: { style: 'thin', color: { argb: COLOR_BORDE } },
        bottom: { style: 'thin', color: { argb: COLOR_BORDE } },
        right: { style: 'thin', color: { argb: COLOR_BORDE } },
      };
    });
    row.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };

    if (columnasImagen.length > 0) {
      row.height = 60;
      for (let ci = 0; ci < columnasImagen.length; ci++) {
        const columna = columnasImagen[ci];
        const url = fila.imagenes[columna];
        if (!url) continue;

        const imagen = await convertirUrlAImagenPng(url, 70);
        if (!imagen) {
          row.getCell(2 + ci).value = 'Sin imagen';
          continue;
        }

        const imageId = workbook.addImage({ base64: imagen.base64, extension: 'png' });
        worksheet.addImage(imageId, {
          tl: { col: 1 + ci + 0.05, row: row.number - 1 + 0.05 },
          ext: { width: imagen.width, height: imagen.height },
        });
      }
    }
  }

  worksheet.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: 1, column: encabezados.length },
  };

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = URL.createObjectURL(blob);
  const enlace = document.createElement('a');
  const fecha = new Date().toISOString().split('T')[0];
  enlace.href = url;
  enlace.download = `${nombreArchivo}_${fecha}.xlsx`;
  document.body.appendChild(enlace);
  enlace.click();
  document.body.removeChild(enlace);
  URL.revokeObjectURL(url);
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

      const datos = extraerFilas(res?.data);

      if (datos.length === 0) {
        console.warn(`⚠️ [${tipo}] No se encontraron filas. Estructura recibida:`, res?.data);
      }

      await exportarExcelConEstilos(
        datos,
        `reporte_${tipo}`,
        nombreHoja,
        RUTAS_EXCLUIR_POR_REPORTE[tipo]
      );
      toast.success(`Reporte de ${tipo} descargado`);
    } catch (error: any) {
      console.error(`❌ [${tipo}] Error completo:`, error);
      const mensaje = error.response?.data?.message || `Error al generar reporte de ${tipo}`;
      toast.error(mensaje);
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