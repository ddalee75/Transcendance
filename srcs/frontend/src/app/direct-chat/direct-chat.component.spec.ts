import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectChatComponent } from './direct-chat.component';

describe('DirectChatComponent', () => {
  let component: DirectChatComponent;
  let fixture: ComponentFixture<DirectChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DirectChatComponent ],
      imports: [ HttpClientTestingModule ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DirectChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
