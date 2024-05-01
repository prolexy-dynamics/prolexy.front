import { CommonModule, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { KendoJalaliDateInputsModule } from '@tiampersian/kendo-jalali-date-inputs';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isLeapYear from 'dayjs/plugin/isLeapYear';
import objectSupport from 'dayjs/plugin/objectSupport';
import relativeTime from 'dayjs/plugin/relativeTime';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import jalaliday from 'jalaliday';
import './date.helper';
import { ExpressionDatetimeEditorComponent } from './exp-editor/expression-datetime-editor/expression-datetime-editor.component';
import { ExpressionDeclarationEditorComponent } from './exp-editor/expression-declaration-editor/expression-declaration-editor.component';
import { ExpressionEditorComponent } from './exp-editor/expression-editor/expression-editor.component';
import { ExpressionEnumerationEditorComponent } from './exp-editor/expression-enumeration-editor/expression-enumeration-editor.component';
import { ExpressionNumberEditorComponent } from './exp-editor/expression-number-editor/expression-number-editor.component';
import { ExpressionStringEditorComponent } from './exp-editor/expression-string-editor/expression-string-editor.component';

// import zonePlugin from './dayjs-proto';

dayjs.extend(jalaliday);
dayjs.extend(customParseFormat);
dayjs.extend(objectSupport);
dayjs.extend(relativeTime);
dayjs.extend(isLeapYear);
dayjs.extend(timezone);
dayjs.extend(utc);

if (typeof window !== 'undefined') {
  (window as any)['dayjs'] = dayjs;
}

@NgModule({
  declarations: [
    ExpressionEditorComponent,
    ExpressionStringEditorComponent,
    ExpressionNumberEditorComponent,
    ExpressionEnumerationEditorComponent,
    ExpressionDatetimeEditorComponent,
    ExpressionDeclarationEditorComponent
  ],
  imports: [
    CommonModule,
    KendoJalaliDateInputsModule
  ],
  exports:[
    ExpressionEditorComponent,
  ],
  providers: [
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy,
    },
  ],
})
export class ProlexyModule {
}
