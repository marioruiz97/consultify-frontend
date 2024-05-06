import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription, map, of, startWith } from 'rxjs';
import { UIService } from 'src/app/core/service/ui.service';
import { Cliente } from 'src/app/feature/clientes/model/cliente.model';
import { ClienteService } from 'src/app/feature/clientes/service/cliente.service';
import { ProyectoService } from '../../service/proyecto.service';
import { ConfirmDialogData } from 'src/app/core/model/confirm-dialog-data.model';
import { AppConstants } from 'src/app/shared/app.constants';
import { InfoProyecto } from '../../model/info-proyecto.model';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-formulario-proyecto',
  templateUrl: './formulario-proyecto.component.html',
  styleUrls: ['./formulario-proyecto.component.css']
})
export class FormularioProyectoComponent implements OnInit, OnDestroy {

  proyectoForm: FormGroup;
  private clientes: Cliente[] = [];
  filteredClientes: Observable<Cliente[]> = of(this.clientes);

  esEditar = false;

  private idProyecto = 0;
  private idCliente = 0;
  private subs: Subscription[] = [];

  constructor(
    private clienteService: ClienteService,
    private uiService: UIService,
    private service: ProyectoService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dialogRef: MatDialogRef<FormularioProyectoComponent>
  ) {
    this.proyectoForm = this.iniciarForm();
    this.obtenerClientes();

    this.subs.push(this.activatedRoute.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id && id !== '0') this.getProyecto(+id)
    }));
  }

  ngOnInit(): void {
    const clienteFormControl = this.proyectoForm.get('clienteProyecto');
    if (clienteFormControl) {
      this.filteredClientes = clienteFormControl.valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filter(value) : this.clientes.slice())
      );
    }
  }

  private obtenerClientes() {
    this.subs.push(this.clienteService.obtenerClientes().subscribe({
      next: (clientes) => clientes.length > 0 ? this.clientes = clientes : this.manejarError(),
      error: () => this.manejarError()
    }));
  }

  private manejarError() {
    const data: ConfirmDialogData = {
      title: 'No se han encontrado clientes',
      message: 'Al parecer no hay clientes registrados, primero debes ir a crearlos en el maestro de clientes. '
        + '\n ¿Quieres ser redireccionado allí?',
      confirm: 'Sí, llevame allí',
      errors: [],
      showCancel: true
    };
    this.subs.push(this.uiService.mostrarConfirmDialog(data).afterClosed().subscribe(result => {
      if (result) {
        this.dialogRef.close();
        this.router.navigate([AppConstants.RUTA_CLIENTES]);
      }
    }));
  }

  private iniciarForm(): FormGroup {
    return new FormGroup({
      nombreProyecto: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      descripcionProyecto: new FormControl('', Validators.maxLength(255)),
      clienteProyecto: new FormControl('', Validators.required),
    });
  }

  private getProyecto(id: number) {
    this.idProyecto = id;
    this.service.obtenerProyectoPorId(id)
      .then(res => this.setForm(res))
      .catch(err => {
        this.uiService.mostrarError(err);
        this.router.navigate([`/${AppConstants.RUTA_PROYECTOS}/${id}`]);
      });
  }

  private setForm(proyecto: InfoProyecto) {
    this.esEditar = true;
    this.idCliente = proyecto.clienteProyecto.idCliente;
    this.proyectoForm.setValue({
      nombreProyecto: proyecto.nombreProyecto,
      descripcionProyecto: proyecto.descripcionProyecto,
      clienteProyecto: this.setClienteValue(proyecto.clienteProyecto)
    });
    this.proyectoForm.get('clienteProyecto')?.disable();
  }

  setClienteValue(cliente: Cliente) {
    return `${cliente.idCliente} - ${cliente.razonSocial}`;
  }

  private _filter(value: string): Cliente[] {
    const filterValue = value.trim().toLowerCase();
    return this.clientes.filter(c =>
      c.razonSocial.toLowerCase().includes(filterValue) || c.nombreComercial.toLowerCase().includes(filterValue)
    ).slice();
  }

  mostrarErrores(): string[] {
    const controls = ['nombreProyecto', 'descripcionProyecto', 'clienteProyecto'];
    const result: string[] = [];
    controls.forEach(control => {
      if (this.proyectoForm.controls[control].errors !== null) {
        const printable = control === 'nombreProyecto' ? 'Nombre Proyecto' :
          (control === 'descripcionProyecto' ? 'Descripcion del proyecto' : 'Cliente');
        result.push(printable);
      }
    });
    return result;
  }


  onSubmit() {
    if (this.esEditar) {
      this.service.editarProyecto(this.idProyecto, { ...this.proyectoForm.value, idProyecto: this.idProyecto, clienteProyecto: this.idCliente });
    } else {
      const cliente: string = this.proyectoForm.value.cliente;
      console.log('cliente proyecto', cliente);
      const idCliente = cliente.substring(0, cliente.indexOf('-')).trim();
      this.proyectoForm.value.cliente = parseInt(idCliente, 10);
      this.service.crearProyecto(this.proyectoForm.value);
    }
  }


  cancelar() {
    const data: ConfirmDialogData = {
      title: '¿Cancelar progreso?',
      message: 'Si vuelves perderás los avances del formulario de ingreso',
      confirm: 'Sí, deseo regresar',
      errors: [],
      showCancel: true
    };
    const dialogRef = this.uiService.mostrarConfirmDialog(data);
    this.subs.push(dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (this.esEditar && this.idProyecto != 0) {
          this.dialogRef.close();
          this.router.navigate([`${AppConstants.RUTA_PROYECTOS}/${this.idProyecto}`]);
        } else {
          this.dialogRef.close();
          this.router.navigate([AppConstants.RUTA_PROYECTOS]);
        }
      }
    }));
  }

  ngOnDestroy() {
    if (this.subs) { this.subs.forEach(sub => sub.unsubscribe()); }
  }


}
