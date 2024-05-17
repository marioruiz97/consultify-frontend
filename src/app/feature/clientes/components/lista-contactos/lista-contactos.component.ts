import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Contacto } from '../../model/cliente.model';
import { ClienteService } from '../../service/cliente.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormularioContactosComponent } from '../formulario-contactos/formulario-contactos.component';
import { UIService } from 'src/app/core/service/ui.service';
import { ConfirmDialogData } from 'src/app/core/model/confirm-dialog-data.model';

@Component({
  selector: 'app-lista-contactos',
  templateUrl: './lista-contactos.component.html',
  styleUrls: ['./lista-contactos.component.css']
})
export class ListaContactosComponent implements AfterViewInit, OnDestroy {

  private suscripciones: Subscription[] = [];
  mostrarLista = false;
  displayedColumns = ['nombreCompleto', 'cargo', 'telefono', 'correo', 'acciones'];
  datasource = new MatTableDataSource<Contacto>();

  @ViewChild(MatSort, { static: false }) sort: MatSort = new MatSort();
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  constructor(private clienteService: ClienteService,
    private dialog: MatDialog,
    private uiService: UIService) {
    this.suscripciones.push(this.clienteService.contactos$.subscribe(listaContactos => { this.datasource.data = listaContactos; this.mostrarLista = listaContactos.length > 0 }));
  }

  ngAfterViewInit() {
    this.datasource.sort = this.sort;
    this.datasource.paginator = this.paginator;
  }

  doFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.datasource.filter = filterValue.trim().toLowerCase();
  }

  editar(contacto: Contacto) {
    this.dialog.open(FormularioContactosComponent, { disableClose: true, data: contacto });
  }

  eliminar(id: string) {
    const data: ConfirmDialogData = {
      errors: [],
      showCancel: true,
      confirm: 'Si, eliminar contacto',
      title: '¿Eliminar Contacto?',
      message: '¿Estás seguro de eliminar el contacto?'
    };
    this.suscripciones.push(
      this.uiService.mostrarConfirmDialog(data).afterClosed().subscribe(eliminar => { if (eliminar) this.clienteService.eliminarContacto(id) })
    );
  }

  ngOnDestroy() {
    this.suscripciones.forEach(sus => sus.unsubscribe());
  }


}
