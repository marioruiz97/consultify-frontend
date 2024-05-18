import { EstadoActividad } from "./estado-actividad.model";
import { ResponsableActividad } from "./responsable-actividad.model";

export interface Actividad {
  id: number;
  nombre: string;
  descripcion: string;
  estado: EstadoActividad;
  fechaCierreEsperado: Date;
  responsable: ResponsableActividad;
  seguimiento: string[];
}
