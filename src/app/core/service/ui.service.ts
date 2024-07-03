import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarRef, TextOnlySnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogData } from '../model/confirm-dialog-data.model';
import { ConfirmDialogComponent } from '../components/confirm-dialog/confirm-dialog.component';
import { HttpErrorResponse } from '@angular/common/http';
import { customConfig } from 'src/app/shared/app.constants';
import { BehaviorSubject } from 'rxjs';
import { ApiError } from '../model/api-error.model';



@Injectable({
  providedIn: 'root'
})
export class UIService {

  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();


  constructor(private snackBar: MatSnackBar, private dialog: MatDialog) { }

  estaCargando(cargando: boolean) {
    this.loadingSubject.next(cargando);
  }


  mostrarSnackBar(message: string, durationInSec: number, action = 'Ok'): MatSnackBarRef<TextOnlySnackBar> {
    return this.snackBar.open(message, action, {
      duration: durationInSec * 1000,
      verticalPosition: 'top',
      horizontalPosition: 'end'
    });
  }

  mostrarConfirmDialog(data: ConfirmDialogData): MatDialogRef<ConfirmDialogComponent> {
    return this.dialog.open(ConfirmDialogComponent, {
      ...customConfig('10vw', '0vh', '99vw'),
      data: {
        title: data.title,
        message: data.message,
        errors: data.errors ? data.errors : [],
        confirm: data.confirm,
        showCancel: data.showCancel
      }
    });
  }

  mostrarAlerta(alerta: string) {
    this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: "Alerta",
        message: alerta,
        errors: [],
        confirm: 'Ok'
      }
    });
  }

  mostrarError(err: HttpErrorResponse): MatDialogRef<ConfirmDialogComponent> {
    let error: ApiError = { ...err.error };
    if (err.error && err.status == 0) error = { status: 500, error: 'Fallo del lado del servidor', message: 'Hay un fallo del lado del servidor, por favor verifica con soporte técnico.' }

    return this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: `Error: ${error.status} ${error.error}`,
        message:
          `Hubo un error en la operación. <br/>
          ${error.message}`,
        errors: [],
        confirm: 'OK'
      }
    })
  }

}
