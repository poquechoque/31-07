import apiClient from './client';

export interface Estadisticas {
  totalUsuarios: number;
  totalMascotas: number;
  totalSolicitudes: number;
  totalAdopciones: number;
  mascotasPublicadas: number;
  mascotasAdoptadas: number;
  solicitudesPendientes: number;
  usuariosPorRol: Array<{ _id: string; count: number }>;
  adopcionesPorMes: Array<{ _id: { year: number; month: number }; count: number }>;
}

export const reporteApi = {
  estadisticas: () =>
    apiClient.get<Estadisticas>('/reportes/estadisticas'),

  adopciones: (params?: { fechaInicio?: string; fechaFin?: string; estado?: string }) =>
    apiClient.get('/reportes/adopciones', { params }),

  mascotas: (params?: { estadoAdopcion?: string; tipoMascota?: string }) =>
    apiClient.get('/reportes/mascotas', { params }),

  solicitudes: (params?: { estadoSolicitud?: string; fechaInicio?: string; fechaFin?: string }) =>
    apiClient.get('/reportes/solicitudes', { params }),
};