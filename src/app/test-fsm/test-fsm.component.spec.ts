import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestFsmComponent } from './test-fsm.component';

describe('TestFsmComponent', () => {
  let component: TestFsmComponent;
  let fixture: ComponentFixture<TestFsmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestFsmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestFsmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
