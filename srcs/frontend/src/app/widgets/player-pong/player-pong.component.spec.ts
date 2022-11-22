import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerPongComponent } from './player-pong.component';

describe('PlayerPongComponent', () => {
  let component: PlayerPongComponent;
  let fixture: ComponentFixture<PlayerPongComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlayerPongComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayerPongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
