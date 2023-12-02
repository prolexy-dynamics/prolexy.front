import { Component, Input } from '@angular/core';
import { Enumeration, EOF, Token } from 'prolexy.core';

@Component({
  selector: 'app-expression-enumeration-editor',
  templateUrl: './expression-enumeration-editor.component.html',
  styleUrls: ['./expression-enumeration-editor.component.sass']
})
export class ExpressionEnumerationEditorComponent {
  @Input() token: Token = EOF;
  text(){
    return this.token.text;
  }
}
