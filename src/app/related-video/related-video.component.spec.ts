import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatedVideoComponent } from './related-video.component';

describe('RelatedVideoComponent', () => {
  let component: RelatedVideoComponent;
  let fixture: ComponentFixture<RelatedVideoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RelatedVideoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelatedVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
