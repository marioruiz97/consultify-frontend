import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogData } from '../model/confirm-dialog-data.model';
import { ConfirmDialogComponent } from '../components/confirm-dialog/confirm-dialog.component';
import { HttpErrorResponse } from '@angular/common/http';



@Injectable({
  providedIn: 'root'
})
export class UIService {


  constructor(private snackBar: MatSnackBar, private dialog: MatDialog) { }

  mostrarConfirmDialog(data: ConfirmDialogData): MatDialogRef<ConfirmDialogComponent> {
    return this.dialog.open(ConfirmDialogComponent, {
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
        errors: []
      }
    });
  }

  mostrarError(err: HttpErrorResponse): MatDialogRef<ConfirmDialogComponent> {
    return this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: `Error: ${err.error.status} ${err.error.error}`,
        message:
          `Hubo un error en la operación. <br/>
          ${err.error.message}`,
        errors: [],
        confirm: 'OK'
      }
    })
  }

}
