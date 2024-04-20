export class UsuarioSesion {
  idUsuario: number;
  identificacion: string;
  nombreUsuario: string
  correo: string;
  nombreCompleto: string;
  rol: Rol;

  constructor(idUsuario: number, identificacion: string, nombreUsuario: string, correo: string, nombreCompleto: string, rol: Rol) {
    this.idUsuario = idUsuario;
    this.identificacion = identificacion;
    this.nombreUsuario = nombreUsuario;
    this.correo = correo;
    this.nombreCompleto = nombreCompleto;
    this.rol = rol;
  }
}

export enum Rol {
  ADMIN,
  ASESOR,
  CLIENTE
}
