import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { KanbanActividadesComponent } from './components/kanban-actividades/kanban-actividades.component';



@NgModule({
  declarations: [
    KanbanActividadesComponent
  ],
  imports: [
    AppRoutingModule,
    CommonModule,
    SharedModule
  ]
})
export class ActividadesModule { }
