import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlocUserProfileComponent } from './bloc-user-profile.component';

describe('BlocUserProfileComponent', () => {
  let component: BlocUserProfileComponent;
  let fixture: ComponentFixture<BlocUserProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlocUserProfileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlocUserProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
