import { EstadoActividad } from "./estado-actividad.model";
import { ResponsableActividad } from "./responsable-actividad.model";

export interface Actividad {
  id: number;
  titulo: string;
  descripcion: string;
  responsable: ResponsableActividad;
  fechaVencimiento: Date;
  estado: EstadoActividad;
  comentarios: string[];
}
