import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrendingVideoBoxComponent } from './trending-video-box.component';

describe('TrendingVideoBoxComponent', () => {
  let component: TrendingVideoBoxComponent;
  let fixture: ComponentFixture<TrendingVideoBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrendingVideoBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrendingVideoBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
