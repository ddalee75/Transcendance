import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PongPlayerComponent } from './pong-player.component';

describe('PongPlayerComponent', () => {
  let component: PongPlayerComponent;
  let fixture: ComponentFixture<PongPlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PongPlayerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PongPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
