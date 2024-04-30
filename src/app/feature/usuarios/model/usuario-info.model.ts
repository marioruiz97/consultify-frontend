import { TipoDocumento } from "./tipo-documento.model";

export interface InfoUsuario {
  idUsuario: number;
  identificacion: string;
  tipoDocumento: TipoDocumento;
  nombres: string;
  apellidos: string;
  telefono: string;
  correo: string;
}
