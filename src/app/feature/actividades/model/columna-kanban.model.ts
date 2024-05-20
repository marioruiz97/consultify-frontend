import { BehaviorSubject } from "rxjs";
import { Actividad } from "./actividad.model";

export interface Columna {
  titulo: string;
  actividades: BehaviorSubject<Actividad[]>;
  oculta: boolean;
  prev: boolean;
  isExpanded: boolean;
  ancho: string;
  claseCss: string;
}
