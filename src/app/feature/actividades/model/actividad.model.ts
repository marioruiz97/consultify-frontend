import { InfoProyecto } from "../../proyectos/model/info-proyecto.model";
import { TipoActividad } from "../../tipo-actividades/model/tipo-actividad.model";
import { EstadoActividad } from "./estado-actividad.model";
import { ResponsableActividad } from "./responsable-actividad.model";

export interface Actividad {
  [key: string]: any;
  id: number;
  nombre: string;
  descripcion: string;
  estado: EstadoActividad;
  fechaCierreEsperado: Date;
  tipoActividad: TipoActividad;
  responsable: ResponsableActividad;
  fechaCompletada: Date;
  proyecto: InfoProyecto;
}
