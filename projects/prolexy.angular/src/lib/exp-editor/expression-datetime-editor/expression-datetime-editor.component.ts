import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import * as moment from 'jalali-moment';
import { EOF, Token } from 'prolexy.core';

@Component({
  selector: 'prolex-expression-datetime-editor',
  templateUrl: './expression-datetime-editor.component.html',
  styleUrls: ['./expression-datetime-editor.component.sass']
})
export class ExpressionDatetimeEditorComponent {
  _mode: ('edit' | 'view') = 'view';
  @Output() valueChange = new EventEmitter();
  @Input()
  get mode(): ('edit' | 'view') {
    return this._mode;
  }
  set mode(val: ('edit' | 'view')) {
    this._mode = val;
    // if (val === 'view')
    //   this.token.value = this.value.format ? this.value.locale('en').format('YYYY/MM/DD') : this.value.toLocaleDateString();
    // else
    //   this.value = this.token.value ? moment.from(this.token.value, 'en', 'YYYY/MM/DD') as any : new Date;
  }
  text = '';
  setText() {
    this.text = this.value.format ? this.value.locale('fa').format('YYYY/MM/DD') : this.value.toLocaleDateString('fa');
  }
  @Input()
  token: Token = EOF;
  _value: any;
  public get value(): any {
    return this._value ?? (this._value = this.token.value ? moment.from(this.token.value, 'en', 'YYYY/MM/DD') as any : new Date);
  }
  public set value(val: any) {
    this.token.value = val.format ? val.locale('en').format('YYYY/MM/DD') : val.toLocaleDateString();
    this.valueChange.emit(this.token.value);
    this.setText();
    this._value = null;
  }

  @ViewChild('picker')
  public set picker(v: any) {
    v?.open();
  }

  changeDate(value: Date) {
    this.value = value;
  }
}
