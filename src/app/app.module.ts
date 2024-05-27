import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core/core.module';
import { AutenticacionModule } from './feature/autenticacion/autenticacion.module';
import { HttpClientModule } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { UsuariosModule } from './feature/usuarios/usuarios.module';
import { ClientesModule } from './feature/clientes/clientes.module';
import { ProyectosModule } from './feature/proyectos/proyectos.module';
import { HomeComponent } from './feature/otros/home/home.component';
import { InformesModule } from './feature/informes/informes.module';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { DatePipe, registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { ActividadesModule } from './feature/actividades/actividades.module';


registerLocaleData(localeEs);
const MatLocale = { provide: MAT_DATE_LOCALE, useValue: 'es-ES' };
const AppDateAdapter = { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] };

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    HttpClientModule,
    FontAwesomeModule,
    CoreModule,
    AutenticacionModule,
    ActividadesModule,
    UsuariosModule,
    ClientesModule,
    ProyectosModule,
    InformesModule
  ],
  providers: [
    MatLocale,
    AppDateAdapter,
    DatePipe,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
