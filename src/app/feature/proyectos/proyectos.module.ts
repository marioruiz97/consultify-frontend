import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListaProyectosComponent } from './components/lista-proyectos/lista-proyectos.component';
import { FormularioProyectoComponent } from './components/formulario-proyecto/formulario-proyecto.component';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FilterComponent } from './components/lista-proyectos/filter/filter.component';
import { ProyectoService } from './service/proyecto.service';
import { MisProyectosComponent } from './components/mis-proyectos/mis-proyectos.component';
import { TableroProyectoComponent } from './components/tablero-proyecto/tablero-proyecto.component';
import { TableroProyectoService } from './service/tablero-proyecto.service';
import { MiembrosProyectoComponent } from './components/miembros-proyecto/miembros-proyecto.component';
import { NotificacionesProyectoComponent } from './components/notificaciones-proyecto/notificaciones-proyecto.component';
import { GestionarMiembrosProyectoComponent } from './components/gestionar-miembros-proyecto/gestionar-miembros-proyecto.component';
import { ActividadesModule } from '../actividades/actividades.module';



@NgModule({
  declarations: [
    ListaProyectosComponent,
    FormularioProyectoComponent,
    FilterComponent,
    MisProyectosComponent,
    TableroProyectoComponent,
    MiembrosProyectoComponent,
    NotificacionesProyectoComponent,
    GestionarMiembrosProyectoComponent
  ],
  imports: [
    AppRoutingModule,
    CommonModule,
    SharedModule,
    ActividadesModule
  ],
  exports: [MisProyectosComponent],
  providers: [
    ProyectoService,
    TableroProyectoService
  ]
})
export class ProyectosModule { }
