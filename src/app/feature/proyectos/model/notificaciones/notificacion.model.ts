export interface Notificacion {
  id: number;
  idProyecto: number;
  idUsuario: number;
  creadoEn: Date;
  leida: boolean;
  mensaje: string;
  tipoNotificacion: 'INFO' | 'WARN';
}
