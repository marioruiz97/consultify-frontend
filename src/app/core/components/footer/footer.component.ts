import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FooterItem } from '../../model/footer-item.model';

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
      { name: 'Proyectos', url: '/proyectos' },
      { name: 'Informes', url: '/' },
      { name: 'Clientes', url: '/clientes' },
    ];
    this.modulos = [
      { name: 'Maestros', url: '/maestros' },
      { name: 'Usuarios', url: '/usuarios' },
      { name: 'Mi Perfil', url: '/micuenta' },
    ];
    this.contacto = [
      { name: 'Contacto', url: '/contacto' },
      { name: 'Acerca del Equipo', url: '/acerca' },
    ];
  }

}
