import { Schema, model } from 'mongoose';
import type { HydratedDocument, Types } from 'mongoose';

export interface IRaza {
  tipoMascota: Types.ObjectId;
  nombreRaza: string;
  descripcion?: string;
  caracteristicas?: string;
  estado: boolean;
}

export type RazaDocument = HydratedDocument<IRaza>;

const razaSchema = new Schema<IRaza>(
  {
    tipoMascota: {
      type: Schema.Types.ObjectId,
      ref: 'TipoMascota',
      required: true,
    },
    nombreRaza: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    descripcion: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    caracteristicas: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    estado: {
      type: Boolean,
      default: true,
    },
  },
  {
    collection: 'razas',
    versionKey: false,
    timestamps: true,
  }
);

razaSchema.index({ tipoMascota: 1, nombreRaza: 1 }, { unique: true });
razaSchema.index({ tipoMascota: 1 });
razaSchema.index({ nombreRaza: 1 });

export const RazaModel = model<IRaza>('Raza', razaSchema);