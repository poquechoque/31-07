export type UserRole = 'oferente' | 'solicitante' | 'administrador';

export interface User {
  id: string;
  nombreUsuario: string;
  correo: string;
  rol: UserRole;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (correo: string, contrasena: string) => Promise<void>;
  logout: () => void;
  registerOferente: (data: any) => Promise<void>;
  registerSolicitante: (data: any) => Promise<void>;
}

export interface LoginCredentials {
  email: string;
  password: string;
}