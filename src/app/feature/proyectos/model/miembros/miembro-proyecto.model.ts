import { Rol } from "src/app/core/model/usuario-sesion.model";
import { InfoUsuario } from "src/app/feature/usuarios/model/usuario-info.model";

export interface MiembroProyecto {
  usuario: InfoUsuario;
  nombreUsuario: string;
  creadoPor: string;
  activo: boolean;
  verificado: boolean;
  rol: Rol;
}
