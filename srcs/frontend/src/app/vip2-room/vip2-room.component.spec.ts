import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Vip2RoomComponent } from './vip2-room.component';

describe('Vip2RoomComponent', () => {
  let component: Vip2RoomComponent;
  let fixture: ComponentFixture<Vip2RoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Vip2RoomComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Vip2RoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
