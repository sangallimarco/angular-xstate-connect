import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestCommentComponent } from './test-comment.component';

describe('TestCommentComponent', () => {
  let component: TestCommentComponent;
  let fixture: ComponentFixture<TestCommentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestCommentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    component.comment = {id: '123', body: 'body here', postId: '1232323'};
    fixture.detectChanges();
  });
});
