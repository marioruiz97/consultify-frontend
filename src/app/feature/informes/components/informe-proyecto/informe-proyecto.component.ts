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

  private subs: Subscription[] = [];


  constructor(private servicioInformes: InformeService) {
    this.subs.push(
      this.servicioInformes.obtenerProyectos().subscribe(encabezados => {
        console.log('projects', encabezados)
        this.proyectos.next(encabezados);
      })
    );
  }

  cargarInformeProyecto(proyecto: InformeProyecto) {

    const informes = this.proyectos.value;
    if (!proyecto.abierto) {
      console.log('Cargar Proyecto desde API');

      this.subs.push(
        this.servicioInformes.cargarInformeProyecto(proyecto.idProyecto).subscribe(informe => {
          console.log('informe', informe);

          informes.map(proj => {
            if (proj.idProyecto === proyecto.idProyecto) {
              proj.abierto = true;
              proj.informeActividad = informe.informeActividad;
            }
            return proj;
          });

          this.proyectos.next(informes);
        })
      );

    }
  }

  calcularPorcentaje(nActividades: number, totalActividades: number): NumberInput {
    return (nActividades * 100) / totalActividades;
  }

  calcularCirculo(nActividades: number, totalActividades: number): NumberInput {
    return 2 + (nActividades * 98) / totalActividades;
  }


  definirEstilos(actividades: number, totalActividades: number): { [klass: string]: string; } {
    const porcentaje = (actividades * 70) / totalActividades;
    return {
      'min-width': '30%',
      'width': `${30 + porcentaje}%`
    }
  }

  infoCliente(cliente: ClienteInforme): string {
    return `${TipoDocumentoMap.get(cliente.tipoDocumento)} ${cliente.numeroIdentificacion} - ${cliente.nombreComercial} `;
  }


  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

}
