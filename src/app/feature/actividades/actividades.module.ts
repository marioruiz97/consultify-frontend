import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { KanbanActividadesComponent } from './components/kanban-actividades/kanban-actividades.component';
import { GestorActividadesService } from './service/gestor-actividades.service';
import { FormularioActividadComponent } from './components/formulario-actividad/formulario-actividad.component';
import { DetalleActividadComponent } from './components/detalle-actividad/detalle-actividad.component';
import { SeguimientoActividadComponent } from './components/seguimiento-actividad/seguimiento-actividad.component';
import { ProximasActividadesComponent } from './components/proximas-actividades/proximas-actividades.component';
import { MisProximasActividadesComponent } from './components/mis-proximas-actividades/mis-proximas-actividades.component';
import { MisActividadesService } from './service/mis-actividades.service';



@NgModule({
  declarations: [
    KanbanActividadesComponent,
    FormularioActividadComponent,
    DetalleActividadComponent,
    SeguimientoActividadComponent,
    ProximasActividadesComponent,
    MisProximasActividadesComponent
  ],
  imports: [
    AppRoutingModule,
    CommonModule,
    SharedModule
  ],
  exports: [KanbanActividadesComponent, ProximasActividadesComponent, MisProximasActividadesComponent],
  providers: [GestorActividadesService, MisActividadesService]
})
export class ActividadesModule { }
