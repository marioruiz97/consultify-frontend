import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ReactiveFormsModule } from '@angular/forms';
import { AvatarModule } from "ngx-avatars";

const colors = ['#ff3400', '#f17722', '#2d4d69', '#314251', '#838787'];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MaterialModule,
    FlexLayoutModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    AvatarModule.forRoot({ colors })
  ],
  exports: [
    MaterialModule,
    FlexLayoutModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    AvatarModule
  ]
})
export class SharedModule { }
