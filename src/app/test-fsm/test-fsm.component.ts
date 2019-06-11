import { Component, OnInit, OnDestroy, Injector } from '@angular/core';
import { TestContext, TestMachineStateSchema, TestMachineEvent, TestMachineService, TestMachineConfig, TestMachineInitialContext, TestMachineAction, TestMachineState } from './test-fms.config';
import { TestFsmService } from './test-fsm.service';
import { AngularXstateConnectService, AngularXstateBaseComponent } from 'angular-xstate-connect';

@Component({
  selector: 'app-test-fsm',
  templateUrl: './test-fsm.component.html',
  styleUrls: ['./test-fsm.component.less'],
  providers: [AngularXstateConnectService]
})
export class TestFsmComponent extends AngularXstateBaseComponent<TestContext, TestMachineStateSchema, TestMachineEvent> implements OnInit, OnDestroy {

  submitVisible: boolean = true;

  constructor(
    stateMachine: AngularXstateConnectService<TestMachineStateSchema, TestContext, TestMachineEvent>,
    private dataService: TestFsmService
  ) {

    // initialise wrapper
    super(stateMachine);
    this.init(
      TestMachineConfig,
      TestMachineInitialContext,
      {
        services: {
          [TestMachineService.FETCH_DATA]: (ctx) => this.dataService.getComments()
        }
      }
    );

    this.subscribe((state) => {
      this.submitVisible = state.currentState === TestMachineState.START;
    });
  }

  ngOnInit() {

  }

  handleClick() {
    this.dispatch({ type: TestMachineAction.SUBMIT, extra: 'ok' });
  }

  handleReset() {
    this.dispatch({ type: TestMachineAction.RESET });
  }

}
