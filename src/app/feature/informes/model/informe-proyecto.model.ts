import { TipoDocumento } from "../../usuarios/model/tipo-documento.model";
import { InformeActividad } from "./informe-actividad.model";

export interface InformeProyecto {
  idProyecto: number;
  nombreProyecto: string;
  cierreEsperado: Date;
  cliente: ClienteInforme;
  miembros: MiembroInforme[];
  abierto: boolean;
  informeActividad: InformeActividad;
  barras: BarraActividades[];
}

export interface ClienteInforme {
  idCliente: number;
  numeroIdentificacion: string;
  nombreComercial: string;
  razonSocial: string;
  tipoDocumento: TipoDocumento;
}

export interface MiembroInforme {
  idUsuario: number;
  nombreCompleto: string;
}

export interface BarraActividades {
  estilo: string;
  titulo: string;
  valor: number;
}
