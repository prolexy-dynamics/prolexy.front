import { Component, Directive, ElementRef, EventEmitter, Host, HostListener, Input, OnDestroy, OnInit, Optional, Output, QueryList, SkipSelf, ViewChild, ViewChildren, forwardRef } from '@angular/core';
import { AbstractControl, ControlContainer, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator, ValidatorFn } from '@angular/forms';
import { Span, ContextSchema, EOF, Operations, PrimitiveTypes, Token, TokenType, AstVisitor, SyntaxErrorContext, Lexer, IType, ProlexyContext, createTypeFromJson, ITypeData, context } from 'prolexy.core';
import { suggestNextTokensInStatementMode, suggestNextTokensInExpressionMode, Parser } from 'prolexy.core';
import { SyntaxErrorVisitor, SemanticErrorAnalizer, SemanticErrorContext } from 'prolexy.core'
import { CoderVisitor } from 'prolexy.core';
import { ContextSchemaRepositoryService } from '../../shared/context-schema-repository.service';

@Component({
  selector: 'prolex-expression-editor',
  templateUrl: './expression-editor.component.html',
  styleUrls: ['./expression-editor.component.sass'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => ExpressionEditorComponent), multi: true },
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => ExpressionEditorComponent), multi: true }
  ]
})
export class ExpressionEditorComponent implements ControlValueAccessor, OnInit, Validator, OnDestroy {
  private repository: ContextSchemaRepositoryService = new ContextSchemaRepositoryService();
  private lexer: Lexer = new Lexer();

  private _expectedType: IType | undefined;
  @Input() get expectedType(): IType | undefined {
    return this._expectedType;
  }
  set expectedType(value: IType | undefined) {
    if (value !== this._expectedType) {
      this._expectedType = value;
      this.updateValue();
      return;
    }
    this._expectedType = value;
  }
  //#region "implementation of ControlValueAccessor"
  onChange: any = () => { }
  onTouch: any = () => { }
  val = "" // this is the updated value that the class accesses
  @Output() valueChange = new EventEmitter();
  @Input() get value() {
    return this.val;
  }
  set value(val: string) {  // this value is updated by programmatic changes if( val !== undefined && this.val !== val){
    if (val === this.val) return;
    this.setNewValue(val);
  }
  // this method sets the value programmatically
  writeValue(value: string) {
    if (value === this.val) return;
    this.setNewValue(value);
  }

  private setValueFromTokens() {
    var parser = new Parser(this.tokens);
    var ast = this.editorMode === 'statement' ? parser.parseStatements() : parser.parseExpression();
    var visitor = new CoderVisitor();
    this.val = ast.visit(visitor, {}) + ' $';
    this.updateValue();
  }

  updateValue(setFromToken: boolean = false) {
    if (setFromToken)
      this.setValueFromTokens();
    this.onChange(this.val);
    this.onTouch(this.val);
    this.valueChange.emit(this.val);
  }

  private setNewValue(val: string) {
    if (!val || this.val === val)
      return;
    this.tokens.splice(0, this.tokens.length);
    for (var t of this.lexer.Tokenize(val))
      this.tokens.push(t);

    this.showErrors();
    this.val = val + (val.indexOf('$') > -1 ? '' : ' $');
    // this.onChange(val);
    // this.onTouch(val);
  }

  // upon UI element value changes, this method gets triggered
  registerOnChange(fn: any) {
    this.onChange = fn
  }
  // upon touching the element, this method gets triggered
  registerOnTouched(fn: any) {
    this.onTouch = fn
  }
  //#endregion "implementation of ControlValueAccessor"

  //#region "implementation of Validator and OnDestroy"

  validate(control: AbstractControl): { [key: string]: any } | null {
    if (control.valid && this.editorMode === 'expression' && this.expectedType)
      return createExpressionValidator(this.schema, this.expectedType)(control);
    return null;
  }
  ngOnDestroy(): void {
    this.validate = () => null;
  }
  //#endregion ""
  ngOnInit(): void {
  }
  @ViewChildren('tokens') tokenElements: QueryList<ElementRef> = null!;

