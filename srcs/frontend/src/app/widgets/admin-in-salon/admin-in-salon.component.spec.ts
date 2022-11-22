import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminInSalonComponent } from './admin-in-salon.component';

describe('AdminInSalonComponent', () => {
  let component: AdminInSalonComponent;
  let fixture: ComponentFixture<AdminInSalonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminInSalonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminInSalonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
