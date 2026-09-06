import apiClient from './client';

export interface RegistroOferenteData {
  nombreUsuario: string;
  correo: string;
  contrasena: string;
  rol: 'oferente';
  nombres: string;
  apellidos: string;
  ci: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  tipoOferente: 'persona' | 'rescatista' | 'organizacion';
}

export interface RegistroSolicitanteData {
  nombreUsuario: string;
  correo: string;
  contrasena: string;
  rol: 'solicitante';
  nombres: string;
  apellidos: string;
  ci: string;
  fechaNacimiento: string;
  edad: number;
  telefono: string;
  direccion: string;
  ciudad: string;
  ocupacion: string;
  tipoVivienda: 'casa' | 'departamento' | 'habitacion' | 'otro';
  tenenciaVivienda: 'propia' | 'alquilada' | 'familiar' | 'anticretico' | 'otro';
  tienePatio: boolean;
  tieneOtrasMascotas: boolean;
}

export interface LoginCredentials {
  correo: string;
  contrasena: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  usuario: {
    id: string;
    nombreUsuario: string;
    correo: string;
    rol: 'oferente' | 'solicitante' | 'administrador';
  };
}

export const authApi = {
  registroOferente: (data: RegistroOferenteData) =>
    apiClient.post<{ message: string; token: string; usuario: any }>('/auth/registro', data),

  registroSolicitante: (data: RegistroSolicitanteData) =>
    apiClient.post<{ message: string; token: string; usuario: any }>('/auth/registro', data),

  login: (credentials: LoginCredentials) =>
    apiClient.post<LoginResponse>('/auth/login', credentials),

  perfil: () =>
    apiClient.get('/auth/perfil'),

  cambiarContrasena: (data: { contrasenaActual: string; nuevaContrasena: string }) =>
    apiClient.put('/auth/cambiar-contrasena', data),
};