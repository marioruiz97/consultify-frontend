import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable, Subscription, map, of, startWith } from 'rxjs';
import { UIService } from 'src/app/core/service/ui.service';
import { MiembroProyecto } from 'src/app/feature/proyectos/model/miembros/miembro-proyecto.model';
import { TableroProyectoService } from 'src/app/feature/proyectos/service/tablero-proyecto.service';
import { GestorActividadesService } from '../../service/gestor-actividades.service';
import { Actividad } from '../../model/actividad.model';
import { EstadoActividad, EstadoActividadMap } from '../../model/estado-actividad.model';
import { InfoUsuario } from 'src/app/feature/usuarios/model/usuario-info.model';
import { ResponsableActividad } from '../../model/responsable-actividad.model';
import { TipoActividad } from 'src/app/feature/tipo-actividades/model/tipo-actividad.model';
import { TipoActividadesService } from 'src/app/feature/tipo-actividades/service/tipo-actividades.service';

@Component({
  selector: 'app-formulario-actividad',
  templateUrl: './formulario-actividad.component.html',
  styleUrls: ['./formulario-actividad.component.css']
})
export class FormularioActividadComponent implements OnInit, OnDestroy {

  private subs: Subscription[] = [];

  private miembros: MiembroProyecto[] = [];
  private actividad: Actividad | undefined;

  actividadForm: FormGroup;
  estados = EstadoActividadMap;
  tipoActividades: TipoActividad[] = [];
  minDate = new Date();
  esEditar = false;
  filteredMiembros: Observable<MiembroProyecto[]> = of(this.miembros);

  mostrarResponsableFn = (responsable: InfoUsuario): string => {
    return responsable ? responsable.nombres + ' ' + responsable.apellidos : '';
  };


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Actividad,
    private tableroService: TableroProyectoService,
    private servicioActividad: GestorActividadesService,
    private tipoActividadService: TipoActividadesService,
    private uiService: UIService,
    private dialogRef: MatDialogRef<FormularioActividadComponent>
  ) {
    this.actividadForm = this.iniciarFormulario();

    this.subs.push(
      this.tableroService.tableroActual.subscribe(tablero => {
        if (tablero) this.miembros = tablero.infoProyecto.miembros;
      })
    );

    this.subs.push(
      this.tipoActividadService.obtenerTiposActividad().subscribe(tipos => this.tipoActividades = tipos)
    );

    if (this.data) {
      this.setForm(this.data);
    }
  }

  ngOnInit(): void {
    const miembrosFormControl = this.actividadForm.get('responsable');
    if (miembrosFormControl) {
      this.filteredMiembros = miembrosFormControl.valueChanges.pipe(
        startWith(''),
        map(valorFormulario => typeof valorFormulario === 'string' ? valorFormulario : valorFormulario.nombreUsuario),
        map(miembro => miembro ? this._filter(miembro as string) : this.miembros.slice())
      );
    }
  }

  private _filter(value: string): MiembroProyecto[] {
    const filterValue = value.trim().toLowerCase();
    return this.miembros.filter(miembro =>
      miembro.nombreUsuario.toLowerCase().includes(filterValue) ||
      miembro.usuario.nombres.toLowerCase().includes(filterValue) ||
      miembro.usuario.apellidos.toLowerCase().includes(filterValue) ||
      miembro.usuario.correo.toLowerCase().includes(filterValue)
    ).slice();
  }

  private iniciarFormulario(): FormGroup {
    return new FormGroup({
      nombre: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      descripcion: new FormControl('', [Validators.required, Validators.maxLength(254)]),
      estado: new FormControl({ value: 'POR_HACER', disabled: true }, [Validators.required]),
      fechaCierreEsperado: new FormControl(''),
      tipoActividad: new FormControl(null),
      responsable: new FormControl('', [Validators.required]),
    });
  }

  private setForm(actividad: Actividad) {
    this.actividad = actividad;

    this.esEditar = true;
    this.actividadForm.get('estado')?.enable();

    this.actividadForm.setValue({
      nombre: actividad.nombre,
      descripcion: actividad.descripcion,
      estado: actividad.estado,
      fechaCierreEsperado: actividad.fechaCierreEsperado,
      tipoActividad: actividad.tipoActividad ?? null,
      responsable: actividad.responsable
    });

  }


  mostrarErrores(): string[] {
    const controls = ['nombre', 'descripcion', 'responsable', 'estado', 'tipoActividad', 'fechaCierreEsperado'];
    const result: string[] = [];
    controls.forEach(control => {
      if (this.actividadForm.controls[control].errors !== null) {
        let printable: string;
        switch (control) {
          case 'fechaCierreEsperado':
            printable = 'fecha esperada de cierre';
            break;
          case 'tipoActividad':
            printable = 'tipo de actividad';
            break;
          default:
            printable = control;
            break;
        }
        result.push(printable);
      }
    });
    return result;
  }

  guardarActividad() {
    const actividad: Actividad = { ...this.actividad, ...this.actividadForm.value };

    if (this.esEditar) {
      this.manejarOperacion(this.servicioActividad.editarActividad(actividad), actividad.responsable);
    } else {
      actividad.estado = EstadoActividad.POR_HACER;
      this.manejarOperacion(this.servicioActividad.crearActividad(actividad), actividad.responsable);
    }
  }

  private manejarOperacion(operacion: Promise<Actividad>, responsable: ResponsableActividad) {
    operacion
      .then(actividad => {
        this.uiService.mostrarSnackBar(`La actividad ${actividad.nombre} se ha guardado con exito`, 1.25);
        this.tableroService.agregarActividad(actividad, responsable);
        this.dialogRef.close(true);
      })
      .catch(err => this.uiService.mostrarError(err));
  }

  cancelar() {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

}
