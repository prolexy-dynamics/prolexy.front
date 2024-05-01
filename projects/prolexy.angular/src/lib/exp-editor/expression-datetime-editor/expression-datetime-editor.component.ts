import { Component, EventEmitter, Inject, Input, LOCALE_ID, Output, ViewChild } from '@angular/core';
import dayjs from 'dayjs';
import { EOF, Token } from 'prolexy.core';

@Component({
  selector: 'app-expression-datetime-editor',
  templateUrl: './expression-datetime-editor.component.html',
  styleUrls: ['./expression-datetime-editor.component.sass']
})
export class ExpressionDatetimeEditorComponent {
  @Output() valueChange = new EventEmitter();
  _mode: ('edit' | 'view') = 'view';
  calandarType: 'jalali' | 'gregory';
  @Input()
  get mode(): ('edit' | 'view') {
    return this._mode;
  }
  set mode(val: ('edit' | 'view')) {
    this._mode = val;
  }
  text = '';
  setText() {
    this.text = !this.value ? '' : dayjs(this.value).calendar(this.calandarType).locale(this.localeId).format('YYYY/MM/DD');
  }
  @Input()
  token: Token = EOF;
  _value: any; 
  get value(): any {
    return this._value ?? (this._value = this.token.value ? dayjs(this.token.value, 'YYYY/MM/DD').toDate() as any : new Date);
  }
  public set value(val: any) {
    this.token.value = !val ? '' : dayjs(val).format('YYYY/MM/DD');
    this.valueChange.emit(this.token.value);
    this.setText();
    this._value = null;
  }

  @ViewChild('picker') set picker(v: any) {
    v?.toggle(true);
  }

  constructor(@Inject(LOCALE_ID) private localeId: string) {
    this.calandarType = (localeId === 'fa' || localeId === 'fa-IR') ? 'jalali' : 'gregory';
  }

  changeDate(value: Date) {
    this.value = value;
  }
}
