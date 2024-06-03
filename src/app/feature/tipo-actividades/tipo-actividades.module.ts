import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { TipoActividadesService } from './service/tipo-actividades.service';



@NgModule({
  declarations: [],
  imports: [
    AppRoutingModule,
    CommonModule,
    SharedModule
  ],
  exports: [],
  providers: [TipoActividadesService]
})
export class TipoActividadesModule { }
