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
import { ConfirmDialogComponent } from 'src/app/core/components/confirm-dialog/confirm-dialog.component';
import { ConfirmDialogData } from 'src/app/core/model/confirm-dialog-data.model';
import { RolMap } from 'src/app/core/model/usuario-sesion.model';
import { UIService } from 'src/app/core/service/ui.service';


@Component({
  selector: 'app-lista-usuarios',
  templateUrl: './lista-usuarios.component.html',
  styleUrls: ['./lista-usuarios.component.css']
})
export class ListaUsuariosComponent implements OnInit, AfterViewInit, OnDestroy {

  private listSub: Subscription[] = [];

  displayedColumns = ['nombres', 'apellidos', 'nombreUsuario', 'correo', 'telefono', 'rol', 'estado', 'acciones'];
  datasource = new MatTableDataSource<UsuarioLista>();

  @ViewChild(MatSort) sort: MatSort = new MatSort();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private service: UsuarioService, private dialog: MatDialog, public authService: AuthService, private uiService: UIService
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

  mostrarRol(rol: string) {
    return RolMap.get(rol);
  }

  cambiarEstado(activar: boolean, id: number, nombreUsuario: string) {
    if (activar) this.activar(id, nombreUsuario);
    else this.desactivar(id, nombreUsuario);
  }

  private desactivar(id: number, nombreUsuario: string) {
    const data: ConfirmDialogData = {
      title: "Desactivar la cuenta",
      message: `¿Estás seguro de desactivar la cuenta?`,
      errors: [],
      confirm: "Sí, deseo desactivar la cuenta",
      showCancel: true
    }
    this.listSub.push(this.dialog.open(ConfirmDialogComponent, { ...DIALOG_CONFIG, data }).afterClosed().subscribe(desactivado => {
      if (desactivado) this.service.desactivar(id)
        .then(res => {
          if (!res) {
            this.uiService.mostrarAlerta(`El usuario ${nombreUsuario} ha sido desactivado con éxito`);
            this.obtenerTodosUsuarios();
          }
        })
    }));
  }

  private activar(id: number, nombreUsuario: string) {
    const data: ConfirmDialogData = {
      title: "Activar la cuenta",
      message: `¿Estás seguro de activar la cuenta?`,
      errors: [],
      confirm: "Sí, deseo activar la cuenta",
      showCancel: true
    }
    this.listSub.push(this.dialog.open(ConfirmDialogComponent, { ...DIALOG_CONFIG, data }).afterClosed().subscribe(activado => {
      if (activado) this.service.cambiarEstado(id, true)
        .then(res => {
          if (res) {
            this.uiService.mostrarAlerta(`El usuario ${nombreUsuario} ha sido activado con éxito`);
            this.obtenerTodosUsuarios();
          }
        })
    }));
  }

  ngOnDestroy() {
    this.listSub.forEach(sub => sub.unsubscribe());
  }


}
