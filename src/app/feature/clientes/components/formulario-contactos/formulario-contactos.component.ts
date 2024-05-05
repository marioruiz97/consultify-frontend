import { Component, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Contacto } from '../../model/cliente.model';
import { ClienteService } from '../../service/cliente.service';
import { AppConstants } from 'src/app/shared/app.constants';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-formulario-contactos',
  templateUrl: './formulario-contactos.component.html',
  styleUrls: ['./formulario-contactos.component.css']
})
export class FormularioContactosComponent {

  contactoForm: FormGroup;
  esEditar = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Contacto,
    private dialogRef: MatDialogRef<FormularioContactosComponent>,
    private servicioCliente: ClienteService
  ) {
    this.contactoForm = this.initForm();
    this.dialogRef.disableClose = true;
    if (this.data) {
      this.setForm(this.data);
    }
  }

  private initForm() {
    return new FormGroup({
      nombreCompleto: new FormControl('', [Validators.required, Validators.maxLength(120)]),
      telefono: new FormControl('', [Validators.required, Validators.maxLength(10), Validators.pattern(AppConstants.PATRON_TELEFONO)]),
      correo: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  private setForm(data: Contacto) {
    this.esEditar = true;
    this.contactoForm.setValue({
      nombreCompleto: data.nombreCompleto,
      telefono: data.telefono,
      correo: data.correo
    });
  }

  onSubmit() {
    const result: Contacto = this.contactoForm.value;
    if (this.esEditar) {
      result.id = this.data.id;
      this.servicioCliente.editarContacto(result);
    } else {
      result.id = uuidv4();
      this.servicioCliente.agregarContacto(result);
    }
    this.dialogRef.close(true);
  }

}
