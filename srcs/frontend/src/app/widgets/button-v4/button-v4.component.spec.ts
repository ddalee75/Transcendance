import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonV4Component } from './button-v4.component';

describe('ButtonV4Component', () => {
  let component: ButtonV4Component;
  let fixture: ComponentFixture<ButtonV4Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ButtonV4Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ButtonV4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
