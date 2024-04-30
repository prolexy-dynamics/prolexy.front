import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Token, EOF } from 'prolexy.core';

@Component({
  selector: 'app-expression-number-editor',
  templateUrl: './expression-number-editor.component.html',
  styleUrls: ['./expression-number-editor.component.sass']
})
export class ExpressionNumberEditorComponent {
  _mode: ('edit' | 'view') = 'view';
  @Input()
  get mode(): ('edit' | 'view') { return this._mode; }
  set mode(val: ('edit' | 'view')) {
    this._mode = val;
    if (val == 'edit') this.switchToEdit();
  }
  @Input()
  token: Token = EOF;
  private _value: number = 0;
  @Output() valueChange = new EventEmitter();
  @Input() get value(): number {
    return this._value;
  }
  set value(val: number) {  // this value is updated by programmatic changes if( val !== undefined && this.val !== val){
    if (val === this._value) return;
    this._value = val;
    this._tmp = val.toString();
  }
  setValue(evt: any) {
    if (!isNaN(+evt.target.textContent))
      this._value = +evt.target.textContent;
    this._tmp = evt.target.textContent;
  }
  private _element?: ElementRef;
  public get element(): ElementRef | undefined {
    return this._element;
  }
  @ViewChild('myInput')
  public set element(v: ElementRef | undefined) {
    this._element = v;
    this.element?.nativeElement.focus();
  }

  switchToEdit() {
    this.value = parseFloat(this.token.value ?? '0');
    this._tmp = this.value.toString();
  }
  switchToView() {
    this._mode = 'view';
    this.token.value = this.value.toString();
    this.valueChange.emit(this._value);
  }
  _tmp: string | undefined;
  handleDigit(e: any) {
    var ch = String.fromCharCode(e.which);
    if (!isNaN(+ch) || (ch === '.' && (this._tmp?.toString().indexOf('.') ?? -1) < 0) || (ch === '-' && (this._tmp?.toString().indexOf('.') ?? -1) < 0)) return;
    e.preventDefault();
  }
}
