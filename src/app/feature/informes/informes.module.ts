import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InformeProyectoComponent } from './components/informe-proyecto/informe-proyecto.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { InformeService } from './service/informe.service';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';



@NgModule({
  declarations: [
    InformeProyectoComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    SharedModule
  ],
  providers: [InformeService]
})
export class InformesModule { }
