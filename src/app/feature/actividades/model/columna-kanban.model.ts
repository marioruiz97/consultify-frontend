import { Actividad } from "./actividad.model";

export interface Columna {
  titulo: string;
  actividades: Actividad[];
  oculta: boolean;
  prev: boolean;
  isExpanded: boolean;
  ancho: string;
}
