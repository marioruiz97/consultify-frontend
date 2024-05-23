import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CuentaService } from '../../service/cuenta.service';
import { UIService } from 'src/app/core/service/ui.service';
import { CambioContrasena } from '../../model/cambio-contrasena-model';
import { AppConstants as patron } from 'src/app/shared/app.constants';

@Component({
  templateUrl: './cambiar-contrasena.component.html',
  styleUrls: ['./cambiar-contrasena.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CambiarContrasenaComponent implements OnInit {

  private idUsuario: number;
  formulario: FormGroup;
  hideActual = true;
  hideNueva = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: CambioContrasena,
    private cuentaService: CuentaService,
    private uiService: UIService,
    private dialogRef: MatDialogRef<CambiarContrasenaComponent>
  ) {
    this.idUsuario = this.data.idUsuario;
    this.formulario = new FormGroup({
      contrasenaActual: new FormControl('', [Validators.required, Validators.pattern(patron.PATRON_CONTRASENA)]),
      contrasena: new FormControl('', [Validators.required, Validators.pattern(patron.PATRON_CONTRASENA)]),
      confirmar: new FormControl('', [Validators.required, Validators.pattern(patron.PATRON_CONTRASENA)]),
    });
  }

  ngOnInit() {
    this.dialogRef.disableClose = true;
  }

  cerrarModal() {
    this.dialogRef.close();
  }

  cambiarContrasena() {
    const form = this.formulario.value;
    if (form.contrasena !== form.confirmar) this.uiService.mostrarSnackBar('Las contraseñas no coinciden', 1.5);
    if (form.contrasena === form.contrasenaActual) this.uiService.mostrarSnackBar('La contraseña nueva no puede ser igual a la anterior', 1.5);
    if (form.contrasena === form.confirmar && form.contrasena !== form.contrasenaActual) {
      const cambioContrasena: CambioContrasena = {
        idUsuario: this.idUsuario,
        correo: this.data.correo,
        contrasena: form.contrasena,
        contrasenaActual: form.contrasenaActual
      };
      this.cuentaService.cambiarContrasena(this.idUsuario, cambioContrasena).
        then(respuesta => {
          if (respuesta) {
            const message = "Se cambió la contraseña de forma exitosa";
            this.uiService.mostrarConfirmDialog({ title: "Cambio de contraseña", message, errors: [], confirm: "Aceptar", showCancel: false });
            this.cerrarModal();
          }
        })
        .catch(err => this.uiService.mostrarError(err));
    }
  }
}
