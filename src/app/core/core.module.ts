import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorHandlerProvider } from './interceptor/manejador-error';
import { SharedModule } from '../shared/shared.module';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { FooterComponent } from './components/footer/footer.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';

import { AppRoutingModule } from '../app-routing.module';
import { LoadingComponent } from './components/loading/loading.component';
import { AuthInterceptorProvider } from './interceptor/auth.interceptor';
import { HttpInterceptorProvider } from './interceptor/http.interceptor';



@NgModule({
  declarations: [SidenavComponent, ToolbarComponent, FooterComponent, ConfirmDialogComponent, LoadingComponent],
  imports: [
    AppRoutingModule,
    CommonModule,
    SharedModule
  ],
  exports: [SidenavComponent, ToolbarComponent, FooterComponent, LoadingComponent],
  providers: [ErrorHandlerProvider, AuthInterceptorProvider, HttpInterceptorProvider],
})
export class CoreModule { }
