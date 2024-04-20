import { MatDialogConfig } from '@angular/material/dialog';
import { NavItem } from '../core/model/nav-item';

export class AppConstants {
  public static readonly RUTA_HOME = 'home';
  public static readonly RUTA_LOGIN = 'login';
  public static readonly RUTA_RECUPERAR = 'recuperar';
  public static readonly RUTA_CUENTA = 'cuenta';
  public static readonly RUTA_USUARIOS = 'usuarios';
  public static readonly RUTA_CLIENTES = 'clientes';
}

export const MENU_NAVEGACION: NavItem[] = [
  { url: '/tipo-citas', name: 'lorem', icon: 'next_week' },
  { url: '/veterinarios', name: 'ipsum', icon: 'assignment_ind' },
  { url: AppConstants.RUTA_USUARIOS, name: 'Usuarios', icon: 'people' },
  { url: '/citas', name: 'ipsum', icon: 'book_online' },
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
export const customConfig = (minWidth: string, minHeight?: string, maxWidth: string = '100vw', maxHeight: string = '100vh') => {
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
