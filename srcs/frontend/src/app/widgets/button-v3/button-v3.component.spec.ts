import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonV3Component } from './button-v3.component';

describe('ButtonV3Component', () => {
  let component: ButtonV3Component;
  let fixture: ComponentFixture<ButtonV3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ButtonV3Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ButtonV3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
