import { Schema, model } from 'mongoose';
import type { HydratedDocument, Types } from 'mongoose';

export type EstadoMascotaSeguimiento = 'excelente' | 'bien' | 'regular' | 'malo' | 'critico';
export type TipoSeguimiento = 'inicial' | 'mensual' | 'trimestral' | 'eventual';
export type RolRealizador = 'admin' | 'oferente' | 'veterinario';

export interface ISeguimiento {
  adopcion: Types.ObjectId;
  fechaSeguimiento: Date;
  tipo: TipoSeguimiento;
  estadoMascota: EstadoMascotaSeguimiento;
  descripcion: string;
  observaciones?: string;
  realizadoPor: Types.ObjectId;
  rolRealizador: RolRealizador;
  fotografias: string[];
  proximoSeguimiento?: Date;
}

export type SeguimientoDocument = HydratedDocument<ISeguimiento>;

const seguimientoSchema = new Schema<ISeguimiento>(
  {
    adopcion: {
      type: Schema.Types.ObjectId,
      ref: 'Adopcion',
      required: true,
    },
    fechaSeguimiento: {
      type: Date,
      default: Date.now,
    },
    tipo: {
      type: String,
      required: true,
      enum: ['inicial', 'mensual', 'trimestral', 'eventual'],
      maxlength: 30,
    },
    estadoMascota: {
      type: String,
      required: true,
      enum: ['excelente', 'bien', 'regular', 'malo', 'critico'],
      maxlength: 30,
    },
    descripcion: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    observaciones: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    realizadoPor: {
      type: Schema.Types.ObjectId,
      ref: 'Usuario',
      required: true,
    },
    rolRealizador: {
      type: String,
      required: true,
      enum: ['admin', 'oferente', 'veterinario'],
      default: 'admin',
      maxlength: 30,
    },
    fotografias: {
      type: [String],
      default: [],
    },
    proximoSeguimiento: {
      type: Date,
    },
  },
  {
    collection: 'seguimientos',
    versionKey: false,
    timestamps: true,
  }
);

seguimientoSchema.index({ adopcion: 1 });
seguimientoSchema.index({ fechaSeguimiento: -1 });
seguimientoSchema.index({ estadoMascota: 1 });
seguimientoSchema.index({ realizadoPor: 1 });

export const SeguimientoModel = model<ISeguimiento>('Seguimiento', seguimientoSchema);