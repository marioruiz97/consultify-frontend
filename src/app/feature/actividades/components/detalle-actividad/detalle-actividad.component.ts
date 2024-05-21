import { Component } from '@angular/core';
import { TableroProyectoService } from 'src/app/feature/proyectos/service/tablero-proyecto.service';
import { GestorActividadesService } from '../../service/gestor-actividades.service';
import { AppConstants } from 'src/app/shared/app.constants';

@Component({
  selector: 'app-detalle-actividad',
  templateUrl: './detalle-actividad.component.html',
  styleUrls: ['./detalle-actividad.component.css']
})
export class DetalleActividadComponent {

  actividad = { id: 1, nombre: 'Actividad de prueba' };
  private idProyecto = 1;

  constructor(
    private tableroService: TableroProyectoService,
    private actividadService: GestorActividadesService
  ) {

  }

  volver(): string {
    return `/${AppConstants.RUTA_PROYECTOS}/${this.idProyecto}`;
  }
}
