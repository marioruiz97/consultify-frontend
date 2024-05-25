import { InfoUsuario } from "../../usuarios/model/usuario-info.model";

export interface ResponsableActividad extends InfoUsuario {
  nombresCompletos: string;
}
