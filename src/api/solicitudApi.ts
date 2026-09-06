import apiClient from './client';

export interface SolicitudAdopcion {
  _id: string;
  postulante: {
    _id: string;
    nombres: string;
    apellidos: string;
    telefono: string;
    correo: string;
  };
  mascota: {
    _id: string;
    nombre: string;
    fotoPrincipal?: string;
  };
  oferente: { _id: string };
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

export interface CrearSolicitudData {
  mascotaId: string;
  motivoPostulacion: string;
  tiempoDisponible?: string;
  tipoVivienda?: string;
  experienciaPrevia?: boolean;
  tieneOtrosAnimales?: boolean;
  tieneHijos?: boolean;
  presupuestoMensual?: string;
  compromiso?: string;
  razonAdopcion?: string;
}

export const solicitudApi = {
  misSolicitudes: () =>
    apiClient.get<SolicitudAdopcion[]>('/solicitudes/mis-solicitudes'),

  recibidas: () =>
    apiClient.get<SolicitudAdopcion[]>('/solicitudes/recibidas'),

  obtener: (id: string) =>
    apiClient.get<SolicitudAdopcion>(`/solicitudes/${id}`),

  crear: (data: CrearSolicitudData) =>
    apiClient.post<SolicitudAdopcion>('/solicitudes', data),

  responder: (id: string, accion: 'aprobada' | 'rechazada', observaciones?: string) =>
    apiClient.put<{ message: string }>(`/solicitudes/${id}/responder`, { accion, observaciones }),

  cancelar: (id: string) =>
    apiClient.put<{ message: string }>(`/solicitudes/${id}/cancelar`),
};