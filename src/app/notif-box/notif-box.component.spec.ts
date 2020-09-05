import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotifBoxComponent } from './notif-box.component';

describe('NotifBoxComponent', () => {
  let component: NotifBoxComponent;
  let fixture: ComponentFixture<NotifBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotifBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotifBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
