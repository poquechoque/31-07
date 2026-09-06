import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { mascotaApi } from '../../api/mascotaApi';
import type { TipoMascota, Raza, Mascota, CrearMascotaData } from '../../types/mascota';
import apiClient from '../../api/client';

const mascotaSchema = z.object({
  tipoMascota: z.string().min(1, 'Selecciona un tipo'),
  raza: z.string().min(1, 'Selecciona una raza'),
  nombre: z.string().min(2, 'El nombre es obligatorio'),
  sexo: z.enum(['macho', 'hembra']),
  edadAproxMeses: z.coerce.number().min(0, 'La edad debe ser mayor a 0'),
  tamano: z.enum(['pequeno', 'mediano', 'grande']),
  color: z.string().min(1, 'El color es obligatorio'),
  estadoSalud: z.string().min(1, 'El estado de salud es obligatorio'),
  ubicacion: z.string().min(1, 'La ubicación es obligatoria'),
  comportamiento: z.string().optional().default(''),
  descripcionAdicional: z.string().optional().default(''),
  vacunado: z.boolean().default(false),
  esterilizado: z.boolean().default(false),
  desparasitado: z.boolean().default(false),
  requisitos: z.string().optional().default(''),
  fotoPrincipal: z.string().optional().default(''),
  estadoAdopcion: z.enum(['borrador', 'pendiente', 'publicado', 'disponible', 'adoptado', 'cancelado']).default('disponible'),
});

type MascotaFormData = z.infer<typeof mascotaSchema>;

interface MascotaFormProps {
  mascotaId?: string;
  initialData?: Mascota;
  isEditing?: boolean;
}

const construirValoresFormulario = (initialData?: Mascota): MascotaFormData => ({
  tipoMascota: initialData?.tipoMascota?._id || '',
  raza: initialData?.raza?._id || '',
  nombre: initialData?.nombre || '',
  sexo: initialData?.sexo || 'macho',
  edadAproxMeses: initialData?.edadAproxMeses || 0,
  tamano: initialData?.tamano || 'mediano',
  color: initialData?.color || '',
  estadoSalud: initialData?.estadoSalud || '',
  ubicacion: initialData?.ubicacion || '',
  comportamiento: initialData?.comportamiento || '',
  descripcionAdicional: initialData?.descripcionAdicional || '',
  vacunado: initialData?.vacunado || false,
  esterilizado: initialData?.esterilizado || false,
  desparasitado: initialData?.desparasitado || false,
  requisitos: initialData?.requisitos || '',
  fotoPrincipal: initialData?.fotoPrincipal || '',
  estadoAdopcion: initialData?.estadoAdopcion || 'disponible',
});

