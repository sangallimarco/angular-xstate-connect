import { MachineConfig } from 'xstate';
import { log, assign } from 'xstate/lib/actions';
import { ApiCommment } from './test-fsm.service';
import { StateMachineAction } from 'angular-xstate-connect';

export interface TestContext {
    items: ApiCommment[];
    cnt: number;
    extra: string;
}

export const TestMachineInitialContext: TestContext = {
    items: [],
    cnt: 0,
    extra: ''
};

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

export type TestMachineEventType = StateMachineAction<TestContext>;

export enum TestMachineService {
    FETCH_DATA = 'FETCH_DATA'
}

export const TestMachineConfig: MachineConfig<TestContext, TestMachineStateSchema, TestMachineEvent> = {
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

