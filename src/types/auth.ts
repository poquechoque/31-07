export type UserRole = "ADMIN" | "USUARIO";

export type UserStatus = "ACTIVO" | "INACTIVO";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
}

export interface UserRecord extends User {
  password: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
