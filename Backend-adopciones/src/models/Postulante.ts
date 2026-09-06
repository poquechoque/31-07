import { Schema, model } from 'mongoose';
import type { HydratedDocument, Types } from 'mongoose';

export type TipoVivienda = 'casa' | 'departamento' | 'habitacion' | 'otro';
export type TenenciaVivienda =
  | 'propia'
  | 'alquilada'
  | 'familiar'
  | 'anticretico'
  | 'otro';

export interface IPostulante {
  _id: Types.ObjectId;
  usuario: Types.ObjectId;
  nombres: string;
  apellidos: string;
  ci: string;
  fechaNacimiento: Date;
  edad: number;
  telefono: string;
  correo: string;
  direccion: string;
  ciudad: string;
  ocupacion: string;
  tipoVivienda: TipoVivienda;
  tenenciaVivienda: TenenciaVivienda;
  tienePatio: boolean;
  tieneOtrasMascotas: boolean;
  experienciaMascotas?: string;
  motivoAdopcion?: string;
  estado: boolean;
}

export type PostulanteDocument = HydratedDocument<IPostulante>;

const postulanteSchema = new Schema<IPostulante>(
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
    fechaNacimiento: {
      type: Date,
      required: true,
    },
    edad: {
      type: Number,
      required: true,
      min: 0,
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
    ocupacion: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    tipoVivienda: {
      type: String,
      required: true,
      enum: ['casa', 'departamento', 'habitacion', 'otro'],
      maxlength: 30,
    },
    tenenciaVivienda: {
      type: String,
      required: true,
      enum: ['propia', 'alquilada', 'familiar', 'anticretico', 'otro'],
      maxlength: 30,
    },
    tienePatio: {
      type: Boolean,
      default: false,
    },
    tieneOtrasMascotas: {
      type: Boolean,
      default: false,
    },
    experienciaMascotas: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    motivoAdopcion: {
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
    collection: 'postulantes',
    versionKey: false,
    timestamps: true,
  }
);

postulanteSchema.index({ usuario: 1 });
postulanteSchema.index({ ci: 1 });
postulanteSchema.index({ correo: 1 });

export const PostulanteModel = model<IPostulante>(
  'Postulante',
  postulanteSchema
);