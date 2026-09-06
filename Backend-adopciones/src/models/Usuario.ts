import { Schema, model } from 'mongoose';
import type { HydratedDocument } from 'mongoose';

export type RolUsuario = 'oferente' | 'solicitante' | 'administrador';

export interface IUsuario {
  nombreUsuario: string;
  correo: string;
  contrasena: string;
  rol: RolUsuario;
  estado: boolean;
  fechaRegistro: Date;
  ultimoAcceso?: Date;
}

export type UsuarioDocument = HydratedDocument<IUsuario>;

const usuarioSchema = new Schema<IUsuario>(
  {
    nombreUsuario: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    correo: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 100,
    },
    contrasena: {
      type: String,
      required: true,
      maxlength: 255,
      select: false,
    },
    rol: {
      type: String,
      required: true,
      enum: ['oferente', 'solicitante', 'administrador'],
      maxlength: 30,
    },
    estado: {
      type: Boolean,
      default: true,
    },
    fechaRegistro: {
      type: Date,
      default: Date.now,
    },
    ultimoAcceso: {
      type: Date,
    },
  },
  {
    collection: 'usuarios',
    versionKey: false,
    timestamps: true,
  }
);

usuarioSchema.index({ correo: 1 });
usuarioSchema.index({ rol: 1 });

export const UsuarioModel = model<IUsuario>('Usuario', usuarioSchema);