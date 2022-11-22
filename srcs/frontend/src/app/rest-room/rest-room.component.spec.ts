import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestRoomComponent } from './rest-room.component';

describe('RestRoomComponent', () => {
  let component: RestRoomComponent;
  let fixture: ComponentFixture<RestRoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RestRoomComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RestRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
