import { Schema, model } from 'mongoose';
import type { HydratedDocument, Types } from 'mongoose';

export type SexoMascota = 'macho' | 'hembra';
export type TamanoMascota = 'pequeno' | 'mediano' | 'grande';
export type EstadoAdopcionMascota =
  | 'borrador'
  | 'pendiente'
  | 'publicado'
  | 'disponible'
  | 'adoptado'
  | 'cancelado';

export interface IMascota {
    _id: Types.ObjectId;
  oferente: Types.ObjectId;
  tipoMascota: Types.ObjectId;
  raza: Types.ObjectId;
  nombre: string;
  sexo: SexoMascota;
  fechaNacimientoAprox?: Date;
  edadAproxMeses: number;
  tamano: TamanoMascota;
  pesoKg?: number;
  color: string;
  estadoSalud: string;
  comportamiento?: string;
  descripcionAdicional?: string;
  ubicacion: string;
  vacunado: boolean;
  esterilizado: boolean;
  desparasitado: boolean;
  fotoPrincipal?: string;
  fotografias: string[];
  estadoAdopcion: EstadoAdopcionMascota;
  fechaRegistro: Date;
  fechaPublicacion?: Date;
  fechaAdopcion?: Date;
  requisitos?: string;
  estado: boolean;
}

export type MascotaDocument = HydratedDocument<IMascota>;

const mascotaSchema = new Schema<IMascota>(
  {
    oferente: {
      type: Schema.Types.ObjectId,
      ref: 'Oferente',
      required: true,
    },
    tipoMascota: {
      type: Schema.Types.ObjectId,
      ref: 'TipoMascota',
      required: true,
    },
    raza: {
      type: Schema.Types.ObjectId,
      ref: 'Raza',
      required: true,
    },
    nombre: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    sexo: {
      type: String,
      required: true,
      enum: ['macho', 'hembra'],
      maxlength: 10,
    },
    fechaNacimientoAprox: {
      type: Date,
    },
    edadAproxMeses: {
      type: Number,
      required: true,
      min: 0,
    },
    tamano: {
      type: String,
      required: true,
      enum: ['pequeno', 'mediano', 'grande'],
      maxlength: 20,
    },
    pesoKg: {
      type: Number,
      min: 0,
    },
    color: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    estadoSalud: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    comportamiento: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    descripcionAdicional: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    ubicacion: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },
    vacunado: {
      type: Boolean,
      default: false,
    },
    esterilizado: {
      type: Boolean,
      default: false,
    },
    desparasitado: {
      type: Boolean,
      default: false,
    },
    fotoPrincipal: {
      type: String,
      trim: true,
      maxlength: 255,
    },
    fotografias: {
      type: [String],
      default: [],
    },
    estadoAdopcion: {
      type: String,
      required: true,
      enum: ['borrador', 'pendiente', 'publicado', 'adoptado', 'cancelado', 'disponible'],
      default: 'borrador',
      maxlength: 30,
    },
    fechaRegistro: {
      type: Date,
      default: Date.now,
    },
    fechaPublicacion: {
      type: Date,
    },
    fechaAdopcion: {
      type: Date,
    },
    requisitos: {
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
    collection: 'mascotas',
    versionKey: false,
    timestamps: true,
  }
);

// Índices
mascotaSchema.index({ tipoMascota: 1 });
mascotaSchema.index({ raza: 1 });
mascotaSchema.index({ oferente: 1 });
mascotaSchema.index({ estadoAdopcion: 1 });
mascotaSchema.index({ ubicacion: 1 });
mascotaSchema.index({ tipoMascota: 1, estadoAdopcion: 1 });
mascotaSchema.index({ estadoAdopcion: 1, fechaRegistro: -1 });

export const MascotaModel = model<IMascota>('Mascota', mascotaSchema);