  private _schema: ContextSchema = new ContextSchema(this.repository, "", [], [], []);
  @Input()
  get schema(): ContextSchema { return this._schema; }
  set schema(typeData: any) {
    if (!typeData) return;
    if (typeData instanceof ContextSchema) {
      this._schema = typeData;
      return;
    }
    var prolexyContext: ProlexyContext = new ProlexyContext();
    Object.assign(prolexyContext, typeData);
    var data = createTypeFromJson(this.repository, prolexyContext);

    this.schema = data.businessObjectTypeData.createType(data) as ContextSchema;
  }
  @Input() tokens: Array<Token> = [];
  @Input() beginScope: Array<string> = ['then', 'else'];
  @Input() endScope: Array<string> = ['else', 'end'];
  @Input()
  @Output() $errors = new EventEmitter<Array<{ span: Span, message: string }>>();;
  errors = new Array<{ span: Span, message: string }>();
  errorMessages = new Array<{ span: Span, message: string }>();
  TokenType = TokenType;
  PrimitiveTypes = PrimitiveTypes;
  @Input() editorMode: ('expression' | 'statement') = 'statement';
  editModes: { [key: number]: ('edit' | 'view') } = [];
  suggestionOpened: number = -1;
  suggestions: Array<Token> = [];
  filterString: string = '';
  @ViewChild('container', { static: false }) divContainer: ElementRef = null!;

