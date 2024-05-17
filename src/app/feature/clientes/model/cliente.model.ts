export interface Cliente {
  idCliente: number;
  numeroIdentificacion: string;
  nombreComercial: string;
  razonSocial: string;
  tipoDocumento: string;
  contactos: Contacto[];
}

export interface Contacto {
  id?: string;
  idCliente?: number;
  nombreCompleto: string;
  cargo: string;
  telefono: string;
  correo: string;
}
