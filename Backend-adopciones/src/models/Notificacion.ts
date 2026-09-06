import { Schema, model } from 'mongoose';
import type { HydratedDocument, Types } from 'mongoose';

export type TipoNotificacion = 
  | 'solicitud_nueva'
  | 'solicitud_aprobada'
  | 'solicitud_rechazada'
  | 'solicitud_cancelada'
  | 'adopcion_registrada'
  | 'seguimiento_nuevo'
  | 'mensaje'
  | 'sistema'
  | 'recordatorio';

export type PrioridadNotificacion = 'baja' | 'media' | 'alta';

export interface INotificacion {
  usuario: Types.ObjectId;
  tipo: TipoNotificacion;
  titulo: string;
  mensaje: string;
  enlace?: string;
  leido: boolean;
  fechaLectura?: Date;
  metadata?: Record<string, any>;
  prioridad: PrioridadNotificacion;
}

export type NotificacionDocument = HydratedDocument<INotificacion>;

const notificacionSchema = new Schema<INotificacion>(
  {
    usuario: {
      type: Schema.Types.ObjectId,
      ref: 'Usuario',
      required: true,
    },
    tipo: {
      type: String,
      required: true,
      enum: [
        'solicitud_nueva',
        'solicitud_aprobada',
        'solicitud_rechazada',
        'solicitud_cancelada',
        'adopcion_registrada',
        'seguimiento_nuevo',
        'mensaje',
        'sistema',
        'recordatorio',
      ],
      maxlength: 50,
    },
    titulo: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    mensaje: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    enlace: {
      type: String,
      trim: true,
      maxlength: 255,
      default: null,
    },
    leido: {
      type: Boolean,
      default: false,
    },
    fechaLectura: {
      type: Date,
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
    prioridad: {
      type: String,
      enum: ['baja', 'media', 'alta'],
      default: 'media',
      maxlength: 10,
    },
  },
  {
    collection: 'notificaciones',
    versionKey: false,
    timestamps: true,
  }
);

notificacionSchema.index({ usuario: 1 });
notificacionSchema.index({ leido: 1 });
notificacionSchema.index({ usuario: 1, leido: 1 });
notificacionSchema.index({ createdAt: -1 });
notificacionSchema.index({ tipo: 1 });

export const NotificacionModel = model<INotificacion>('Notificacion', notificacionSchema);