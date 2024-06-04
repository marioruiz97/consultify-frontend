import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FooterItem } from '../../model/footer-item.model';
import { AppConstants as rutas } from 'src/app/shared/app.constants';
import { RoleService } from '../../service/role.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {

  proyectos: FooterItem[];
  modulos: FooterItem[];
  contacto: FooterItem[];

  constructor(public rolService: RoleService) {
    this.proyectos = [
      { name: 'Proyectos', url: rutas.RUTA_PROYECTOS, roles: [] },
      { name: 'Informes', url: rutas.RUTA_INFORMES, roles: [] },
      { name: 'Clientes', url: rutas.RUTA_CLIENTES, roles: ['ROLE_ADMIN', 'ROLE_ASESOR'] },
    ];
    this.modulos = [
      { name: 'Usuarios', url: rutas.RUTA_USUARIOS, roles: ['ROLE_ADMIN', 'ROLE_ASESOR'] },
      { name: 'Tipos de Actividad', url: rutas.RUTA_TIPO_ACTIVIDAD, roles: ['ROLE_ADMIN', 'ROLE_ASESOR'] },
      { name: 'Mi Perfil', url: rutas.RUTA_CUENTA, roles: [] },
    ];
    this.contacto = [
      { name: 'Contacto', url: rutas.RUTA_CONTACTO, roles: [] },
      { name: 'Acerca del Equipo', url: rutas.RUTA_ACERCA, roles: [] },
    ];
  }

}
