import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Contacto } from '../../model/cliente.model';
import { ClienteService } from '../../service/cliente.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormularioContactosComponent } from '../formulario-contactos/formulario-contactos.component';

@Component({
  selector: 'app-lista-contactos',
  templateUrl: './lista-contactos.component.html',
  styleUrls: ['./lista-contactos.component.css']
})
export class ListaContactosComponent implements AfterViewInit, OnDestroy {

  private suscripciones: Subscription[] = [];

  displayedColumns = ['nombreCompleto', 'cargo', 'telefono', 'correo', 'acciones'];
  datasource = new MatTableDataSource<Contacto>();

  @ViewChild(MatSort, { static: false }) sort: MatSort = new MatSort();
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  constructor(private clienteService: ClienteService, private dialog: MatDialog) {
    this.suscripciones.push(this.clienteService.contactos$.subscribe(listaContactos => this.datasource.data = listaContactos));
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
    this.clienteService.eliminarContacto(id);
  }

  ngOnDestroy() {
    this.suscripciones.forEach(sus => sus.unsubscribe());
  }


}
