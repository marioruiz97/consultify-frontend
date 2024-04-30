import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListaClientesComponent } from './components/lista-clientes/lista-clientes.component';
import { FormularioClienteComponent } from './components/formulario-cliente/formulario-cliente.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { ClienteService } from './service/cliente.service';



@NgModule({
  declarations: [
    ListaClientesComponent,
    FormularioClienteComponent
  ],
  imports: [
    AppRoutingModule,
    CommonModule,
    SharedModule
  ],
  providers: [ClienteService]
})
export class ClientesModule { }
