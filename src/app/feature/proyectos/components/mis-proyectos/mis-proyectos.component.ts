import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { InfoProyecto } from '../../model/info-proyecto.model';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ProyectoService } from '../../service/proyecto.service';

@Component({
  selector: 'app-mis-proyectos',
  templateUrl: './mis-proyectos.component.html',
  styleUrls: ['./mis-proyectos.component.css']
})
export class MisProyectosComponent implements OnInit, OnDestroy {

  private subs: Subscription[] = [];
  misProyectos: BehaviorSubject<InfoProyecto[]> = new BehaviorSubject<InfoProyecto[]>([]);
  mostrarTitulo: boolean;

  @Output() datosDisponibles = new EventEmitter<boolean>();

  constructor(private servicioProyecto: ProyectoService) {
    this.mostrarTitulo = false;
  }

  ngOnInit(): void {
    this.subs.push(this.servicioProyecto.obtenerMisProyectos()
      .subscribe(res => {
        this.misProyectos.next(res);
        this.mostrarTitulo = res.length > 0;
        this.datosDisponibles.emit(this.mostrarTitulo);
      }));


  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
    this.mostrarTitulo = false;
  }

}
