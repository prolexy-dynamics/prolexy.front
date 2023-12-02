import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpressionDatetimeEditorComponent } from './expression-datetime-editor.component';

describe('ExpressionDatetimeEditorComponent', () => {
  let component: ExpressionDatetimeEditorComponent;
  let fixture: ComponentFixture<ExpressionDatetimeEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpressionDatetimeEditorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpressionDatetimeEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
