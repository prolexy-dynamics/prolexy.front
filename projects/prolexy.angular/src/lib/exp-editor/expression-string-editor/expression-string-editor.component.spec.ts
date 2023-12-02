import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpressionStringEditorComponent } from './expression-string-editor.component';

describe('ExpressionStringEditorComponent', () => {
  let component: ExpressionStringEditorComponent;
  let fixture: ComponentFixture<ExpressionStringEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpressionStringEditorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpressionStringEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
