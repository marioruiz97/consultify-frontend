export interface Cliente {
  idCliente: number;
  numeroIdentificacion: string;
  nombreComercial: string;
  razonSocial: string;
  tipoDocumento: string;
  contactos?: Contacto[];
}

export interface Contacto {
  id?: number;
  idCliente?: number;
  nombre: string;
  telefono?: string;
  correo: string;
}
