import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InformeProyectoComponent } from './components/informe-proyecto/informe-proyecto.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { InformeService } from './service/informe.service';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { HttpClientModule } from '@angular/common/http';




@NgModule({
  declarations: [
    InformeProyectoComponent
  ],
  imports: [
    AppRoutingModule,
    HttpClientModule,
    CommonModule,
    SharedModule
  ],
  providers: [InformeService]
})
export class InformesModule { }
