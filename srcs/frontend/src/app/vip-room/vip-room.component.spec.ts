import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VipRoomComponent } from './vip-room.component';

describe('VipRoomComponent', () => {
  let component: VipRoomComponent;
  let fixture: ComponentFixture<VipRoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VipRoomComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VipRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
