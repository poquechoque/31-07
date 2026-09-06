import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { solicitudApi } from '../../api/solicitudApi';
import { mascotaApi } from '../../api/mascotaApi';
import type { Mascota } from '../../types/mascota';

import {
  FaPaw,
  FaDog,
  FaClock,
  FaHome,
  FaMoneyBillWave,
  FaHeart,
  FaFileAlt,
  FaArrowLeft,
  FaPaperPlane,
  FaInfoCircle,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaVenusMars,
  FaCheck,
} from 'react-icons/fa';

const solicitudSchema = z.object({
  motivoPostulacion: z.string().min(10, 'El motivo debe tener al menos 10 caracteres'),
  tiempoDisponible: z.string().min(1, 'Selecciona el tiempo disponible'),
  tipoVivienda: z.string().min(1, 'Selecciona el tipo de vivienda'),
  experienciaPrevia: z.boolean().default(false),
  tieneOtrosAnimales: z.boolean().default(false),
  tieneHijos: z.boolean().default(false),
  presupuestoMensual: z.string().min(1, 'Selecciona el presupuesto'),
  compromiso: z.string().min(1, 'Selecciona el nivel de compromiso'),
  razonAdopcion: z.string().optional().default(''),
});

type SolicitudFormData = z.infer<typeof solicitudSchema>;

