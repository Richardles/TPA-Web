import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelHomeComponent } from './channel-home.component';

describe('ChannelHomeComponent', () => {
  let component: ChannelHomeComponent;
  let fixture: ComponentFixture<ChannelHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChannelHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
