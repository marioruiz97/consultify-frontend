import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Actividad } from '../../model/actividad.model';
import { BehaviorSubject, Subscription } from 'rxjs';
import { MisActividadesService } from '../../service/mis-actividades.service';
import { EstadoActividad, EstadoActividadMap } from '../../model/estado-actividad.model';

@Component({
  selector: 'app-mis-proximas-actividades',
  templateUrl: './mis-proximas-actividades.component.html',
  styleUrls: ['./mis-proximas-actividades.component.css']
})
export class MisProximasActividadesComponent implements OnInit, OnDestroy {

  private subs: Subscription[] = [];

  misActividades: BehaviorSubject<Actividad[]> = new BehaviorSubject<Actividad[]>([]);
  mostrarTitulo = false;

  @Output() datosDisponibles = new EventEmitter<boolean>();

  constructor(private servicioActividad: MisActividadesService) { }

  obtenerEstado(estado: EstadoActividad): string | undefined {
    return EstadoActividadMap.get(estado);
  }

  dirigirActividad(actividad: Actividad): string {
    return `/proyectos/${actividad.proyecto.idProyecto}/actividades/${actividad.id}`;
  }

  ngOnInit(): void {
    this.subs.push(this.servicioActividad.obtenerMisActividades()
      .subscribe({
        next: (res) => {
          this.misActividades.next(res);
          this.mostrarTitulo = res.length > 0;
          this.datosDisponibles.emit(this.mostrarTitulo);
        },
        error: () => this.datosDisponibles.emit(false)
      }));

  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
    this.mostrarTitulo = false;
  }

}
