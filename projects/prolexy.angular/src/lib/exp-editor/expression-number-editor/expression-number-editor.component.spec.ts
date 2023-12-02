import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpressionNumberEditorComponent } from './expression-number-editor.component';

describe('ExpressionNumberEditorComponent', () => {
  let component: ExpressionNumberEditorComponent;
  let fixture: ComponentFixture<ExpressionNumberEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpressionNumberEditorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpressionNumberEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
