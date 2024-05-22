export interface SeguimientoActividad {
  idSeguimiento: number;
  usuario: Persona;
  fechaSeguimiento: Date;
  comentarios: string;
}

export interface Persona {
  nombres: string;
  apellidos: string;
  nombreCompleto?: string;
}
