import { BehaviorSubject } from "rxjs";
import { Actividad } from "./actividad.model";

export interface Columna {
  id: string;
  titulo: string;
  actividades: BehaviorSubject<Actividad[]>;
  oculta: boolean;
  prev: boolean;
  isExpanded: boolean;
  claseCss: string;
}
