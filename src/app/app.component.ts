import { Component, EventEmitter } from '@angular/core';
import { TestMachineEvent, TestMachineAction } from './test-fsm/test-fms.config'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {

  title = 'my-angular-app';
  stream = new EventEmitter<TestMachineEvent>();

  handleRemoteAction() {
    this.stream.next({type: TestMachineAction.RESET});
  }
}
