import { Schema, model } from 'mongoose';
import type { HydratedDocument, Types } from 'mongoose';

export type EstadoSolicitudAdopcion =
  | 'pendiente'
  | 'aprobada'
  | 'rechazada'
  | 'cancelada';

export type TiempoDisponible = 'menos_1_hora' | '1_3_horas' | '3_5_horas' | 'mas_5_horas';
export type TipoViviendaSolicitud = 'casa_patio' | 'casa_jardin' | 'departamento' | 'casa_pequena';
export type PresupuestoMensual = 'menos_100' | '100_300' | '300_500' | 'mas_500';
export type NivelCompromiso = 'bajo' | 'medio' | 'alto';

export interface ISolicitudAdopcion {
   _id: Types.ObjectId;
  postulante: Types.ObjectId;
  mascota: Types.ObjectId;
  oferente: Types.ObjectId;
  fechaSolicitud: Date;
  estadoSolicitud: EstadoSolicitudAdopcion;
  motivoPostulacion: string;
  // Evaluación (según documento Capítulo I, página 11)
  tiempoDisponible?: TiempoDisponible;
  tipoVivienda?: TipoViviendaSolicitud;
  experienciaPrevia?: boolean;
  tieneOtrosAnimales?: boolean;
  otrosAnimalesDescripcion?: string;
  tieneHijos?: boolean;
  edadesHijos?: string;
  presupuestoMensual?: PresupuestoMensual;
  compromiso?: NivelCompromiso;
  razonAdopcion?: string;
  // Resultados
  resultadoEvaluacion?: string;
  puntajeEvaluacion?: number;
  entrevistaRealizada: boolean;
  visitaDomiciliaria: boolean;
  observaciones?: string;
  comentarioOferente?: string;
  fechaRespuesta?: Date;
}

export type SolicitudAdopcionDocument = HydratedDocument<ISolicitudAdopcion>;

const solicitudAdopcionSchema = new Schema<ISolicitudAdopcion>(
  {
    postulante: {
      type: Schema.Types.ObjectId,
      ref: 'Postulante',
      required: true,
    },
    mascota: {
      type: Schema.Types.ObjectId,
      ref: 'Mascota',
      required: true,
    },
    oferente: {
      type: Schema.Types.ObjectId,
      ref: 'Oferente',
      required: true,
    },
    fechaSolicitud: {
      type: Date,
      default: Date.now,
    },
    estadoSolicitud: {
      type: String,
      required: true,
      enum: ['pendiente', 'aprobada', 'rechazada', 'cancelada'],
      default: 'pendiente',
      maxlength: 30,
    },
    motivoPostulacion: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    // Evaluación - según documento
    tiempoDisponible: {
      type: String,
      enum: ['menos_1_hora', '1_3_horas', '3_5_horas', 'mas_5_horas'],
      maxlength: 30,
    },
    tipoVivienda: {
      type: String,
      enum: ['casa_patio', 'casa_jardin', 'departamento', 'casa_pequena'],
      maxlength: 30,
    },
    experienciaPrevia: {
      type: Boolean,
      default: false,
    },
    tieneOtrosAnimales: {
      type: Boolean,
      default: false,
    },
    otrosAnimalesDescripcion: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    tieneHijos: {
      type: Boolean,
      default: false,
    },
    edadesHijos: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    presupuestoMensual: {
      type: String,
      enum: ['menos_100', '100_300', '300_500', 'mas_500'],
      maxlength: 30,
    },
    compromiso: {
      type: String,
      enum: ['bajo', 'medio', 'alto'],
      maxlength: 30,
    },
    razonAdopcion: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    resultadoEvaluacion: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    puntajeEvaluacion: {
      type: Number,
      min: 0,
      max: 100,
    },
    entrevistaRealizada: {
      type: Boolean,
      default: false,
    },
    visitaDomiciliaria: {
      type: Boolean,
      default: false,
    },
    observaciones: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    comentarioOferente: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    fechaRespuesta: {
      type: Date,
    },
  },
  {
    collection: 'solicitudes_adopcion',
    versionKey: false,
    timestamps: true,
  }
);

// Índices
solicitudAdopcionSchema.index({ postulante: 1, mascota: 1 }, { unique: true });
solicitudAdopcionSchema.index({ mascota: 1 });
solicitudAdopcionSchema.index({ oferente: 1 });
solicitudAdopcionSchema.index({ estadoSolicitud: 1 });
solicitudAdopcionSchema.index({ fechaSolicitud: -1 });

export const SolicitudAdopcionModel = model<ISolicitudAdopcion>(
  'SolicitudAdopcion',
  solicitudAdopcionSchema
);