import { Cliente } from "../../clientes/model/cliente.model";
import { MiembroProyecto } from "./miembros/miembro-proyecto.model";

export interface InfoProyecto {
  idProyecto: number;
  nombreProyecto: string;
  clienteProyecto: Cliente;
  descripcionProyecto: string;
  miembros: MiembroProyecto[];
  creadoEn: Date;
  cierreEsperado: Date;
}
