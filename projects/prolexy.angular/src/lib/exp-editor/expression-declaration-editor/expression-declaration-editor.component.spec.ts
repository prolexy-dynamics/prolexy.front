import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpressionDeclarationEditorComponent } from './expression-declaration-editor.component';

describe('ExpressionDeclarationEditorComponent', () => {
  let component: ExpressionDeclarationEditorComponent;
  let fixture: ComponentFixture<ExpressionDeclarationEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpressionDeclarationEditorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpressionDeclarationEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
