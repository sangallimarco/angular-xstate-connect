import { Component, Input, EventEmitter } from '@angular/core';
import { TestContext, TestMachineStateSchema, TestMachineEvent, TestMachineService, TestMachineConfig, TestMachineInitialContext, TestMachineAction, TestMachineState } from './test-fms.config';
import { TestFsmService } from './test-fsm.service';
import { AngularXstateConnect, AngularXstateConnectProps, StateMachineData, AngularXstateConnectService } from 'angular-xstate-connect';

@AngularXstateConnect({
  machine: TestMachineConfig,
  initialContext: TestMachineInitialContext,
})
@Component({
  selector: 'app-test-fsm',
  templateUrl: './test-fsm.component.html',
  styleUrls: ['./test-fsm.component.less']
})
export class TestFsmComponent implements AngularXstateConnectProps<TestMachineStateSchema, TestContext, TestMachineEvent>{

  // remote communication stream, it is then passed to the FSM
  @Input() stream: EventEmitter<TestMachineEvent>;
  submitVisible: boolean = true;
  state: StateMachineData<TestContext, TestMachineStateSchema> | undefined;
  stateMachine: AngularXstateConnectService<TestMachineStateSchema, TestContext, TestMachineEvent>;

  constructor(
    private dataService: TestFsmService
  ) {
  }

  ngOnInit() {
    this.stateMachine.init({
      services: {
        [TestMachineService.FETCH_DATA]: (ctx) => this.dataService.getComments()
      }
    });
    this.stateMachine.subscribe((state) => {
      this.submitVisible = state.currentState === TestMachineState.START;
    });
  }

  handleClick() {
    this.stateMachine.dispatch({ type: TestMachineAction.SUBMIT, extra: 'ok' });
  }

  handleReset() {
    this.stateMachine.dispatch({ type: TestMachineAction.RESET });
  }

  handleSelect() {
    this.stateMachine.dispatch({ type: TestMachineAction.RESET });
  }

}