  async showSuggestion(idx: number, e: any) {
    idx = idx < 0 ? this.tokens.length - 1 : idx % this.tokens.length;
    this.tokenElements.get(idx)?.nativeElement.focus();
    if (this.suggestionOpened === idx) return;
    this.filterString = '';
    this.suggestionOpened = idx;
    this.suggestions = await (this.editorMode === 'statement' ? suggestNextTokensInStatementMode : suggestNextTokensInExpressionMode)(this.schema, this.tokens, idx);
    var balanced = 0;
    if (!this.suggestions.find(t => t.tokenType === TokenType.operation && t.value === Operations.end_parentese)) {
      for (var i = 0; i < idx; i++)
        if (this.tokens[i].tokenType === TokenType.operation)
          if (this.tokens[i].value === Operations.begin_parentese) balanced++;
          else if (this.tokens[i].value === Operations.end_parentese) balanced--;
      if (balanced > 0)
        this.suggestions.push(Token.operator(Operations.end_parentese));
    }
    this.suggestions = this.suggestions.filter(onlyUnique);
  }
  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    if (!this.divContainer.nativeElement.contains(event.target)) {
      this.hideSuggestion();
    }
  }
  filter(e: KeyboardEvent) {
    if (e.key.length === 1)
      this.filterString += e.key;
    else if (e.key === 'Backspace' && this.filterString.length)
      this.filterString = this.filterString.substring(0, this.filterString.length - 1).toLowerCase();
    else return;
    e.stopPropagation();
  }
  getSuggestions() {
    return this.suggestions.filter(a => a.text && a.text.toLowerCase().indexOf(this.filterString) > -1);
  }
  hideSuggestion() {
    this.suggestionOpened = -1;
  }
  translate(type: TokenType, idx: number): any {
    var res = { error: this.hasError(idx) != null };
    switch (type) {
      case TokenType.const:
        return { ...res, 'const': true };
      case TokenType.identifier:
        return { ...res, 'identifier': true };
      case TokenType.keyword:
        return { ...res, 'keyword': true };
      case TokenType.operation:
        return { ...res, 'operations': true };
    }
  }

  selectNextToken($event: any) {
    this.showSuggestion(this.suggestionOpened + 1, null);
    $event?.preventDefault();
  }
  activeSuggestion: number = 0;
  traversOnSuggestions($event: any, direction: number) {
    $event.preventDefault();
    if (this.suggestions?.length)
      this.activeSuggestion = (this.activeSuggestion + direction + this.suggestions.length) % this.suggestions.length;
  }
  selectToken(suggestionIndex: number, replace: boolean, e: any) {
    e.stopPropagation();
    var t = this.getSuggestions()[suggestionIndex];
    if (!t) return;
    this.tokens.splice(this.suggestionOpened, 0, t);
    if (t.tokenType === TokenType.const && t.type !== PrimitiveTypes.enum) {
      this.editModes[this.suggestionOpened] = 'edit';
    }
    else {
      this.showSuggestion(this.suggestionOpened + 1, null);
    }
    this.showErrors();
    this.setValueFromTokens();
  }
  remove(idx: number) {
    if (this.tokens[idx] === EOF || this.tokens.length === 1) return;
    this.tokens.splice(idx, 1);
    this.suggestionOpened = idx;
    setTimeout(() => {
      this.tokenElements.get(idx)?.nativeElement.focus();
      this.showErrors();
      this.setValueFromTokens();
    }, 10);
  }
  showErrors() {
    this.errors = this.getError(this.tokens);
    this.$errors.emit(this.errors);
  }
  private getError(tokens: Array<Token>) {
    var parser = new Parser(tokens);
    var ast = this.editorMode === 'statement' ? parser.parseStatements() : parser.parseExpression();
    var visitor = new SyntaxErrorVisitor();
    var context = new SemanticErrorContext(this.schema);
    if (ast.span.end < this.tokens.length - 2) // one for $ and one for starting index
      context.errors.push({ span: new Span(ast.span.end, ast.span.end), message: 'unexpected token' });
    ast.visit(visitor as any, context);
    var visitor1 = new SemanticErrorAnalizer();
    ast.visit(visitor1 as any, context);
    return context.errors;
  }

  hasError(idx: number) {
    var res = this.errors.filter(s => s.span.contains(idx))
      .map(a => a.message)
      .join(', ');
    return res ? res : null;
  }
  showErrorMessages(idx: number) {
    this.errorMessages = this.errors.filter(s => s.span.contains(idx));
  }
  mustBreakBefor(idx: number) {
    var t: Token = this.tokens[idx];
    return (t.tokenType === TokenType.keyword && t.value) && (t.value.indexOf('else') > -1 || t.value.indexOf('end') > -1);
  }
  mustBreakAfter(idx: number) {
    var t: Token = this.tokens[idx];
    var nt = this.tokens[idx + 1];
    return (t.tokenType === TokenType.keyword && t.value) && (t.value.indexOf('then') > -1 || (t.value.indexOf('else') > -1));
  }
  scope(idx: number) {
    var scope = [], prev;
    for (let i = 0; i <= idx; i++) {
      var cur = this.tokens[i];
      if (cur.tokenType !== TokenType.keyword)
        continue;
      if (this.endScope.indexOf(cur.value!) > -1)
        scope.pop();
      else if (this.beginScope.indexOf(cur.value!) > -1)
        scope.push(0);
      if (prev && this.beginScope.indexOf(prev.value!) > -1 && this.endScope.indexOf(prev.value!) > -1) {
        scope.push(0);
      }
      prev = cur;
    }
    return scope;
  }
  suggestionText(t: Token) {
    if (t === EOF) return '$';
    return (t.type === PrimitiveTypes.enum || t.value?.indexOf('$') === 0) ? t.value?.split(':')[1] : (t.type ?? t.value);
  }
  isEnumeration(t: Token) {
    return t.type?.name === PrimitiveTypes.enum.name;
  }
}
function onlyUnique(value: any, index: any, array: any): boolean {
  return array.findIndex((a: any, idx: number) => a.value === value.value) === index;
}
export function createExpressionValidator(schema: ContextSchema, expectedType: IType): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value as string;
    var lexer = new Lexer();
    var tokens = lexer.Tokenize(value);
    var parser = new Parser(tokens);
    var ast = parser.parseExpression();
    var visitor = new SyntaxErrorVisitor();
    var context = new SemanticErrorContext(schema);
    context.expectedType.push(expectedType);
    if (ast.span.end < tokens.length - 2) // one for $ and one for starting index
      context.errors.push({ span: new Span(ast.span.end, ast.span.end), message: 'unexpected token' });
    ast.visit(visitor as any, context);
    var visitor1 = new SemanticErrorAnalizer();
    var actualType = ast.visit(visitor1 as any, context);

    return (context.errors?.length || actualType !== expectedType) ? { invalidReturnType: true } : null;
  }
}