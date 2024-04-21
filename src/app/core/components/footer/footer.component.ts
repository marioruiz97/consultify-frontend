import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FooterItem } from '../../model/footer-item.model';
import { AppConstants as rutas } from 'src/app/shared/app.constants';

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

  constructor() {
    this.proyectos = [
      { name: 'Proyectos', url: rutas.RUTA_PROYECTOS },
      { name: 'Informes', url: '/' },
      { name: 'Clientes', url: rutas.RUTA_CLIENTES },
    ];
    this.modulos = [
      { name: 'Usuarios', url: rutas.RUTA_USUARIOS },
      { name: 'Mi Perfil', url: rutas.RUTA_CUENTA },
    ];
    this.contacto = [
      { name: 'Contacto', url: rutas.RUTA_CONTACTO },
      { name: 'Acerca del Equipo', url: rutas.RUTA_ACERCA },
    ];
  }

}
