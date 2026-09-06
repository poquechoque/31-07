import type{ Mascota } from './mascota';
import type{ Postulante } from './solicitud';

export interface Adopcion {
  _id: string;
  solicitud: string;
  mascota: Mascota;
  oferente: { _id: string; nombres: string; apellidos: string };
  adoptante: Postulante;
  fechaAdopcion: string;
  fechaEntrega?: string;
  condicionesAdopcion?: string;
  compromisoFirmado: boolean;
  estadoAdopcion: 'activa' | 'anulada' | 'finalizada';
  observaciones?: string;
}