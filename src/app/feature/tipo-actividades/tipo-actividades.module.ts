import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { TipoActividadesService } from './service/tipo-actividades.service';
import { ListaTipoActividadesComponent } from './components/lista-tipo-actividades/lista-tipo-actividades.component';
import { FormularioTipoActividadesComponent } from './components/formulario-tipo-actividades/formulario-tipo-actividades.component';



@NgModule({
  declarations: [
    ListaTipoActividadesComponent,
    FormularioTipoActividadesComponent
  ],
  imports: [
    AppRoutingModule,
    CommonModule,
    SharedModule
  ],
  exports: [],
  providers: [TipoActividadesService]
})
export class TipoActividadesModule { }