function NuevaSolicitudPage() {
  const { mascotaId } = useParams<{ mascotaId: string }>();
  const navigate = useNavigate();
  const [mascota, setMascota] = useState<Mascota | null>(null);
  const [loading, setLoading] = useState(true);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SolicitudFormData>({
    resolver: zodResolver(solicitudSchema) as any,
    defaultValues: {
      experienciaPrevia: false,
      tieneOtrosAnimales: false,
      tieneHijos: false,
      motivoPostulacion: '',
      tiempoDisponible: '',
      tipoVivienda: '',
      presupuestoMensual: '',
      compromiso: '',
      razonAdopcion: '',
    },
  });

  useEffect(() => {
    const cargarMascota = async () => {
      if (!mascotaId) return;
      try {
        const res = await mascotaApi.obtener(mascotaId);
        setMascota(res.data);
      } catch (error) {
        toast.error('Error al cargar la mascota');
        navigate('/mascotas');
      } finally {
        setLoading(false);
      }
    };
    cargarMascota();
  }, [mascotaId, navigate]);

  const onSubmit = async (data: SolicitudFormData) => {
    if (!mascotaId) return;

    try {
      await solicitudApi.crear({
        mascotaId,
        ...data,
      });
      toast.success('¡Solicitud enviada exitosamente!');
      navigate('/mis-solicitudes');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al enviar solicitud';
      toast.error(message);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center' }}>
        <FaPaw style={{ fontSize: '2.2rem', color: '#3B82F6', animation: 'ns-spin 1s linear infinite' }} />
        <p style={{ marginTop: '1rem', color: '#64748B' }}>Cargando...</p>
        <style>{`@keyframes ns-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!mascota) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center' }}>
        <FaDog style={{ fontSize: '3rem', color: '#CBD5E1' }} />
        <p style={{ marginTop: '1rem', color: '#1E293B' }}>Mascota no encontrada</p>
        
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '760px', margin: '0 auto', padding: '2rem 1rem 3rem' }}>
      <style>{`
        @keyframes ns-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

        .ns-back {
          display: inline-flex; align-items: center; gap: 0.4rem;
          color: #64748B; text-decoration: none; font-size: 0.88rem; font-weight: 500;
          margin-bottom: 1.25rem; transition: color 0.15s;
        }
        .ns-back:hover { color: #3B82F6; }

        .ns-header { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.5rem; }
        .ns-header-icon {
          width: 44px; height: 44px; border-radius: 12px; background: #EFF6FF;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .ns-title { margin: 0; color: #0F172A; font-size: 1.4rem; font-weight: 700; }
        .ns-title-sub { margin: 0.15rem 0 0; color: #64748B; font-size: 0.88rem; }

        .ns-mascota-card {
          display: flex; gap: 1.25rem; padding: 1.25rem; margin-bottom: 1.5rem;
          background: white; border-radius: 18px; border: 1px solid #E2E8F0;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05); flex-wrap: wrap;
        }
        .ns-mascota-img { width: 96px; height: 96px; object-fit: cover; border-radius: 14px; flex-shrink: 0; }
        .ns-mascota-name { margin: 0; color: #0F172A; font-size: 1.1rem; font-weight: 700; display: flex; align-items: center; gap: 0.5rem; }
        .ns-mascota-meta { display: flex; flex-wrap: wrap; gap: 0.4rem 1rem; margin-top: 0.5rem; }
        .ns-mascota-meta span { display: flex; align-items: center; gap: 0.3rem; color: #64748B; font-size: 0.83rem; }
        .ns-estado-chip {
          display: inline-flex; align-items: center; gap: 0.3rem; margin-top: 0.6rem;
          padding: 0.25rem 0.65rem; border-radius: 20px; background: #D1FAE5; color: #065F46;
          font-size: 0.75rem; font-weight: 600; width: fit-content;
        }

        .ns-form-card {
          background: white; border-radius: 18px; border: 1px solid #E2E8F0;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05); padding: 1.75rem;
        }
        .ns-intro {
          display: flex; align-items: center; gap: 0.5rem; color: #64748B; font-size: 0.88rem;
          margin: 0 0 1.5rem; padding-bottom: 1.25rem; border-bottom: 1px solid #F1F5F9;
        }
        .ns-section-title {
          font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;
          color: #94A3B8; margin: 1.75rem 0 0.9rem;
        }
        .ns-section-title:first-of-type { margin-top: 0; }

        .ns-field { display: flex; flex-direction: column; margin-bottom: 1.1rem; }
        .ns-label {
          display: flex; align-items: center; gap: 0.4rem; font-size: 0.86rem;
          font-weight: 600; color: #334155; margin-bottom: 0.45rem;
        }
        .ns-icon-blue { color: #3B82F6; font-size: 0.85rem; flex-shrink: 0; }

        .ns-textarea, .ns-select {
          width: 100%; box-sizing: border-box; padding: 0.7rem 0.9rem;
          border-radius: 10px; border: 1px solid #E2E8F0; font-size: 0.9rem;
          color: #0F172A; background: white; font-family: inherit;
        }
        .ns-textarea:focus, .ns-select:focus { outline: none; border-color: #3B82F6; box-shadow: 0 0 0 3px #EFF6FF; }
        .ns-textarea { resize: vertical; }
        .ns-error { color: #DC2626; font-size: 0.78rem; margin-top: 0.35rem; }

        .ns-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }

        .ns-chips { display: flex; flex-wrap: wrap; gap: 0.6rem; }
        .ns-chip {
          display: flex; align-items: center; gap: 0.5rem; cursor: pointer;
          padding: 0.6rem 1rem; border: 1px solid #E2E8F0; border-radius: 12px;
          font-size: 0.86rem; color: #334155; transition: all 0.15s; background: white;
          flex: 1 1 220px;
        }
        .ns-chip:hover { border-color: #93C5FD; background: #F8FAFC; }
        .ns-chip input { accent-color: #3B82F6; width: 16px; height: 16px; flex-shrink: 0; }

        .ns-submit {
          width: 100%; margin-top: 1.75rem; padding: 0.85rem; border: none; border-radius: 12px;
          background: #3B82F6; color: white; font-size: 0.98rem; font-weight: 700;
          cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem;
          transition: background 0.15s;
        }
        .ns-submit:hover:not(:disabled) { background: #2563EB; }
        .ns-submit:disabled { background: #93C5FD; cursor: not-allowed; }

        @media (max-width: 600px) {
          .ns-grid-2 { grid-template-columns: 1fr; }
          .ns-form-card { padding: 1.25rem; }
          .ns-mascota-card { padding: 1rem; }
        }
      `}</style>

   

      {/* Header */}
      <div className="ns-header">
        <div className="ns-header-icon">
          <FaPaperPlane style={{ fontSize: '1.15rem', color: '#3B82F6' }} />
        </div>
        <div>
          <h1 className="ns-title">Solicitar adopción de {mascota.nombre}</h1>
          <p className="ns-title-sub">Cuéntanos sobre ti para completar el proceso</p>
        </div>
      </div>

      {/* Información de la mascota */}
      <div className="ns-mascota-card">
        <img
          src={mascota.fotoPrincipal || '/placeholder-dog.jpg'}
          alt={mascota.nombre}
          className="ns-mascota-img"
          onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder-dog.jpg'; }}
        />
        <div style={{ flex: 1, minWidth: '180px' }}>
          <h2 className="ns-mascota-name">
            <FaDog style={{ color: '#3B82F6' }} />
            {mascota.nombre}
          </h2>
          <div className="ns-mascota-meta">
            <span><FaPaw size={11} /> {mascota.raza?.nombreRaza || 'Sin raza'}</span>
            <span><FaCalendarAlt size={11} /> {mascota.edadAproxMeses} meses</span>
            <span><FaVenusMars size={11} /> {mascota.sexo === 'macho' ? 'Macho' : 'Hembra'}</span>
            <span><FaMapMarkerAlt size={11} /> {mascota.ubicacion}</span>
          </div>
          <span className="ns-estado-chip">
            <FaCheck size={10} />
            Disponible
          </span>
        </div>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit(onSubmit)} className="ns-form-card">
        <p className="ns-intro">
          <FaInfoCircle style={{ color: '#3B82F6' }} />
          Completa el formulario para solicitar la adopción
        </p>

        <p className="ns-section-title">Tu motivación</p>

        <div className="ns-field">
          <label htmlFor="motivoPostulacion" className="ns-label">
            <FaHeart className="ns-icon-blue" />
            ¿Por qué quieres adoptar? *
          </label>
          <textarea
            id="motivoPostulacion"
            {...register('motivoPostulacion')}
            rows={3}
            className="ns-textarea"
            placeholder="Cuéntanos por qué quieres adoptar a esta mascota..."
          />
          {errors.motivoPostulacion && <p className="ns-error">{errors.motivoPostulacion.message}</p>}
        </div>

        <p className="ns-section-title">Tu situación</p>

        <div className="ns-grid-2">
          <div className="ns-field">
            <label htmlFor="tiempoDisponible" className="ns-label">
              <FaClock className="ns-icon-blue" />
              Tiempo disponible *
            </label>
            <select id="tiempoDisponible" {...register('tiempoDisponible')} className="ns-select">
              <option value="">Selecciona...</option>
              <option value="menos_1_hora">Menos de 1 hora al día</option>
              <option value="1_3_horas">1-3 horas al día</option>
              <option value="3_5_horas">3-5 horas al día</option>
              <option value="mas_5_horas">Más de 5 horas al día</option>
            </select>
            {errors.tiempoDisponible && <p className="ns-error">{errors.tiempoDisponible.message}</p>}
          </div>

          <div className="ns-field">
            <label htmlFor="tipoVivienda" className="ns-label">
              <FaHome className="ns-icon-blue" />
              Tipo de vivienda *
            </label>
            <select id="tipoVivienda" {...register('tipoVivienda')} className="ns-select">
              <option value="">Selecciona...</option>
              <option value="casa_patio">Casa con patio</option>
              <option value="casa_jardin">Casa con jardín</option>
              <option value="departamento">Departamento</option>
              <option value="casa_pequena">Casa pequeña</option>
            </select>
            {errors.tipoVivienda && <p className="ns-error">{errors.tipoVivienda.message}</p>}
          </div>
        </div>

        <div className="ns-grid-2">
          <div className="ns-field">
            <label htmlFor="presupuestoMensual" className="ns-label">
              <FaMoneyBillWave className="ns-icon-blue" />
              Presupuesto mensual *
            </label>
            <select id="presupuestoMensual" {...register('presupuestoMensual')} className="ns-select">
              <option value="">Selecciona...</option>
              <option value="menos_100">Menos de Bs. 100</option>
              <option value="100_300">Bs. 100 - 300</option>
              <option value="300_500">Bs. 300 - 500</option>
              <option value="mas_500">Más de Bs. 500</option>
            </select>
            {errors.presupuestoMensual && <p className="ns-error">{errors.presupuestoMensual.message}</p>}
          </div>

          <div className="ns-field">
            <label htmlFor="compromiso" className="ns-label">
              <FaHeart className="ns-icon-blue" />
              Nivel de compromiso *
            </label>
            <select id="compromiso" {...register('compromiso')} className="ns-select">
              <option value="">Selecciona...</option>
              <option value="bajo">Bajo</option>
              <option value="medio">Medio</option>
              <option value="alto">Alto</option>
            </select>
            {errors.compromiso && <p className="ns-error">{errors.compromiso.message}</p>}
          </div>
        </div>

        <p className="ns-section-title">Sobre tu hogar</p>

        <div className="ns-chips">
          <label className="ns-chip">
            <input type="checkbox" {...register('experienciaPrevia')} />
            <FaPaw style={{ color: '#3B82F6', fontSize: '0.8rem' }} />
            Experiencia previa con mascotas
          </label>
          <label className="ns-chip">
            <input type="checkbox" {...register('tieneOtrosAnimales')} />
            <FaDog style={{ color: '#3B82F6', fontSize: '0.8rem' }} />
            Tengo otras mascotas
          </label>
          <label className="ns-chip">
            <input type="checkbox" {...register('tieneHijos')} />
            <FaHome style={{ color: '#3B82F6', fontSize: '0.8rem' }} />
            Tengo hijos
          </label>
        </div>

        <p className="ns-section-title">Algo más que quieras contarnos</p>

        <div className="ns-field" style={{ marginBottom: 0 }}>
          <label htmlFor="razonAdopcion" className="ns-label">
            <FaFileAlt className="ns-icon-blue" />
            Razón adicional para adoptar
          </label>
          <textarea
            id="razonAdopcion"
            {...register('razonAdopcion')}
            rows={2}
            className="ns-textarea"
            placeholder="Cuéntanos más sobre por qué quieres adoptar..."
          />
        </div>

        <button type="submit" disabled={isSubmitting} className="ns-submit">
          {isSubmitting ? (
            <>
              <FaPaw style={{ animation: 'ns-spin 1s linear infinite' }} />
              Enviando...
            </>
          ) : (
            <>
              <FaPaperPlane />
              Enviar solicitud
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default NuevaSolicitudPage;