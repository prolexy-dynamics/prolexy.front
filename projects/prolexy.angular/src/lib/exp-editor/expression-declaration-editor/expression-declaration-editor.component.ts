import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { EOF, Token } from 'prolexy.core';

@Component({
  selector: 'prolex-expression-declaration-editor',
  templateUrl: './expression-declaration-editor.component.html',
  styleUrls: ['./expression-declaration-editor.component.scss']
})
export class ExpressionDeclarationEditorComponent {
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
