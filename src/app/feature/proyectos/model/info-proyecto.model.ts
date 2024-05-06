import { Cliente } from "../../clientes/model/cliente.model";

export interface InfoProyecto {
  idProyecto: number;
  nombreProyecto: string;
  clienteProyecto: Cliente;
  descripcionProyecto: string;
}
