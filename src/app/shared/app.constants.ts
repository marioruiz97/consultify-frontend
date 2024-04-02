import { MatDialogConfig } from '@angular/material/dialog';

export class AppConstants {
  public static PATH_TIPO_CITA = 'tipo-citas';
  public static PATH_RESPONSABLE = 'responsables';
  public static PATH_MASCOTA = 'mascotas';
  public static PATH_VETERINARIO = 'veterinarios';
  public static PATH_CITA = 'citas';
}

export const DIALOG_CONFIG: MatDialogConfig = {
  disableClose: true,
  position: { right: '0px' },
  maxWidth: '100vw',
  minWidth: '50vw',
};
