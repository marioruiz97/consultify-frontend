import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { TableroProyectoService } from '../../service/tablero-proyecto.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/service/auth.service';
import { UsuarioSesion } from 'src/app/core/model/usuario-sesion.model';
import { MiembroProyecto } from '../../model/miembros/miembro-proyecto.model';

@Component({
  selector: 'app-miembros-proyecto',
  templateUrl: './miembros-proyecto.component.html',
  styleUrls: ['./miembros-proyecto.component.css']
})
export class MiembrosProyectoComponent implements OnInit, OnDestroy {

  miUsuario: UsuarioSesion | null;
  private $miembros: MiembroProyecto[] = [];
  private subs: Subscription[] = [];

  constructor(
    private tableroService: TableroProyectoService, private authService: AuthService, private detector: ChangeDetectorRef
  ) {
    this.miUsuario = this.authService.obtenerUsuarioSesion();
  }

  ngOnInit() {
    this.fetchData();
  }

  public get miembros() {
    if (this.miUsuario) {
      return this.$miembros.filter(miembro => (miembro.usuario.idUsuario !== this.miUsuario?.idUsuario) && (miembro.nombreUsuario !== this.miUsuario?.nombreUsuario));
    } else return this.$miembros;
  }

  private fetchData() {
    this.tableroService.tableroActual.subscribe(tablero => this.$miembros = tablero ? tablero.infoProyecto.miembros : []);
  }

  /**
   * si hay un usuario en sesion y hace parte de los miembros del proyecto retorna true, de otra forma false
   * @returns boolean soyMiembro
   */
  soyMiembro(): boolean {
    return (this.miUsuario && this.$miembros?.find(miembro => miembro.nombreUsuario === this.miUsuario?.nombreUsuario)) !== undefined;
  }

  getNombre() {
    return `${this.miUsuario?.nombreCompleto}`;
  }

  getMiembroName(miembro: MiembroProyecto) {
    const user = miembro.usuario;
    return `${user.nombres} ${user.apellidos}`;
  }

  ngOnDestroy() {
    if (this.subs) { this.subs.forEach(sub => sub.unsubscribe()); }
  }

}
