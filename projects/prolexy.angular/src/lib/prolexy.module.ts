import { CommonModule, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { AppComponent } from './app.component';
import { routes } from './app.routes';
import { ExpressionDatetimeEditorComponent } from './exp-editor/expression-datetime-editor/expression-datetime-editor.component';
import { ExpressionDeclarationEditorComponent } from './exp-editor/expression-declaration-editor/expression-declaration-editor.component';
import { ExpressionEditorComponent } from './exp-editor/expression-editor/expression-editor.component';
import { ExpressionEnumerationEditorComponent } from './exp-editor/expression-enumeration-editor/expression-enumeration-editor.component';
import { ExpressionNumberEditorComponent } from './exp-editor/expression-number-editor/expression-number-editor.component';
import { ExpressionStringEditorComponent } from './exp-editor/expression-string-editor/expression-string-editor.component';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MaterialPersianDateAdapter, PERSIAN_DATE_FORMATS } from './shared/material.persian-date.adapter';


@NgModule({
  declarations: [
    AppComponent,
    ExpressionEditorComponent,
    ExpressionStringEditorComponent,
    ExpressionNumberEditorComponent,
    ExpressionEnumerationEditorComponent,
    ExpressionDatetimeEditorComponent,
    ExpressionDeclarationEditorComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatDatepickerModule,
    routes
  ],
  exports:[
    ExpressionEditorComponent,
  ],
  providers: [
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy,
    },
    {provide: DateAdapter, useClass: MaterialPersianDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: PERSIAN_DATE_FORMATS},
    Title
  ],
  bootstrap: [AppComponent],
})
export class ProlexyModule {
}
