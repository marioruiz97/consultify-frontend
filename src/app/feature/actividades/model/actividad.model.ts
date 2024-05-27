import { InfoProyecto } from "../../proyectos/model/info-proyecto.model";
import { EstadoActividad } from "./estado-actividad.model";
import { ResponsableActividad } from "./responsable-actividad.model";

export interface Actividad {
  [key: string]: any;
  id: number;
  nombre: string;
  descripcion: string;
  estado: EstadoActividad;
  fechaCierreEsperado: Date;
  responsable: ResponsableActividad;
  fechaCompletada: Date;
  proyecto: InfoProyecto;
}
