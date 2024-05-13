import { InfoProyecto } from "../info-proyecto.model";

export interface Notificacion {
  id: number;
  proyecto: InfoProyecto;
  color: string;
  mensaje: string;
  fechaCreacion: Date;
}
