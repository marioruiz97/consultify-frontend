import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { TableroProyectoService } from '../../service/tablero-proyecto.service';
import { Subscription } from 'rxjs';
import { Notificacion } from '../../model/notificaciones/notificacion.model';

@Component({
  selector: 'app-notificaciones-proyecto',
  templateUrl: './notificaciones-proyecto.component.html',
  styleUrls: ['./notificaciones-proyecto.component.css']
})
export class NotificacionesProyectoComponent implements OnInit, OnDestroy {

  notificaciones: Notificacion[] = [];
  private subs: Subscription[] = [];

  constructor(private servicioTablero: TableroProyectoService, private detector: ChangeDetectorRef) { }

  ngOnInit() {
    this.subs.push(
      this.servicioTablero.tableroActual.subscribe(tablero => {
        if (tablero) {
          this.servicioTablero.obtenerNotificaciones(tablero.infoProyecto.idProyecto).subscribe(list => {
            this.notificaciones = list;
            this.detector.markForCheck();
          })
        }
      })
    );

  }

  ngOnDestroy() {
    if (this.subs) { this.subs.forEach(sub => sub.unsubscribe()); }
  }
}
