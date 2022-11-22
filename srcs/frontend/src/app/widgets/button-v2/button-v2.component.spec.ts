import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonV2Component } from './button-v2.component';

describe('ButtonV2Component', () => {
  let component: ButtonV2Component;
  let fixture: ComponentFixture<ButtonV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ButtonV2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ButtonV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
