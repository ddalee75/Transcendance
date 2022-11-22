import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PongBallComponent } from './pong-ball.component';

describe('PongBallComponent', () => {
  let component: PongBallComponent;
  let fixture: ComponentFixture<PongBallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PongBallComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PongBallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
