import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatorInSalonComponent } from './creator-in-salon.component';

describe('CreatorInSalonComponent', () => {
  let component: CreatorInSalonComponent;
  let fixture: ComponentFixture<CreatorInSalonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatorInSalonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatorInSalonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
