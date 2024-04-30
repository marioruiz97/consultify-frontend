import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    SharedModule
  ],
  templateUrl: './acerca-de.component.html',
  styleUrls: ['./acerca-de.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AcercaDeComponent {

  equipo = [
    { nombre: 'Mario Andrés Ruiz Bedoya', cargo: 'Analista/Desarrollador', class: 'fab-icon mario-photo' },
    { nombre: 'Juan Pablo Patiño Bedoya', cargo: 'Analista/Desarrollador', class: 'fab-icon juan-photo' },
  ];

}
