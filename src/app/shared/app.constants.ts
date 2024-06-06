import { MatDialogConfig } from '@angular/material/dialog';
import { NavItem } from '../core/model/nav-item';

export class AppConstants {
  // RUTAS
  public static readonly API_ENDPOINT = 'http://localhost:8080';
  public static readonly API_BASE = 'api/v1/';

  public static readonly RUTA_HOME = 'home';
  public static readonly RUTA_LOGIN = 'login';
  public static readonly RUTA_RECUPERAR = 'recuperar';
  public static readonly RUTA_REINICIAR_CLAVE = 'reiniciar-contrasena';
  public static readonly RUTA_VERIFICAR_CUENTA = 'verificar-cuenta';
  public static readonly RUTA_CUENTA = 'cuenta';
  public static readonly RUTA_USUARIOS = 'usuarios';
  public static readonly RUTA_CLIENTES = 'clientes';
  public static readonly RUTA_PROYECTOS = 'proyectos';
  public static readonly RUTA_NOTIFICACIONES = 'notificaciones';
  public static readonly RUTA_TABLEROS = 'tableros';
  public static readonly RUTA_CONTACTO = 'contactenos';
  public static readonly RUTA_ACERCA = 'acerca';
  public static readonly RUTA_INFORMES = 'informes';
  public static readonly RUTA_MIS_PROYECTOS = 'mis-proyectos';
  public static readonly RUTA_MIS_ACTIVIDADES = 'mis-actividades';
  public static readonly RUTA_ACTIVIDADES = 'proyectos/{idProyecto}/actividades';
  public static readonly RUTA_SEGUIMIENTOS = 'actividades/{idActividad}/seguimientos';

  // PATRONES
  public static readonly PATRON_CONTRASENA = '(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[/.:;,"{}+<>@$!%*#?&^_-]).{8,20}';
  public static readonly MAX_LONGITUD_CONTRASENA = 20;
  public static readonly MIN_LONGITUD_CONTRASENA = 8;
  public static readonly PATRON_TELEFONO = '^(60[0-9]{8})$|^(3[0-9]{9})$';
}

export const MENU_NAVEGACION: NavItem[] = [
  { url: AppConstants.RUTA_USUARIOS, name: 'Usuarios', icon: 'people', roles: ['ROLE_ADMIN', 'ROLE_ASESOR'] },
  { url: AppConstants.RUTA_CLIENTES, name: 'Empresas Clientes', icon: 'account_balance', roles: ['ROLE_ADMIN', 'ROLE_ASESOR'] },
  { url: AppConstants.RUTA_PROYECTOS, name: 'Proyectos', icon: 'dashboard', roles: [] },
  { url: AppConstants.RUTA_INFORMES, name: 'Informes', icon: 'pie_chart', roles: [] },
];

export const DIALOG_CONFIG: MatDialogConfig = {
  disableClose: true,
  maxWidth: '100vw',
  minWidth: '50vw',
};

/**
 * solo es obligatorio el width ya que es mas probable que solo cambie este, el height por defecto es el tamano del contenido
 * @param minWidth
 * @param maxWidth
 * @param minHeight
 * @param maxHeight
 * @returns un objeto de tipo @MatDialogConfig
 */
export const customConfig = (minWidth: string, minHeight?: string, maxWidth = '100vw', maxHeight = '100vh') => {
  const dialogConfig: MatDialogConfig = {
    disableClose: true,
    minWidth,
    maxWidth,
    maxHeight
  }
  if (minHeight) {
    dialogConfig.minHeight = minHeight;
  }
  return dialogConfig;
}
