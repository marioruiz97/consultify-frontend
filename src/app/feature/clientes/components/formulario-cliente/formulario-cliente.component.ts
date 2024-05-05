import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ConfirmDialogData } from 'src/app/core/model/confirm-dialog-data.model';
import { UIService } from 'src/app/core/service/ui.service';
import { TipoDocumentoMap } from 'src/app/feature/usuarios/model/tipo-documento.model';
import { AppConstants } from 'src/app/shared/app.constants';
import { ClienteService } from '../../service/cliente.service';
import { Cliente } from '../../model/cliente.model';
import { MatDialog } from '@angular/material/dialog';
import { FormularioContactosComponent } from '../formulario-contactos/formulario-contactos.component';

@Component({
  selector: 'app-formulario-cliente',
  templateUrl: './formulario-cliente.component.html',
  styleUrls: ['./formulario-cliente.component.css']
})
export class FormularioClienteComponent implements OnDestroy {

  clienteForm: FormGroup;
  tiposDocumentos = TipoDocumentoMap;
  esEditar = false;
  private idCliente = 0;

  private suscripciones: Subscription[] = [];


  constructor(
    private activatedRoute: ActivatedRoute,
    private clienteService: ClienteService,
    private router: Router,
    private uiService: UIService,
    private dialog: MatDialog
  ) {
    this.clienteForm = this.iniciarFormulario();
    this.clienteService.setContactos([]);

    this.suscripciones.push(this.activatedRoute.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id && id !== '0') this.obtenerInfoCliente(+id);
    }));
  }

  private obtenerInfoCliente(idCliente: number) {
    this.clienteService.obtenerClientePorId(idCliente)
      .then(res => {
        this.clienteService.setContactos(res.contactos);
        this.setForm(res);
      })
      .catch(err => {
        this.suscripciones.push(
          this.uiService.mostrarError(err).afterClosed()
            .subscribe(() => this.router.navigate([AppConstants.RUTA_USUARIOS]))
        );
      });
  }

  private iniciarFormulario(): FormGroup {
    return new FormGroup({
      idCliente: new FormControl({ value: '', disabled: true }),
      numeroIdentificacion: new FormControl('', [Validators.required, Validators.maxLength(20)]),
      nombreComercial: new FormControl('', [Validators.required]),
      razonSocial: new FormControl('', [Validators.required]),
      tipoDocumento: new FormControl('', [Validators.required]),
    });
  }

  private setForm(cliente: Cliente) {
    this.esEditar = true;
    this.idCliente = cliente.idCliente;
    this.clienteForm.setValue({
      idCliente: cliente.idCliente,
      numeroIdentificacion: cliente.numeroIdentificacion,
      nombreComercial: cliente.nombreComercial,
      razonSocial: cliente.razonSocial,
      tipoDocumento: cliente.tipoDocumento
    });
  }

  mostrarErrores(): string[] {
    const controls = ['numeroIdentificacion', 'nombreComercial', 'razonSocial', 'tipoDocumento'];
    const result: string[] = [];
    controls.forEach(control => {
      if (this.clienteForm.controls[control].errors !== null) { result.push(control); }
    });
    return result;
  }

  agregarContacto() {
    this.dialog.open(FormularioContactosComponent, { disableClose: true });
  }

  volverAlListado() {
    const data: ConfirmDialogData = {
      title: '¿Cancelar progreso?',
      message: 'Si vuelves perderás los avances del formulario de ingreso',
      errors: [],
      confirm: 'Sí, deseo regresar',
      showCancel: true
    };
    const dialogRef = this.uiService.mostrarConfirmDialog(data);
    this.suscripciones.push(dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.router.navigate([AppConstants.RUTA_CLIENTES])
      }
    }));
  }

  guardarCliente() {
    const cliente: Cliente = { ...this.clienteForm.value, contactos: this.clienteService.contactos };
    if (this.esEditar && this.idCliente && this.idCliente !== 0) {
      cliente.idCliente = this.idCliente;
      this.ejecutarOperacion(this.clienteService.editarCliente(this.idCliente, cliente));
    } else {
      this.ejecutarOperacion(this.clienteService.crearCliente(cliente));
    }
  }

  private ejecutarOperacion(operacion: Promise<Cliente>) {
    operacion.then(res => {
      this.uiService.mostrarSnackBar(`El cliente ${res.nombreComercial} se ha guardado con exito`, 4);
      this.router.navigate([AppConstants.RUTA_CLIENTES]);
    })
      .catch(err => {
        this.uiService.mostrarError(err);
      });
  }

  ngOnDestroy(): void {
    this.suscripciones.forEach(sub => sub.unsubscribe());
  }

}
