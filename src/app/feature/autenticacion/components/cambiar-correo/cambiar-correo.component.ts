import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UIService } from 'src/app/core/service/ui.service';
import { CuentaService } from '../../service/cuenta.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AppConstants as patron } from 'src/app/shared/app.constants';
import { KeyValue } from '@angular/common';

@Component({
  selector: 'app-cambiar-correo',
  templateUrl: './cambiar-correo.component.html',
  styleUrls: ['./cambiar-correo.component.css']
})
export class CambiarCorreoComponent implements OnInit {

  formulario: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: { idUsuario: number, correoActual: string },
    private cuentaService: CuentaService,
    private uiService: UIService,
    private dialogRef: MatDialogRef<CambiarCorreoComponent>
  ) {
    this.formulario = new FormGroup({
      correoNuevo: new FormControl('', [Validators.required, Validators.email])
    });
  }

  ngOnInit() {
    this.dialogRef.disableClose = true;
  }

  cerrarModal(respuesta: string = "") {
    this.dialogRef.close(respuesta);
  }

  cambiarCorreo() {
    const data: { idUsuario: number, correoActual: string, correoNuevo: string } = {
      idUsuario: this.data.idUsuario,
      correoActual: this.data.correoActual,
      correoNuevo: this.formulario.value.correoNuevo
    };
    this.cuentaService.cambiarCorreo(this.data.idUsuario, data)
      .then(respuesta => {
        if (respuesta) {
          const message = "Se cambió el correo de forma exitosa";
          this.uiService.mostrarConfirmDialog({ title: "Cambio de correo electrónico", message, errors: [], confirm: "Aceptar", showCancel: false });
          this.cerrarModal(respuesta.correo);
        }
      })
      .catch(err => this.uiService.mostrarError(err));
  }
}
