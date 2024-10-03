export interface SeguimientoActividad {
  idSeguimiento: number;
  usuario: Persona;
  fechaSeguimiento: Date;
  comentarios: string;
  editable: boolean;
}

export interface Persona {
  idUsuario: number;
  nombres: string;
  apellidos: string;
  nombreCompleto?: string;
}
