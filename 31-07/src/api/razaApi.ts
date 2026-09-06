import apiClient from './client';

export interface Raza {
  _id: string;
  tipoMascota: string | { _id: string; nombreTipo: string };
  nombreRaza: string;
  descripcion?: string;
  estado: boolean;
}

export const razaApi = {
  listar: (tipoMascota?: string) =>
    apiClient.get<Raza[]>('/razas', { params: { tipoMascota } }),

  crear: (data: { tipoMascota: string; nombreRaza: string; descripcion?: string }) =>
    apiClient.post<Raza>('/razas', data),

  actualizar: (id: string, data: { nombreRaza?: string; descripcion?: string }) =>
    apiClient.put<Raza>(`/razas/${id}`, data),

  eliminar: (id: string) =>
    apiClient.delete<{ message: string }>(`/razas/${id}`),
};