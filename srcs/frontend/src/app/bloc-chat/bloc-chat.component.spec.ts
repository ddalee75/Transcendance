import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, } from '@angular/forms';

import { BlocChatComponent } from './bloc-chat.component';

describe('BlocChatComponent', () => {
  let component: BlocChatComponent;
  let fixture: ComponentFixture<BlocChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlocChatComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlocChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
