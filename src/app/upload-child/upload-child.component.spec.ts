import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadChildComponent } from './upload-child.component';

describe('UploadChildComponent', () => {
  let component: UploadChildComponent;
  let fixture: ComponentFixture<UploadChildComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadChildComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadChildComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
