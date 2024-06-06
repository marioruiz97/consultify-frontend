import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TipoActividadesService } from '../../service/tipo-actividades.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormularioContactosComponent } from 'src/app/feature/clientes/components/formulario-contactos/formulario-contactos.component';
import { TipoActividad } from '../../model/tipo-actividad.model';
import { UIService } from 'src/app/core/service/ui.service';

@Component({
  templateUrl: './formulario-tipo-actividades.component.html',
  styleUrls: ['./formulario-tipo-actividades.component.css']
})
export class FormularioTipoActividadesComponent {

  esEditar = false;
  tipoActividadForm: FormGroup;


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: TipoActividad,
    private dialogRef: MatDialogRef<FormularioContactosComponent>,
    private tipoService: TipoActividadesService,
    private uiService: UIService
  ) {
    this.tipoActividadForm = this.iniciarFormulario();

    this.dialogRef.disableClose = true;

    if (this.data) {
      this.setForm(this.data);
    }
  }


  private iniciarFormulario(): FormGroup {
    return new FormGroup({
      idTipo: new FormControl({ value: '', disabled: true }),
      nombre: new FormControl('', [Validators.required])
    });
  }

  private setForm(data: TipoActividad) {
    this.esEditar = true;

    this.tipoActividadForm.setValue({
      idTipo: data.idTipo,
      nombre: data.nombre
    });
  }


  onSubmit() {
    const result: TipoActividad = this.tipoActividadForm.value;

    if (this.esEditar) {
      result.idTipo = this.data.idTipo;
      this.manejarOperacion(this.tipoService.editarTipoActividad(result));

    } else {
      this.manejarOperacion(this.tipoService.agregarTipoActividad(result));
    }

  }


  private manejarOperacion(accion: Promise<TipoActividad>) {
    accion
      .then(tipo => {
        this.uiService.mostrarSnackBar(`El tipo de actividad ${tipo.nombre} se ha guardado con exito`, 1.25);
        this.dialogRef.close(tipo);
      })
      .catch(err => this.uiService.mostrarError(err));
  }

}
