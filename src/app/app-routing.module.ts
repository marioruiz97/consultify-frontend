import { NgModule } from '@angular/core';
import { RouterModule, Routes, mapToCanActivate } from '@angular/router';
import { HomeComponent } from './feature/otros/home/home.component';
import { InicioSesionComponent } from './feature/autenticacion/components/inicio-sesion/inicio-sesion.component';
import { RecuperarContrasenaComponent } from './feature/autenticacion/components/recuperar-contrasena/recuperar-contrasena.component';
import { MiPerfilComponent } from './feature/autenticacion/components/mi-perfil/mi-perfil.component';
import { ListaUsuariosComponent } from './feature/usuarios/components/lista-usuarios/lista-usuarios.component';
import { FormularioUsuarioComponent } from './feature/usuarios/components/formulario-usuario/formulario-usuario.component';
import { AppConstants as rutas } from './shared/app.constants';
import { AuthGuard } from './core/guard/auth.guard';
import { AcercaDeComponent } from './feature/otros/acerca-de/acerca-de.component';
import { ContactenosComponent } from './feature/otros/contactenos/contactenos.component';
import { ListaClientesComponent } from './feature/clientes/components/lista-clientes/lista-clientes.component';
import { FormularioClienteComponent } from './feature/clientes/components/formulario-cliente/formulario-cliente.component';
import { ListaProyectosComponent } from './feature/proyectos/components/lista-proyectos/lista-proyectos.component';
import { TableroProyectoComponent } from './feature/proyectos/components/tablero-proyecto/tablero-proyecto.component';
import { DetalleActividadComponent } from './feature/actividades/components/detalle-actividad/detalle-actividad.component';
import { InformeProyectoComponent } from './feature/informes/components/informe-proyecto/informe-proyecto.component';
import { RoleGuard } from './core/guard/role.guard';
import { NuevaContrasenaComponent } from './feature/autenticacion/components/nueva-contrasena/nueva-contrasena.component';
import { VerificarCuentaComponent } from './feature/autenticacion/components/verificar-cuenta/verificar-cuenta.component';
import { VerificarCuentaNuevaComponent } from './feature/autenticacion/components/verificar-cuenta-nueva/verificar-cuenta-nueva.component';

const routes: Routes = [
  // módulos generales
  { path: '', redirectTo: `/${rutas.RUTA_HOME}`, pathMatch: 'full' },
  { path: rutas.RUTA_HOME, component: HomeComponent, canActivate: mapToCanActivate([AuthGuard]) },
  { path: rutas.RUTA_ACERCA, component: AcercaDeComponent },
  { path: rutas.RUTA_CONTACTO, component: ContactenosComponent },

  // autenticacion y cuenta
  { path: rutas.RUTA_LOGIN, component: InicioSesionComponent },
  { path: rutas.RUTA_RECUPERAR, component: RecuperarContrasenaComponent },

  { path: rutas.RUTA_REINICIAR_CLAVE, component: NuevaContrasenaComponent },
  { path: rutas.RUTA_VERIFICAR_CUENTA, component: VerificarCuentaComponent },
  { path: `${rutas.RUTA_VERIFICAR_CUENTA}/:id`, component: VerificarCuentaNuevaComponent },

  { path: rutas.RUTA_CUENTA, component: MiPerfilComponent, canActivate: mapToCanActivate([AuthGuard]) },

  // usuarios y clientes
  { path: rutas.RUTA_USUARIOS, component: ListaUsuariosComponent, canActivate: mapToCanActivate([AuthGuard, RoleGuard]) }, // rutas protegidas con RoleGuard ya que son solo para personal de asisge
  { path: `${rutas.RUTA_USUARIOS}/:id`, component: FormularioUsuarioComponent, canActivate: mapToCanActivate([AuthGuard, RoleGuard]) },
  { path: rutas.RUTA_CLIENTES, component: ListaClientesComponent, canActivate: mapToCanActivate([AuthGuard, RoleGuard]) },
  { path: `${rutas.RUTA_CLIENTES}/:id`, component: FormularioClienteComponent, canActivate: mapToCanActivate([AuthGuard, RoleGuard]) },

  // proyectos
  { path: rutas.RUTA_PROYECTOS, component: ListaProyectosComponent, canActivate: mapToCanActivate([AuthGuard]) },
  { path: `${rutas.RUTA_PROYECTOS}/:id`, component: TableroProyectoComponent, canActivate: mapToCanActivate([AuthGuard]) },
  { path: `${rutas.RUTA_PROYECTOS}/:idProyecto/actividades/:idActividad`, component: DetalleActividadComponent, canActivate: mapToCanActivate([AuthGuard]) },

  // informes
  { path: rutas.RUTA_INFORMES, component: InformeProyectoComponent, canActivate: mapToCanActivate([AuthGuard]) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
