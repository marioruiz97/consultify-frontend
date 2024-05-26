import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InformeProyectoComponent } from './components/informe-proyecto/informe-proyecto.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { InformeService } from './service/informe.service';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    InformeProyectoComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule
  ],
  providers: [InformeService]
})
export class InformesModule { }
