import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaylistBoxSearchComponent } from './playlist-box-search.component';

describe('PlaylistBoxSearchComponent', () => {
  let component: PlaylistBoxSearchComponent;
  let fixture: ComponentFixture<PlaylistBoxSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlaylistBoxSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaylistBoxSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
