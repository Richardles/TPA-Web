import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelCommunityComponent } from './channel-community.component';

describe('ChannelCommunityComponent', () => {
  let component: ChannelCommunityComponent;
  let fixture: ComponentFixture<ChannelCommunityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChannelCommunityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelCommunityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
