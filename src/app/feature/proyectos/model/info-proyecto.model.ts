import { Cliente } from "../../clientes/model/cliente.model";
import { UsuarioEditar } from "../../usuarios/model/usuario-editar.model";

export interface InfoProyecto {
  idProyecto: number;
  nombreProyecto: string;
  clienteProyecto: Cliente;
  descripcionProyecto: string;
  miembros: UsuarioEditar[];
  creadoEn: Date;
}
