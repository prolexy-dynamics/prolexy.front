import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpressionEnumerationEditorComponent } from './expression-enumeration-editor.component';

describe('ExpressionEnumerationEditorComponent', () => {
  let component: ExpressionEnumerationEditorComponent;
  let fixture: ComponentFixture<ExpressionEnumerationEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpressionEnumerationEditorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpressionEnumerationEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
