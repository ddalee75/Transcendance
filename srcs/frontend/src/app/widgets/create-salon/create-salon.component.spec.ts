import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSalonComponent } from './create-salon.component';

describe('CreateSalonComponent', () => {
  let component: CreateSalonComponent;
  let fixture: ComponentFixture<CreateSalonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateSalonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateSalonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
