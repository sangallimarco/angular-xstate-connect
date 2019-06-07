import { Component, OnInit, OnDestroy } from '@angular/core';
import {  StateMachineData, AngularXstateConnectService } from 'angular-xstate-connect';
import { TestContext, TestMachineStateSchema, TestMachineEvent, TestMachineService, TestMachineConfig, TestMachineInitialContext, TestMachineAction, TestMachineState } from './test-fms.config';
import { TestFsmService } from './test-fsm.service';

@Component({
  selector: 'app-test-fsm',
  templateUrl: './test-fsm.component.html',
  styleUrls: ['./test-fsm.component.less'],
  providers: [AngularXstateConnectService]
})
export class TestFsmComponent implements OnInit, OnDestroy {

  state: StateMachineData<TestContext, TestMachineStateSchema>;
  submitVisible: boolean = true;
  // testMachineStateEnum: TestMachineState;

  constructor(private stateMachine: AngularXstateConnectService<TestMachineStateSchema, TestContext, TestMachineEvent>, private dataService: TestFsmService) {

    const options = {
      services: {
        [TestMachineService.FETCH_DATA]: (ctx) => this.dataService.getComments()
      }
    };

    this.stateMachine.init(TestMachineConfig, TestMachineInitialContext, options);
    this.stateMachine.subscribe((state) => {
      this.state = state;
      this.submitVisible = state.currentState === TestMachineState.START;
    });
  }

  ngOnInit() {

  }

  ngOnDestroy() {
    this.stateMachine.destroy();
  }

  handleClick() {
    this.stateMachine.dispatch({ type: TestMachineAction.SUBMIT, extra: 'ok' });
  }

  handleReset() {
    this.stateMachine.dispatch({ type: TestMachineAction.RESET });
  }

}
