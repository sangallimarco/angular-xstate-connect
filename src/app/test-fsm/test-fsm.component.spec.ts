import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TestFsmComponent } from './test-fsm.component';
import { AngularXstateConnectService } from 'angular-xstate-connect';
import { DebugElement } from '@angular/core';
import { TestCommentComponent } from '../test-comment/test-comment.component';
import { TestFsmService, TestFsmServiceMock } from './test-fsm.service';
import { TestMachineState } from './test-fms.config';

describe('TestFsmComponent', () => {
  let component: TestFsmComponent;
  let fixture: ComponentFixture<TestFsmComponent>;
  let debugElement: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TestFsmComponent, TestCommentComponent],
      providers: [
        {provide: AngularXstateConnectService}, {provide: TestFsmService, useClass: TestFsmServiceMock}]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestFsmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    spyOn(component, 'dispatch');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    component.handleReset();
    expect(component.dispatch).toHaveBeenCalled();
    expect(component.state.currentState).toEqual(TestMachineState.START);
  });

  it('should change state', () => {
    expect(component).toBeTruthy();
    component.handleClick();
    expect(component.dispatch).toHaveBeenCalledWith({ type: 'SUBMIT', extra: 'ok' });
    // expect(component.state.currentState).toEqual(TestMachineState.PROCESSING);
  });
});
