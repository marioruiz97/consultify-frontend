import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { KanbanActividadesComponent } from './components/kanban-actividades/kanban-actividades.component';
import { GestorActividadesService } from './service/gestor-actividades.service';
import { FormularioActividadComponent } from './components/formulario-actividad/formulario-actividad.component';
import { DetalleActividadComponent } from './components/detalle-actividad/detalle-actividad.component';



@NgModule({
  declarations: [
    KanbanActividadesComponent,
    FormularioActividadComponent,
    DetalleActividadComponent
  ],
  imports: [
    AppRoutingModule,
    CommonModule,
    SharedModule
  ],
  exports: [KanbanActividadesComponent],
  providers: [GestorActividadesService]
})
export class ActividadesModule { }
