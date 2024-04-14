export class UsuarioSesion {
  idUsuario: number;
  nombreUsuario: string
  correo: string;
  nombre: string;
  apellido: string;

  constructor(idUsuario: number, nombreUsuario: string, correo: string, nombre: string, apellido: string) {
    this.idUsuario = idUsuario;
    this.nombreUsuario = nombreUsuario;
    this.correo = correo;
    this.nombre = nombre;
    this.apellido = apellido;
  }

}
