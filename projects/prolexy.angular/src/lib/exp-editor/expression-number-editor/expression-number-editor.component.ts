import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
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
  value: number = 0;
  setValue(evt: any) {
    if (!isNaN(+evt.target.textContent))
      this.value = +evt.target.textContent;
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
  }
  _tmp: string | undefined;
  handleDigit(e: any) {
    var ch = String.fromCharCode(e.which);
    if (!isNaN(+ch) || (ch === '.' && (this._tmp?.toString().indexOf('.') ?? -1) < 0) || (ch === '-' && (this._tmp?.toString().indexOf('.') ?? -1) < 0)) return;
    e.preventDefault();
  }
}
