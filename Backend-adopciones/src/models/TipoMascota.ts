import { Schema, model } from 'mongoose';
import type { HydratedDocument } from 'mongoose';

export interface ITipoMascota {
  nombreTipo: string;
  descripcion?: string;
  icono?: string;
  estado: boolean;
}

export type TipoMascotaDocument = HydratedDocument<ITipoMascota>;

const tipoMascotaSchema = new Schema<ITipoMascota>(
  {
    nombreTipo: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      maxlength: 50,
    },
    descripcion: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    icono: {
      type: String,
      trim: true,
      maxlength: 255,
    },
    estado: {
      type: Boolean,
      default: true,
    },
  },
  {
    collection: 'tipos_mascota',
    versionKey: false,
    timestamps: true,
  }
);

export const TipoMascotaModel = model<ITipoMascota>(
  'TipoMascota',
  tipoMascotaSchema
);