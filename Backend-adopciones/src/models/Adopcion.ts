import { Schema, model, Types } from 'mongoose';

export interface IAdopcion {
  _id: Types.ObjectId;
  solicitante: Types.ObjectId;  // Usuario que adoptó (Postulante)
  oferente: Types.ObjectId;     // Usuario que ofreció (Oferente)
  mascota: Types.ObjectId;      // Mascota adoptada
  solicitud: Types.ObjectId;    // Solicitud que originó la adopción
  fechaAdopcion: Date;
  estado: 'activa' | 'finalizada' | 'cancelada';
  observaciones?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AdopcionSchema = new Schema<IAdopcion>(
  {
    solicitante: {
      type: Schema.Types.ObjectId,
      ref: 'Postulante',
      required: true,
    },
    oferente: {
      type: Schema.Types.ObjectId,
      ref: 'Oferente',
      required: true,
    },
    mascota: {
      type: Schema.Types.ObjectId,
      ref: 'Mascota',
      required: true,
    },
    solicitud: {
      type: Schema.Types.ObjectId,
      ref: 'SolicitudAdopcion',
      required: true,
    },
    fechaAdopcion: {
      type: Date,
      default: Date.now,
    },
    estado: {
      type: String,
      enum: ['activa', 'finalizada', 'cancelada'],
      default: 'activa',
    },
    observaciones: {
      type: String,
      trim: true,
      maxlength: 500,
    },
  },
  {
    collection: 'adopciones',
    versionKey: false,
    timestamps: true,
  }
);

AdopcionSchema.index({ solicitante: 1 });
AdopcionSchema.index({ oferente: 1 });
AdopcionSchema.index({ mascota: 1 });
AdopcionSchema.index({ solicitud: 1 });
AdopcionSchema.index({ estado: 1 });

export const AdopcionModel = model<IAdopcion>('Adopcion', AdopcionSchema);