import apiClient from './client';

export interface Adopcion {
  _id: string;
  solicitante: {
    _id: string;
    nombres: string;
    apellidos: string;
    telefono: string;
    correo: string;
  };
  oferente: {
    _id: string;
    nombres: string;
    apellidos: string;
    telefono: string;
    correo?: string;
  };
  mascota: {
    _id: string;
    nombre: string;
    fotoPrincipal?: string;
    raza?: { nombreRaza: string };
    tipoMascota?: { nombreTipo: string };
    edadAproxMeses?: number;
    tamano?: string;
    color?: string;
    ubicacion?: string;
  };
  solicitud: {
    _id: string;
    estadoSolicitud: string;
    fechaSolicitud: string;
    motivoPostulacion: string;
  };
  fechaAdopcion: string;
  estado: 'activa' | 'finalizada' | 'cancelada';  
  observaciones?: string;
  createdAt: string;
  updatedAt: string;
}

export const adopcionApi = {
  listar: () =>
    apiClient.get<Adopcion[]>('/adopciones'),

  misAdopciones: () =>
    apiClient.get<Adopcion[]>('/adopciones/mis-adopciones'),

  obtener: (id: string) =>
    apiClient.get<Adopcion>(`/adopciones/${id}`),

  registrar: (data: { solicitudId: string; condicionesAdopcion?: string; compromisoFirmado?: boolean; fechaEntrega?: string }) =>
    apiClient.post<Adopcion>('/adopciones', data),

  actualizarEstado: (id: string, estadoAdopcion: 'activa' | 'anulada' | 'finalizada', observaciones?: string) =>
    apiClient.put<{ message: string }>(`/adopciones/${id}/estado`, { estadoAdopcion, observaciones }),

  eliminar: (id: string) =>
    apiClient.delete<{ message: string }>(`/adopciones/${id}`),
};