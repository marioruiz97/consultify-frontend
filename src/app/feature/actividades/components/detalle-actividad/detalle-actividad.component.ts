import { Component, OnDestroy, OnInit } from '@angular/core';
import { TableroProyectoService } from 'src/app/feature/proyectos/service/tablero-proyecto.service';
import { GestorActividadesService } from '../../service/gestor-actividades.service';
import { AppConstants } from 'src/app/shared/app.constants';
import { EstadoActividadMap } from '../../model/estado-actividad.model';
import { Actividad } from '../../model/actividad.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription, map, of, startWith } from 'rxjs';
import { MiembroProyecto } from 'src/app/feature/proyectos/model/miembros/miembro-proyecto.model';
import { InfoUsuario } from 'src/app/feature/usuarios/model/usuario-info.model';
import { UIService } from 'src/app/core/service/ui.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RoleService } from 'src/app/core/service/role.service';
import { TipoActividad } from 'src/app/feature/tipo-actividades/model/tipo-actividad.model';
import { TipoActividadesService } from 'src/app/feature/tipo-actividades/service/tipo-actividades.service';

@Component({
  selector: 'app-detalle-actividad',
  templateUrl: './detalle-actividad.component.html',
  styleUrls: ['./detalle-actividad.component.css']
})
export class DetalleActividadComponent implements OnInit, OnDestroy {

  private subs: Subscription[] = [];

  private $actividad!: Actividad;
  private idProyecto = '';
  private miembros: MiembroProyecto[] = [];

  habilitarCampos = false;

  actividadForm: FormGroup;
  tipoActividades: TipoActividad[] = [];
  estados = EstadoActividadMap;
  minDate = new Date();
  filteredMiembros: Observable<MiembroProyecto[]> = of(this.miembros);

  mostrarResponsableFn = (responsable: InfoUsuario): string => {
    return responsable ? responsable.nombres + ' ' + responsable.apellidos : '';
  };



  constructor(
    private tableroService: TableroProyectoService,
    private actividadService: GestorActividadesService,
    private tipoActividadService: TipoActividadesService,
    private uiService: UIService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public rolService: RoleService
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

    this.subs.push(
      this.activatedRoute.paramMap.subscribe(params => {
        const idProyecto = params.get('idProyecto');
        this.idProyecto = idProyecto ?? '0';

        const idActividad = params.get('idActividad');
        if (idActividad && idActividad !== '0') {
          this.actividadService.verificarProyecto(this.idProyecto);
          this.obtenerActividad(+idActividad)
        } else {
          this.uiService.mostrarAlerta('No se ha encontrado la actividad');
          this.router.navigate([`/${AppConstants.RUTA_PROYECTOS}/${this.idProyecto}`])
        }
      })
    );

  }

  get actividad() { return this.$actividad; }

  get claseCss() { return this.$actividad ? this.$actividad.estado : 'POR_HACER'; }

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

  private obtenerActividad(id: number) {
    this.subs.push(
      this.actividadService.obtenerActividadPorId(this.idProyecto, id).subscribe({
        next: (actividad) => this.setForm(actividad),
        error: (err) => {
          err.error.status = 500;
          err.error.error = 'Error obteniendo la actividad';
          err.error.message = err.message;
          this.uiService.mostrarError(err);
          this.volverAlTablero();
        }
      })
    );
  }

  private iniciarFormulario(): FormGroup {
    return new FormGroup({
      nombre: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      descripcion: new FormControl('', [Validators.required, Validators.maxLength(254)]),
      estado: new FormControl('', [Validators.required]),
      fechaCierreEsperado: new FormControl(''),
      tipoActividad: new FormControl(null),
      responsable: new FormControl('', [Validators.required]),
    });
  }

  private setForm(actividad: Actividad) {
    this.$actividad = actividad;

    this.actividadForm.setValue({
      nombre: actividad.nombre,
      descripcion: actividad.descripcion,
      estado: actividad.estado,
      fechaCierreEsperado: actividad.fechaCierreEsperado,
      tipoActividad: actividad.tipoActividad ?? null,
      responsable: actividad.responsable
    });

  }

  volverAlTablero() {
    this.router.navigate([`/${AppConstants.RUTA_PROYECTOS}/${this.idProyecto}`], { queryParams: { tab: 1 } })
  }

  habilitarGuardar() {
    this.habilitarCampos = true;
  }

  deshabilitarGuardar() {
    this.habilitarCampos = false;
    if (this.actividad) this.setForm(this.actividad);
  }

  guardarActividad() {
    const actividad: Actividad = { ...this.actividad, ...this.actividadForm.value };
    this.actividadService.editarActividad(actividad)
      .then(guardada => {
        this.uiService.mostrarSnackBar(`La actividad ${guardada.nombre} se ha guardado con exito`, 1.5);
        this.tableroService.agregarActividad(guardada, actividad.responsable);
        guardada.responsable = actividad.responsable;
        this.setForm(guardada);
        this.habilitarCampos = false;
      })
      .catch(err => this.uiService.mostrarError(err));
  }


  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

}
