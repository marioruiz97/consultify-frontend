import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {

  tieneDatosActividades = true;
  tieneDatosProyectos = true;

  cards = [
    {
      avatar: 'next_week', title: 'Proyectos', subtitle: 'Gestiona los proyectos de los clientes',
      img: '/assets/img/home-proyectos.png', content: '', button: 'Ir a proyectos', urlTo: '/proyectos'
    },
    {
      avatar: 'people_outline', title: 'Clientes', subtitle: 'Gestiona la información de clientes',
      img: '/assets/img/home-clientes.jpeg', content: '', button: 'Ir a clientes', urlTo: '/clientes'
    },
    {
      avatar: 'assignment_ind', title: 'Usuarios', subtitle: 'Gestiona a los diferentes usuarios',
      img: '/assets/img/home-usuarios.jpeg', content: '', button: 'Ir a usuarios', urlTo: '/usuarios'
    }
  ];


  onDatosDisponiblesActividades(event: boolean) {
    this.tieneDatosActividades = event;
  }


  onDatosDisponiblesProyectos(event: boolean) {
    this.tieneDatosProyectos = event;
  }

}
