import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitationGameComponent } from './invitation-game.component';

describe('InvitationGameComponent', () => {
  let component: InvitationGameComponent;
  let fixture: ComponentFixture<InvitationGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvitationGameComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvitationGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
