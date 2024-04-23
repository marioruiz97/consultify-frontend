import { Rol } from "src/app/core/model/usuario-sesion.model";
import { InfoUsuario } from "./usuario-info.model";

export interface UsuarioFormulario {
  usuario: InfoUsuario;
  nombreUsuario: string;
  creadoPor: string;
  activo: boolean;
  verificado: boolean;
  rol: Rol;
}
