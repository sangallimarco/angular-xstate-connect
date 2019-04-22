import { Component, OnInit } from '@angular/core';
import { WithStateMachineService, StateMachineAction, StateMachineHOCState } from '../lib/with-state-machine.service';
import { assign, log } from 'xstate/lib/actions';
import { MachineConfig } from 'xstate';

export interface TestComponentState {
  items: string[];
  cnt: number;
  extra: string;
}

export enum TestMachineState {
  START = 'START',
  PROCESSING = 'PROCESSING',
  LIST = 'LIST',
  ERROR = 'ERROR',
  SHOW_ITEM = 'SHOW_ITEM'
}

export enum TestMachineAction {
  SUBMIT = 'SUBMIT',
  CANCEL = 'CANCEL',
  RESET = 'RESET',
  SELECT = 'SELECT',
  EXIT = 'EXIT',
  FETCH_DATA = 'FETCH_DATA',
  LOOP = 'LOOP'
}

export interface TestMachineStateSchema {
  states: {
    [TestMachineState.START]: {};
    [TestMachineState.PROCESSING]: {};
    [TestMachineState.LIST]: {};
    [TestMachineState.ERROR]: {};
    [TestMachineState.SHOW_ITEM]: {};
  }
}

export type TestMachineEvent =
  | { type: TestMachineAction.SUBMIT, extra: string }
  | { type: TestMachineAction.CANCEL }
  | { type: TestMachineAction.RESET }
  | { type: TestMachineAction.SELECT }
  | { type: TestMachineAction.EXIT }
  | { type: TestMachineAction.LOOP }
  ;

export type TestMachineEventType = StateMachineAction<TestComponentState>;

export enum TestMachineService {
  FETCH_DATA = 'FETCH_DATA'
}

export const STATE_CHART: MachineConfig<TestComponentState, TestMachineStateSchema, TestMachineEvent> = {
  id: 'test',
  initial: TestMachineState.START,
  states: {
    [TestMachineState.START]: {
      on: {
        [TestMachineAction.SUBMIT]: {
          target: TestMachineState.PROCESSING,
          actions: assign((ctx, e) => ({
            extra: e.extra
          })),
          cond: (ctx) => ctx.cnt < 10 // run N times
        }
      },
      onEntry: assign((ctx) => ({
        items: []
      }))
    },
    [TestMachineState.PROCESSING]: {
      invoke: {
        src: TestMachineService.FETCH_DATA,
        onDone: {
          target: TestMachineState.LIST,
          actions: [
            assign((ctx, e: TestMachineEventType) => ({
              items: e.data.items
            })),
            log((ctx, e: TestMachineEventType) => e.data)
          ]
        },
        onError: {
          target: TestMachineState.ERROR,
          actions: log((ctx, e) => e.data)
        }
      }
    },
    [TestMachineState.LIST]: {
      on: {
        [TestMachineAction.RESET]: {
          target: TestMachineState.START,
          actions: assign((ctx, e) => ({
            cnt: ctx.cnt + 1
          }))
        },
        [TestMachineAction.SELECT]: TestMachineState.SHOW_ITEM,
        [TestMachineAction.LOOP]: TestMachineState.LIST
      }
    },
    [TestMachineState.SHOW_ITEM]: {
      on: {
        [TestMachineAction.EXIT]: TestMachineState.LIST
      }
    },
    [TestMachineState.ERROR]: {
      on: {
        [TestMachineAction.RESET]: TestMachineState.START
      }
    }
  }
};

export const INITIAL_STATE: TestComponentState = {
  items: [],
  cnt: 0,
  extra: ''
};

@Component({
  selector: 'app-test-fsm',
  templateUrl: './test-fsm.component.html',
  styleUrls: ['./test-fsm.component.less']
})
export class TestFsmComponent implements OnInit {

  state: StateMachineHOCState<TestComponentState, TestMachineStateSchema>;

  constructor(private stateMachine: WithStateMachineService<TestMachineStateSchema, TestComponentState, TestMachineEvent>) {
    const options =  {
      services: {
        [TestMachineService.FETCH_DATA]: (ctx) => Promise.resolve({items: ctx.extra.split('')})
      }
    };

    this.stateMachine.init(STATE_CHART, INITIAL_STATE, options);
    this.stateMachine.subscribe((state) => {
      this.state = state;
    })
  }

  ngOnInit() { }

  handleClick() {
    this.stateMachine.dispatch({type: TestMachineAction.SUBMIT, extra: 'ok'} );
  }

}
