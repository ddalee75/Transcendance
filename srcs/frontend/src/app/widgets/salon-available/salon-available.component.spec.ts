import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalonAvailableComponent } from './salon-available.component';

describe('SalonAvailableComponent', () => {
  let component: SalonAvailableComponent;
  let fixture: ComponentFixture<SalonAvailableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalonAvailableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalonAvailableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
