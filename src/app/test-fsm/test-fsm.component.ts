import { Component, OnInit, OnDestroy } from '@angular/core';
import { WithStateMachineService, StateMachineData } from '../lib/with-state-machine.service';
import { TestContext, TestMachineStateSchema, TestMachineEvent, TestMachineService, TestMachineConfig, TestMachineInitialContext, TestMachineAction } from './test-fms.config';

@Component({
  selector: 'app-test-fsm',
  templateUrl: './test-fsm.component.html',
  styleUrls: ['./test-fsm.component.less']
})
export class TestFsmComponent implements OnInit, OnDestroy {

  state: StateMachineData<TestContext, TestMachineStateSchema>;

  constructor(private stateMachine: WithStateMachineService<TestMachineStateSchema, TestContext, TestMachineEvent>) {
    const options = {
      services: {
        [TestMachineService.FETCH_DATA]: (ctx) => Promise.resolve({ items: ctx.extra.split('') })
      }
    };

    this.stateMachine.init(TestMachineConfig, TestMachineInitialContext, options);
  }

  ngOnInit() {
    this.stateMachine.subscribe((state) => {
      this.state = state;
    });
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
