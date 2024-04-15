import { ErrorHandler, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManejadorError } from './interceptor/manejador-error';
import { SharedModule } from '../shared/shared.module';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { RouterModule } from '@angular/router';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { FooterComponent } from './components/footer/footer.component';



@NgModule({
  declarations: [SidenavComponent, ToolbarComponent, FooterComponent],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule
  ],
  exports: [SidenavComponent, ToolbarComponent, FooterComponent],
  providers: [{ provide: ErrorHandler, useClass: ManejadorError }],
})
export class CoreModule { }
