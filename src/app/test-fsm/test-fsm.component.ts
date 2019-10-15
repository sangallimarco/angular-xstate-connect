import { Component, OnInit } from '@angular/core';
import {
  TestContext,
  TestMachineStateSchema,
  TestMachineEvent,
  TestMachineService,
  TestMachineConfig,
  TestMachineInitialContext,
  TestMachineAction,
  TestMachineState
} from './test-fms.config';
import { TestFsmService } from './test-fsm.service';
import { AngularXstateConnectService, AngularXstateBaseComponent } from 'angular-xstate-connect';

@Component({
  selector: 'app-test-fsm',
  templateUrl: './test-fsm.component.html',
  styleUrls: ['./test-fsm.component.less'],
  providers: [AngularXstateConnectService]
})
export class TestFsmComponent extends AngularXstateBaseComponent<TestContext, TestMachineStateSchema, TestMachineEvent> implements OnInit{

  submitVisible = true;
  states = TestMachineState;

  constructor(
    stateMachine: AngularXstateConnectService<TestMachineStateSchema, TestContext, TestMachineEvent>,
    private dataService: TestFsmService
  ) {
    super(stateMachine, TestMachineConfig, TestMachineInitialContext);
  }

  ngOnInit(): void {
    this.init(
      {
        services: {
          [TestMachineService.FETCH_DATA]: (ctx) => this.dataService.getComments()
        }
      }
    );
  }

  handleClick() {
    this.dispatch({ type: TestMachineAction.SUBMIT, extra: 'ok' });
  }

  handleReset() {
    this.dispatch({ type: TestMachineAction.RESET });
  }

  handleSelect() {
    this.dispatch({ type: TestMachineAction.RESET });
  }

}
