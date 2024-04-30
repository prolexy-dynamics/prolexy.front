import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PositionKeepingVoucherTemplateComponent } from './position-keeping-voucher-template.component';

describe('PositionKeepingVoucherTemplateComponent', () => {
  let component: PositionKeepingVoucherTemplateComponent;
  let fixture: ComponentFixture<PositionKeepingVoucherTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PositionKeepingVoucherTemplateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PositionKeepingVoucherTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
