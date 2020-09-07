import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QueueBoxComponent } from './queue-box.component';

describe('QueueBoxComponent', () => {
  let component: QueueBoxComponent;
  let fixture: ComponentFixture<QueueBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QueueBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QueueBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
