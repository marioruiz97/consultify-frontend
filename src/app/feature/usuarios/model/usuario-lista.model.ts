
export interface UsuarioLista {
  idUsuario?: number;
  identificacion: string;
  tipoDocumento: string;
  nombre: string;
  apellido1: string;
  apellido2?: string;
  telefono: string;
  correo: string;
  contrasena: string;
  matchContrasena?: string;
  estado: boolean;
  //roles: Role[];
}
