import { Actividad } from "src/app/feature/actividades/model/actividad.model";
import { InfoProyecto } from "../info-proyecto.model";

export interface TableroProyecto {
  infoProyecto: InfoProyecto;
  actividades: Actividad[];
}
