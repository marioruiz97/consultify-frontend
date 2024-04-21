import { Rol } from "src/app/core/model/usuario-sesion.model";

export class MiPerfil {
  nombres: string;
  apellidos: string;
  telefono: string;
  nombreUsuario: string;
  correo: string;
  identificacion: string;
  tipoDocumento: string;
  rol: Rol;

  constructor(nombres?: string, apellidos?: string, telefono?: string, nombreUsuario?: string, correo?: string, identificacion?: string, tipoDocumento?: string, rol?: Rol) {
    this.nombres = nombres ?? "";
    this.apellidos = apellidos ?? "";
    this.telefono = telefono ?? "";
    this.nombreUsuario = nombreUsuario ?? "";
    this.correo = correo ?? "";
    this.identificacion = identificacion ?? "";
    this.tipoDocumento = tipoDocumento ?? "";
    this.rol = rol ?? Rol.CLIENTE;
  }
}