export const MascotaForm = ({ mascotaId, initialData, isEditing = false }: MascotaFormProps) => {
  const navigate = useNavigate();
  const [tipos, setTipos] = useState<TipoMascota[]>([]);
  const [razas, setRazas] = useState<Raza[]>([]);
  const [loading, setLoading] = useState(false);
  const [cargandoDatos, setCargandoDatos] = useState(true);

  const [fotoPrincipalFile, setFotoPrincipalFile] = useState<File | null>(null);
  const [fotoPrincipalPreview, setFotoPrincipalPreview] = useState<string>(initialData?.fotoPrincipal || '');
  const [fotografiasFiles, setFotografiasFiles] = useState<File[]>([]);
  const [fotografiasPreviews, setFotografiasPreviews] = useState<string[]>(initialData?.fotografias || []);

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<MascotaFormData>({
    resolver: zodResolver(mascotaSchema) as any,
    defaultValues: construirValoresFormulario(initialData),
  });

  const tipoMascotaSeleccionado = watch('tipoMascota');
  const estadoAdopcionActual = watch('estadoAdopcion');

  useEffect(() => {
    if (initialData) {
      reset(construirValoresFormulario(initialData));
      setFotoPrincipalPreview(initialData.fotoPrincipal || '');
      setFotografiasPreviews(initialData.fotografias || []);
    }
  }, [initialData, reset]);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [tiposRes, razasRes] = await Promise.all([
          apiClient.get('/tipos-mascota'),
          apiClient.get('/razas'),
        ]);
        setTipos(tiposRes.data);
        setRazas(razasRes.data);
      } catch (error) {
        toast.error('Error al cargar datos del formulario');
      } finally {
        setCargandoDatos(false);
      }
    };
    cargarDatos();
  }, []);

  const esTipoMascotaObject = (value: any): value is { _id: string; nombreTipo: string } => {
    return value && typeof value === 'object' && '_id' in value;
  };

  const razasFiltradas = razas.filter(r => {
    if (esTipoMascotaObject(r.tipoMascota)) {
      return r.tipoMascota._id === tipoMascotaSeleccionado;
    }
    return r.tipoMascota === tipoMascotaSeleccionado;
  });

  const handleFotoPrincipalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFotoPrincipalFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoPrincipalPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFotografiasChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setFotografiasFiles(prev => [...prev, ...fileArray]);

      fileArray.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFotografiasPreviews(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeFotoPrincipal = () => {
    setFotoPrincipalFile(null);
    setFotoPrincipalPreview('');
  };

  const removeFotografia = (index: number) => {
    setFotografiasFiles(prev => prev.filter((_, i) => i !== index));
    setFotografiasPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: MascotaFormData) => {
    try {
      setLoading(true);

      const formData = new FormData();

      Object.keys(data).forEach(key => {
        const value = data[key as keyof MascotaFormData];
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });

      if (fotoPrincipalFile) {
        formData.append('fotoPrincipal', fotoPrincipalFile);
      }

      fotografiasFiles.forEach(file => {
        formData.append('fotografias', file);
      });

      if (isEditing && mascotaId) {
        await mascotaApi.actualizarConImagen(mascotaId, formData);
        toast.success('Mascota actualizada correctamente');
      } else {
        await mascotaApi.crearConImagen(formData);
        toast.success('Mascota publicada correctamente');
      }

      navigate('/panel-oferente');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al guardar';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (cargandoDatos) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', color: '#64748B' }}>
        Cargando formulario...
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', padding: '1.5rem 1rem' }}>
      <div className="mf-card">
        <style>{`
          .mf-card {
            max-width: 620px;
            margin: 0 auto;
            background: #FFFFFF;
            border-radius: 16px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
            padding: 1.5rem 1.75rem;
            max-height: 92vh;
            overflow-y: auto;
          }
          .mf-header { text-align: center; margin-bottom: 1.1rem; }
          .mf-title { margin: 0; color: #0F172A; font-size: 1.25rem; font-weight: 700; }
          .mf-subtitle { margin: 0.2rem 0 0; color: #64748B; font-size: 0.82rem; }
          .mf-section-title {
            font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em;
            color: #94A3B8; margin: 1.1rem 0 0.5rem;
          }
          .mf-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
          .mf-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.75rem; }
          .mf-field { display: flex; flex-direction: column; }
          .mf-field-full { grid-column: 1 / -1; }
          .mf-label { font-size: 0.78rem; font-weight: 500; color: #334155; margin-bottom: 0.3rem; }
          .mf-input, .mf-select, .mf-textarea {
            width: 100%;
            padding: 0.5rem 0.7rem;
            border-radius: 8px;
            border: 1px solid #E2E8F0;
            font-size: 0.88rem;
            color: #0F172A;
            background: #FFFFFF;
            box-sizing: border-box;
          }
          .mf-input:focus, .mf-select:focus, .mf-textarea:focus {
            outline: none;
            border-color: #10B981;
          }
          .mf-textarea { resize: vertical; }
          .mf-help { font-size: 0.75rem; color: #64748B; margin-top: 0.3rem; }
          .mf-error { color: #DC2626; font-size: 0.75rem; margin-top: 0.25rem; }
          .mf-photo-row { display: flex; gap: 0.6rem; align-items: center; margin-top: 0.6rem; flex-wrap: wrap; }
          .mf-photo-box { position: relative; display: inline-block; }
          .mf-photo-box img { object-fit: cover; border-radius: 8px; border: 1px solid #E2E8F0; }
          .mf-remove-btn {
            position: absolute; top: -7px; right: -7px; background: #EF4444; color: #fff;
            border: none; border-radius: 50%; width: 18px; height: 18px; cursor: pointer;
            display: flex; align-items: center; justify-content: center; font-size: 0.75rem; line-height: 1;
          }
          .mf-checks {
            display: flex; gap: 1.5rem; flex-wrap: wrap; margin-top: 1rem;
            padding: 0.65rem 1rem; background: #F8FAFC; border-radius: 10px;
          }
          .mf-check-label { display: flex; align-items: center; gap: 0.4rem; cursor: pointer; font-size: 0.85rem; color: #334155; }
          .mf-submit {
            margin-top: 1.25rem; width: 100%; padding: 0.7rem; border: none; border-radius: 10px;
            font-size: 0.95rem; font-weight: 600; color: #FFFFFF; cursor: pointer;
            background: #10B981;
          }
          .mf-submit:hover:not(:disabled) { background: #059669; }
          .mf-submit:disabled { background: #94A3B8; cursor: not-allowed; }
          @media (max-width: 640px) {
            .mf-grid, .mf-grid-3 { grid-template-columns: 1fr; }
            .mf-card { padding: 1.25rem; max-height: none; }
          }
        `}</style>

        <div className="mf-header">
          <h1 className="mf-title">{isEditing ? 'Editar mascota' : 'Publicar mascota'}</h1>
          <p className="mf-subtitle">Completa los datos para que otros puedan conocerla</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mf-grid">
            <div className="mf-field">
              <label htmlFor="tipoMascota" className="mf-label">Tipo de mascota</label>
              <select id="tipoMascota" {...register('tipoMascota')} className="mf-select">
                <option value="">Selecciona...</option>
                {tipos.map(t => <option key={t._id} value={t._id}>{t.nombreTipo}</option>)}
              </select>
              {errors.tipoMascota && <p className="mf-error">{errors.tipoMascota.message}</p>}
            </div>

            <div className="mf-field">
              <label htmlFor="raza" className="mf-label">Raza</label>
              <select id="raza" {...register('raza')} className="mf-select">
                <option value="">Selecciona...</option>
                {razasFiltradas.map(r => <option key={r._id} value={r._id}>{r.nombreRaza}</option>)}
              </select>
              {errors.raza && <p className="mf-error">{errors.raza.message}</p>}
            </div>

            <div className="mf-field">
              <label htmlFor="nombre" className="mf-label">Nombre</label>
              <input id="nombre" {...register('nombre')} className="mf-input" />
              {errors.nombre && <p className="mf-error">{errors.nombre.message}</p>}
            </div>

            <div className="mf-field">
              <label htmlFor="sexo" className="mf-label">Sexo</label>
              <select id="sexo" {...register('sexo')} className="mf-select">
                <option value="macho">Macho</option>
                <option value="hembra">Hembra</option>
              </select>
            </div>
          </div>

          <div className="mf-grid-3" style={{ marginTop: '0.75rem' }}>
            <div className="mf-field">
              <label htmlFor="edadAproxMeses" className="mf-label">Edad (meses)</label>
              <input id="edadAproxMeses" type="number" {...register('edadAproxMeses', { valueAsNumber: true })} className="mf-input" />
              {errors.edadAproxMeses && <p className="mf-error">{errors.edadAproxMeses.message}</p>}
            </div>

            <div className="mf-field">
              <label htmlFor="tamano" className="mf-label">Tamaño</label>
              <select id="tamano" {...register('tamano')} className="mf-select">
                <option value="pequeno">Pequeño</option>
                <option value="mediano">Mediano</option>
                <option value="grande">Grande</option>
              </select>
            </div>

            <div className="mf-field">
              <label htmlFor="color" className="mf-label">Color</label>
              <input id="color" {...register('color')} className="mf-input" />
              {errors.color && <p className="mf-error">{errors.color.message}</p>}
            </div>
          </div>

          <div className="mf-field" style={{ marginTop: '0.75rem' }}>
            <label htmlFor="ubicacion" className="mf-label">Ubicación (Zona/Barrio)</label>
            <input id="ubicacion" {...register('ubicacion')} placeholder="Ej: Zona Central, Sucre" className="mf-input" />
            {errors.ubicacion && <p className="mf-error">{errors.ubicacion.message}</p>}
          </div>

          {isEditing ? (
            <div className="mf-field" style={{ marginTop: '0.75rem' }}>
              <label htmlFor="estadoAdopcion" className="mf-label">Estado de la publicación</label>
              <select id="estadoAdopcion" {...register('estadoAdopcion')} className="mf-select">
                <option value="borrador">Borrador (solo visible para ti)</option>
                <option value="publicado">Publicado (visible para todos)</option>
                <option value="disponible">Disponible (para adopción)</option>
                <option value="adoptado">Adoptado</option>
                <option value="cancelado">Cancelado</option>
              </select>
              <p className="mf-help">
                {estadoAdopcionActual === 'borrador' && 'Solo visible para ti.'}
                {estadoAdopcionActual === 'publicado' && 'Visible para todos los usuarios.'}
                {estadoAdopcionActual === 'disponible' && 'Disponible para adopción inmediata.'}
                {estadoAdopcionActual === 'adoptado' && 'Ya no se mostrará como disponible.'}
                {estadoAdopcionActual === 'cancelado' && 'La publicación quedará cancelada.'}
              </p>
            </div>
          ) : (
            <input type="hidden" {...register('estadoAdopcion')} />
          )}

          <p className="mf-section-title">Salud y comportamiento</p>

          <div className="mf-field">
            <label htmlFor="estadoSalud" className="mf-label">Estado de salud</label>
            <textarea id="estadoSalud" {...register('estadoSalud')} rows={2} placeholder="Ej: Buena salud, está en tratamiento por..." className="mf-textarea" />
            {errors.estadoSalud && <p className="mf-error">{errors.estadoSalud.message}</p>}
          </div>

          <div className="mf-grid" style={{ marginTop: '0.75rem' }}>
            <div className="mf-field">
              <label htmlFor="comportamiento" className="mf-label">Comportamiento</label>
              <textarea id="comportamiento" {...register('comportamiento')} rows={2} placeholder="Amigable, juguetón..." className="mf-textarea" />
            </div>
            <div className="mf-field">
              <label htmlFor="requisitos" className="mf-label">Requisitos para adoptar</label>
              <textarea id="requisitos" {...register('requisitos')} rows={2} placeholder="Casa con patio, sin otros perros..." className="mf-textarea" />
            </div>
          </div>

          <div className="mf-field" style={{ marginTop: '0.75rem' }}>
            <label htmlFor="descripcionAdicional" className="mf-label">Descripción adicional</label>
            <textarea id="descripcionAdicional" {...register('descripcionAdicional')} rows={2} placeholder="Información adicional sobre la mascota..." className="mf-textarea" />
          </div>

          <div className="mf-checks">
            <label className="mf-check-label">
              <input type="checkbox" {...register('vacunado')} /> Vacunado
            </label>
            <label className="mf-check-label">
              <input type="checkbox" {...register('esterilizado')} /> Esterilizado
            </label>
            <label className="mf-check-label">
              <input type="checkbox" {...register('desparasitado')} /> Desparasitado
            </label>
          </div>

          <p className="mf-section-title">Fotos</p>

          <div className="mf-field">
            <label htmlFor="fotoPrincipal" className="mf-label">Foto principal</label>
            <input id="fotoPrincipal" type="file" accept="image/*" onChange={handleFotoPrincipalChange} className="mf-input" />
            {fotoPrincipalPreview && (
              <div className="mf-photo-row">
                <div className="mf-photo-box">
                  <img src={fotoPrincipalPreview} alt="Vista previa" style={{ width: '80px', height: '80px' }} />
                  <button type="button" onClick={removeFotoPrincipal} className="mf-remove-btn">×</button>
                </div>
              </div>
            )}
          </div>

          <div className="mf-field" style={{ marginTop: '0.75rem' }}>
            <label htmlFor="fotografias" className="mf-label">Fotografías adicionales</label>
            <input id="fotografias" type="file" accept="image/*" multiple onChange={handleFotografiasChange} className="mf-input" />
            <div className="mf-photo-row">
              {fotografiasPreviews.map((preview, index) => (
                <div key={index} className="mf-photo-box">
                  <img src={preview} alt={`Foto ${index + 1}`} style={{ width: '60px', height: '60px' }} />
                  <button type="button" onClick={() => removeFotografia(index)} className="mf-remove-btn">×</button>
                </div>
              ))}
            </div>
          </div>

          <button type="submit" disabled={loading} className="mf-submit">
            {loading ? 'Guardando...' : isEditing ? 'Actualizar mascota' : 'Publicar mascota'}
          </button>
        </form>
      </div>
    </div>
  );
};