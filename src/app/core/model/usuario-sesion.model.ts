export class UsuarioSesion {
  idUsuario: number;
  identificacion: string;
  nombreUsuario: string
  correo: string;
  nombre: string;
  apellido: string;

  constructor(idUsuario: number, identificacion: string, nombreUsuario: string, correo: string, nombre: string, apellido: string) {
    this.idUsuario = idUsuario;
    this.identificacion = identificacion;
    this.nombreUsuario = nombreUsuario;
    this.correo = correo;
    this.nombre = nombre;
    this.apellido = apellido;
  }

}
