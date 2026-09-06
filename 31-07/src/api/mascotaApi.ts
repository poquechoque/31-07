import apiClient from './client';

export interface Mascota {
  _id: string;
  oferente: { _id: string; nombres: string; apellidos: string; telefono: string };
  tipoMascota: { _id: string; nombreTipo: string };
  raza: { _id: string; nombreRaza: string };
  nombre: string;
  sexo: 'macho' | 'hembra';
  edadAproxMeses: number;
  tamano: 'pequeno' | 'mediano' | 'grande';
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
  estadoAdopcion: 'borrador' | 'pendiente' | 'publicado' | 'disponible' | 'adoptado' | 'cancelado';
  fechaRegistro: string;
  fechaPublicacion?: string;
  fechaAdopcion?: string;
  requisitos?: string;
  estado: boolean;
}

export interface CrearMascotaData {
  _id: string;
  tipoMascota: string;
  raza: string;
  nombre: string;
  sexo: 'macho' | 'hembra';
  edadAproxMeses: number;
  tamano: 'pequeno' | 'mediano' | 'grande';
  color: string;
  estadoSalud: string;
  ubicacion: string;
  comportamiento?: string;
  descripcionAdicional?: string;
  vacunado?: boolean;
  esterilizado?: boolean;
  desparasitado?: boolean;
  fotoPrincipal?: string;
  fotografias?: string[];
  requisitos?: string;
}

export interface FiltrosMascota {
  tipoMascota?: string;
  raza?: string;
  sexo?: 'macho' | 'hembra';
  tamano?: 'pequeno' | 'mediano' | 'grande';
  edadMin?: number;
  edadMax?: number;
  estadoAdopcion?: 'publicado' | 'pendiente' | 'adoptado';
  busqueda?: string;
}

export const mascotaApi = {
  listar: (filtros?: FiltrosMascota) =>
    apiClient.get<Mascota[]>('/mascotas', { params: filtros }),

  obtener: (id: string) =>
    apiClient.get<Mascota>(`/mascotas/${id}`),

  misMascotas: () =>
    apiClient.get<Mascota[]>('/mascotas/mis-mascotas'),

  crear: (data: CrearMascotaData) =>
    apiClient.post<Mascota>('/mascotas', data),

  actualizar: (id: string, data: Partial<CrearMascotaData>) =>
    apiClient.put<Mascota>(`/mascotas/${id}`, data),

  eliminar: (id: string) =>
    apiClient.delete<{ message: string }>(`/mascotas/${id}`),

  crearConImagen: (formData: FormData) =>
    apiClient.post<Mascota>('/mascotas', formData),

  actualizarConImagen: (id: string, formData: FormData) =>
    apiClient.put<Mascota>(`/mascotas/${id}`, formData),
};