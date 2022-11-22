import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitationRefuseComponent } from './invitation-refuse.component';

describe('InvitationRefuseComponent', () => {
  let component: InvitationRefuseComponent;
  let fixture: ComponentFixture<InvitationRefuseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvitationRefuseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvitationRefuseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
