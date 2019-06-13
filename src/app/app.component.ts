import { Component, EventEmitter } from '@angular/core';
import { TestMachineEvent, TestMachineAction } from './test-fsm/test-fms.config'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {

  title = 'my-angular-app';
  private readonly stream = new EventEmitter<TestMachineEvent>();

  getStream() {
    return this.stream;
  }

  handleRemoteAction() {
    this.stream.next({type: TestMachineAction.RESET});
  }
}
