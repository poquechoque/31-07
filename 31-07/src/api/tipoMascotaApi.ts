import apiClient from './client';

export interface TipoMascota {
  _id: string;
  nombreTipo: string;
  descripcion?: string;
  estado: boolean;
}

export const tipoMascotaApi = {
  listar: () =>
    apiClient.get<TipoMascota[]>('/tipos-mascota'),

  crear: (data: { nombreTipo: string; descripcion?: string }) =>
    apiClient.post<TipoMascota>('/tipos-mascota', data),

  actualizar: (id: string, data: { nombreTipo?: string; descripcion?: string }) =>
    apiClient.put<TipoMascota>(`/tipos-mascota/${id}`, data),

  eliminar: (id: string) =>
    apiClient.delete<{ message: string }>(`/tipos-mascota/${id}`),
};