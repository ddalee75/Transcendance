import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserInSalonComponent } from './user-in-salon.component';

describe('UserInSalonComponent', () => {
  let component: UserInSalonComponent;
  let fixture: ComponentFixture<UserInSalonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserInSalonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserInSalonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
