import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InformeProyectoComponent } from './components/informe-proyecto/informe-proyecto.component';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [
    InformeProyectoComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class InformesModule { }
