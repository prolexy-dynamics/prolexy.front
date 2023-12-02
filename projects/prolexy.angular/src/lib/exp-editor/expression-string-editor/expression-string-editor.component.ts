import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Token, EOF } from 'prolexy.core';

@Component({
  selector: 'app-expression-string-editor',
  templateUrl: './expression-string-editor.component.html',
  styleUrls: ['./expression-string-editor.component.sass']
})
export class ExpressionStringEditorComponent {
  @Input()
  mode: ('edit' | 'view') = 'view';

  _token: Token = EOF;
  @Input()
  get token(): Token { return this._token; }
  set token(val: Token) {
    this._token = val;
    this.value = val.value;
  }
  value: string | undefined;
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
    if (!this.token.editable) return;
    this.mode = 'edit';
    setTimeout(() => {
      this.mode = 'edit';
    }, 1);
  }
  switchToView() {
    this.mode = 'view';
    this.token.value = this.value;
  }
  setValue(evt: any) {
    this.value = evt.target.textContent;
  }
}
