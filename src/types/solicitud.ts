import type{ Mascota } from './mascota';

export interface Postulante {
  _id: string;
  usuario: string;
  nombres: string;
  apellidos: string;
  telefono: string;
  correo: string;
}

export interface SolicitudAdopcion {
  _id: string;
  postulante: Postulante;
  mascota: Mascota;
  oferente: string;
  fechaSolicitud: string;
  estadoSolicitud: 'pendiente' | 'aprobada' | 'rechazada' | 'cancelada';
  motivoPostulacion: string;
  tiempoDisponible?: string;
  tipoVivienda?: string;
  experienciaPrevia?: boolean;
  tieneOtrosAnimales?: boolean;
  tieneHijos?: boolean;
  presupuestoMensual?: string;
  compromiso?: string;
  fechaRespuesta?: string;
}