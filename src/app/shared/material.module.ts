import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { MatMomentDateModule } from '@angular/material-moment-adapter';



import { MAT_DATE_LOCALE } from '@angular/material/core';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatDividerModule,
    MatDialogModule,
    MatPaginatorModule,
    MatTableModule,
    MatSnackBarModule,
    MatSelectModule,
    MatExpansionModule,
    MatSlideToggleModule,
    MatProgressBarModule,
    MatTabsModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatMomentDateModule
  ],
  exports: [
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatDividerModule,
    MatDialogModule,
    MatPaginatorModule,
    MatTableModule,
    MatSnackBarModule,
    MatSelectModule,
    MatExpansionModule,
    MatSlideToggleModule,
    MatProgressBarModule,
    MatTabsModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatMomentDateModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es' },
  ],
})
export class MaterialModule { }
