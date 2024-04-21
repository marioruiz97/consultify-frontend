import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/service/auth.service';
import { UsuarioLista } from '../../model/usuario-lista.model';
import { DetalleUsuarioComponent } from '../detalle-usuario/detalle-usuario.component';
import { DIALOG_CONFIG } from 'src/app/shared/app.constants';
import { UsuarioService } from '../../service/usuario.service';


@Component({
  selector: 'app-lista-usuarios',
  templateUrl: './lista-usuarios.component.html',
  styleUrls: ['./lista-usuarios.component.css']
})
export class ListaUsuariosComponent implements OnInit, AfterViewInit, OnDestroy {

  private listSub: Subscription[] = [];

  displayedColumns = ['nombres', 'apellidos', 'correo', 'telefono', 'rol', 'estado', 'acciones'];
  datasource = new MatTableDataSource<UsuarioLista>();

  @ViewChild(MatSort) sort: MatSort = new MatSort();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private service: UsuarioService, private dialog: MatDialog, public authService: AuthService
  ) { }

  ngOnInit() {
    this.obtenerTodosUsuarios();
  }

  ngAfterViewInit() {
    this.datasource.sort = this.sort;
    this.datasource.paginator = this.paginator;
  }

  obtenerTodosUsuarios() {
    this.listSub.push(this.service.obtenerUsuarios().subscribe(list => this.datasource.data = list));
  }

  doFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.datasource.filter = filterValue.trim().toLowerCase();
  }

  mostrarDetalles(usuario: UsuarioLista) {
    const ref = this.dialog.open(DetalleUsuarioComponent, { ...DIALOG_CONFIG, data: usuario });
    this.listSub.push(ref.afterClosed().subscribe(res => { if (res) { this.obtenerTodosUsuarios(); } }));
  }


  desactivar(id: string) {
    this.listSub.push(this.service.delete(id).subscribe(res => {
      if (res) { this.obtenerTodosUsuarios(); }
    }));
  }

  ngOnDestroy() {
    if (this.listSub) { this.listSub.forEach(sub => sub.unsubscribe()); }
  }


}
