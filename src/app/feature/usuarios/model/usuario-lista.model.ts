import { Rol } from "src/app/core/model/usuario-sesion.model";
import { TipoDocumento } from "./tipo-documento.model";

export interface UsuarioLista {
  idUsuario: number;
  identificacion: string;
  tipoDocumento: TipoDocumento;
  nombres: string;
  apellidos: string;
  telefono: string;
  correo: string;
  estado: boolean;
  rol: Rol;
  creadoPor: string;
}
