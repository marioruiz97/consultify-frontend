import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpService } from 'src/app/core/service/http.service';
import { UIService } from 'src/app/core/service/ui.service';
import { TableroProyecto } from '../model/tablero/tablero-proyecto.model';
import { AppConstants } from 'src/app/shared/app.constants';

@Injectable()
export class TableroProyectoService {

  private $TableroActual: BehaviorSubject<TableroProyecto | undefined> = new BehaviorSubject<TableroProyecto | undefined>(undefined);
  private tableroPath = AppConstants.RUTA_PROYECTOS;

  constructor(
    private httpService: HttpService,
    private uiService: UIService,
    private router: Router
  ) { }

  public get tableroActual() {
    return this.$TableroActual.asObservable();
  }

  obtenerTablero(idProyecto: number): Observable<TableroProyecto | undefined> {
    this.httpService.getRequest<TableroProyecto>(`${this.tableroPath}/${idProyecto}`).subscribe({
      next: (tablero) => this.$TableroActual.next(tablero),
      error: (err) => this.uiService.mostrarError(err)
    })
    return this.tableroActual;
  }

}
