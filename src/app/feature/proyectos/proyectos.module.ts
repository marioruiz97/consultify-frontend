import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListaProyectosComponent } from './components/lista-proyectos/lista-proyectos.component';
import { FormularioProyectoComponent } from './components/formulario-proyecto/formulario-proyecto.component';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FilterComponent } from './components/lista-proyectos/filter/filter.component';
import { ProyectoService } from './service/proyecto.service';



@NgModule({
  declarations: [
    ListaProyectosComponent,
    FormularioProyectoComponent,
    FilterComponent
  ],
  imports: [
    AppRoutingModule,
    CommonModule,
    SharedModule
  ],
  providers: [
    ProyectoService
  ]
})
export class ProyectosModule { }
