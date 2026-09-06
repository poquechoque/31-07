export interface TipoMascota {
  _id: string;
  nombreTipo: string;
  descripcion?: string;
  estado: boolean;
}

export interface Raza {
  _id: string;
  tipoMascota: string;
  nombreRaza: string;
  descripcion?: string;
  estado: boolean;
}

export type SexoMascota = 'macho' | 'hembra';
export type TamanoMascota = 'pequeno' | 'mediano' | 'grande';
export type EstadoAdopcionMascota = |'borrador' | 'pendiente' | 'disponible' | 'adoptado' | 'cancelado';

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
  estadoAdopcion: 'borrador' | 'pendiente' |'disponible' | 'adoptado' | 'cancelado';
  fechaRegistro: string;
  fechaPublicacion?: string;
  fechaAdopcion?: string;
  requisitos?: string;
  estado: boolean;
}

export interface CrearMascotaData {
  tipoMascota: string;
  raza: string;
  nombre: string;
  sexo: SexoMascota;
  edadAproxMeses: number;
  tamano: TamanoMascota;
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
  sexo?: SexoMascota;
  tamano?: TamanoMascota;
  edadMin?: number;
  edadMax?: number;
  estadoAdopcion?: EstadoAdopcionMascota;
  busqueda?: string;
}