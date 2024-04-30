import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { UIService } from 'src/app/core/service/ui.service';
import { ClienteService } from '../../service/cliente.service';
import { Cliente } from '../../model/cliente.model';
import { TipoDocumentoMap } from 'src/app/feature/usuarios/model/tipo-documento.model';

@Component({
  selector: 'app-lista-clientes',
  templateUrl: './lista-clientes.component.html',
  styleUrls: ['./lista-clientes.component.css']
})
export class ListaClientesComponent implements OnInit, AfterViewInit, OnDestroy {

  private listSub: Subscription[] = [];

  displayedColumns = ['identificacion', 'razonSocial', 'nombreComercial', 'contactos', 'acciones'];
  datasource = new MatTableDataSource<Cliente>();

  @ViewChild(MatSort) sort: MatSort = new MatSort();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private service: ClienteService, private dialog: MatDialog, private uiService: UIService
  ) { }

  ngOnInit() {
    this.obtenerTodosLosClientes();
  }

  ngAfterViewInit() {
    this.datasource.sort = this.sort;
    this.datasource.paginator = this.paginator;
  }

  private obtenerTodosLosClientes() {
    this.listSub.push(this.service.obtenerClientes().subscribe(list => this.datasource.data = list));
  }

  doFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.datasource.filter = filterValue.trim().toLowerCase();
  }

  mostrarTipoDocumento(tipo: string) {
    return TipoDocumentoMap.get(tipo)
  }

  eliminarCliente(arg0: any) {
    throw new Error('Method not implemented.');
  }

  ngOnDestroy(): void {
    this.listSub.forEach(sub => sub.unsubscribe());
  }

}
