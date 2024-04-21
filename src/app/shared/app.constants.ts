import { MatDialogConfig } from '@angular/material/dialog';
import { NavItem } from '../core/model/nav-item';

export class AppConstants {
  public static readonly RUTA_HOME = 'home';
  public static readonly RUTA_LOGIN = 'login';
  public static readonly RUTA_RECUPERAR = 'recuperar';
  public static readonly RUTA_CUENTA = 'cuenta';
  public static readonly RUTA_USUARIOS = 'usuarios';
  public static readonly RUTA_CLIENTES = 'clientes';
  public static readonly RUTA_PROYECTOS = 'proyectos';
  public static readonly RUTA_CONTACTO = '';
  public static readonly RUTA_ACERCA = '';
}

export const MENU_NAVEGACION: NavItem[] = [
  { url: AppConstants.RUTA_USUARIOS, name: 'Usuarios', icon: 'people' },
  { url: AppConstants.RUTA_CLIENTES, name: 'Empresas Clientes', icon: 'account_balance' },
  { url: AppConstants.RUTA_PROYECTOS, name: 'Proyectos', icon: 'dashboard' },
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
