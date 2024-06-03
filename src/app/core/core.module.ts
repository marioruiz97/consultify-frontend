import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorHandlerProvider } from './interceptor/manejador-error';
import { SharedModule } from '../shared/shared.module';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { FooterComponent } from './components/footer/footer.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { HttpInterceptorProvider } from './interceptor/auth.interceptor';
import { AppRoutingModule } from '../app-routing.module';



@NgModule({
  declarations: [SidenavComponent, ToolbarComponent, FooterComponent, ConfirmDialogComponent],
  imports: [
    AppRoutingModule,
    CommonModule,
    SharedModule
  ],
  exports: [SidenavComponent, ToolbarComponent, FooterComponent],
  providers: [ErrorHandlerProvider, HttpInterceptorProvider],
})
export class CoreModule { }
