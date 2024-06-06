import { Component, OnDestroy } from '@angular/core';
import { ClienteInforme, InformeProyecto } from '../../model/informe-proyecto.model';
import { BehaviorSubject, Subscription } from 'rxjs';
import { InformeService } from '../../service/informe.service';
import { TipoDocumentoMap } from 'src/app/feature/usuarios/model/tipo-documento.model';
import { NumberInput } from '@angular/cdk/coercion';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import * as moment from 'moment';

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

  idContenedorAvance(idProyecto: number): string {
    return 'contenedor-informe-avance-' + idProyecto;
  }

  exportarAPDF(informe: InformeProyecto) {
    const dataElement = document.getElementById(`contenedor-informe-avance-${informe.idProyecto}`);
    const fecha = moment().format("DD-MM-YYYY");
    const nombreArchivo = `informe-avance-${informe.idProyecto}-${informe.nombreProyecto}-${fecha}.pdf`;

    if (dataElement) {
      html2canvas(dataElement, { useCORS: true, logging: true, backgroundColor: '#fff' }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

        pdf.save(nombreArchivo);
      });
    }
  }

  descargarReporte(informe: InformeProyecto, format: 'pdf' | 'xlsx') {
    const idProyecto = informe.idProyecto;
    const fecha = moment().format("DD-MM-YYYY");
    const nombreArchivo = `informe-avance-${informe.idProyecto}-${informe.nombreProyecto}-${fecha}.${format}`;

    this.servicioInformes.exportarReporte(idProyecto, format).subscribe({
      next: (response: Blob) => {

        const blob = new Blob([response], { type: format === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = nombreArchivo;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('Error descargando el reporte', error);
      }
    });
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
