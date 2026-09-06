import { Schema, model } from 'mongoose';
import type { HydratedDocument, Types } from 'mongoose';

export type TipoOferente = 'persona' | 'rescatista' | 'organizacion';

export interface IOferente {
  _id: Types.ObjectId;
  usuario: Types.ObjectId;
  nombres: string;
  apellidos: string;
  ci: string;
  telefono: string;
  correo: string;
  direccion: string;
  ciudad: string;
  tipoOferente: TipoOferente;
  estado: boolean;
}

export type OferenteDocument = HydratedDocument<IOferente>;

const oferenteSchema = new Schema<IOferente>(
  {
    usuario: {
      type: Schema.Types.ObjectId,
      ref: 'Usuario',
      required: true,
      unique: true,
    },
    nombres: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    apellidos: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    ci: {
      type: String,
      required: true,
      trim: true,
      maxlength: 20,
    },
    telefono: {
      type: String,
      required: true,
      trim: true,
      maxlength: 20,
    },
    correo: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      maxlength: 100,
    },
    direccion: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },
    ciudad: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
      default: 'Sucre',
    },
    tipoOferente: {
      type: String,
      required: true,
      enum: ['persona', 'rescatista', 'organizacion'],
      maxlength: 30,
    },
    estado: {
      type: Boolean,
      default: true,
    },
  },
  {
    collection: 'oferentes',
    versionKey: false,
    timestamps: true,
  }
);

oferenteSchema.index({ usuario: 1 });
oferenteSchema.index({ ci: 1 });
oferenteSchema.index({ correo: 1 });

export const OferenteModel = model<IOferente>('Oferente', oferenteSchema);