import { Component, OnDestroy } from '@angular/core';
import { ClienteInforme, InformeProyecto } from '../../model/informe-proyecto.model';
import { BehaviorSubject, Subscription } from 'rxjs';
import { InformeService } from '../../service/informe.service';
import { TipoDocumentoMap } from 'src/app/feature/usuarios/model/tipo-documento.model';
import { NumberInput } from '@angular/cdk/coercion';

@Component({
  selector: 'app-informe-proyecto',
  templateUrl: './informe-proyecto.component.html',
  styleUrls: ['./informe-proyecto.component.css']
})
export class InformeProyectoComponent implements OnDestroy {

  proyectos: BehaviorSubject<InformeProyecto[]> = new BehaviorSubject<InformeProyecto[]>([]);
  noHayProyectos = true;

  private subs: Subscription[] = [];


  constructor(private servicioInformes: InformeService) {
    this.cargarEncabezados();
  }

  private cargarEncabezados() {
    this.subs.push(
      this.servicioInformes.obtenerProyectos().subscribe(encabezados => {
        this.noHayProyectos = encabezados.length < 1;
        this.proyectos.next(encabezados);
      })
    );
  }

  cargarInformeProyecto(proyecto: InformeProyecto) {

    const informes = this.proyectos.value;
    if (!proyecto.abierto) {
      console.log('Cargar Proyecto desde API. id proyecto:', proyecto.idProyecto);

      this.subs.push(
        this.servicioInformes.cargarInformeProyecto(proyecto.idProyecto).subscribe(informe => {

          informes.map(proj => {
            if (proj.idProyecto === proyecto.idProyecto) {
              proj.abierto = true;
              proj.informeActividad = informe.informeActividad;
              proj.barras = [
                { estilo: 'POR_HACER', titulo: 'Actividades Por Hacer', valor: proj.informeActividad.actividadesPorHacer },
                { estilo: 'EN_PROGRESO', titulo: 'Actividades En Progreso', valor: proj.informeActividad.actividadesEnProgreso },
                { estilo: 'EN_REVISION', titulo: 'Actividades En Revisión', valor: proj.informeActividad.actividadesEnRevision },
                { estilo: 'COMPLETADA', titulo: 'Actividades Completadas', valor: proj.informeActividad.actividadesCompletas }
              ];
            }
            return proj;
          });

          this.proyectos.next(informes);
        })
      );

    }
  }

  calcularPorcentaje(nActividades: number, totalActividades: number, min = 0): NumberInput {
    const total = totalActividades != 0 ? totalActividades : 1;
    return min + (nActividades * (100 - min)) / total;
  }

  definirEstilos(actividades: number, totalActividades: number): { [klass: string]: string; } {
    const porcentaje = this.calcularPorcentaje(actividades, totalActividades, 4);
    return {
      'width': `${porcentaje}%`
    }
  }

  infoCliente(cliente: ClienteInforme): string {
    return `${TipoDocumentoMap.get(cliente.tipoDocumento)} ${cliente.numeroIdentificacion} - ${cliente.nombreComercial} `;
  }


  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

}
