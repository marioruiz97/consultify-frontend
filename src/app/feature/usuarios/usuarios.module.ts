import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListaUsuariosComponent } from './components/lista-usuarios/lista-usuarios.component';
import { FormularioUsuarioComponent } from './components/formulario-usuario/formulario-usuario.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { DetalleUsuarioComponent } from './components/detalle-usuario/detalle-usuario.component';
import { UsuarioService } from './service/usuario.service';



@NgModule({
  declarations: [
    ListaUsuariosComponent,
    FormularioUsuarioComponent,
    DetalleUsuarioComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    AppRoutingModule
  ],
  providers: [UsuarioService]
})
export class UsuariosModule { }
