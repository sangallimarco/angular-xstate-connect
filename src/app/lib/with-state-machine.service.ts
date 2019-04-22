import { Injectable } from '@angular/core';
import {
    Machine,
    Interpreter,
    StateValue,
    interpret,
    State,
    StateSchema,
    DefaultContext,
    EventObject,
    MachineConfig,
    StateMachine,
    MachineOptions
} from 'xstate';
import { v4 } from 'uuid';
import { ReplaySubject } from 'rxjs';

export interface StateMachineHOCState<TContext, TStateSchema extends StateSchema> {
    currentState: StateMachineStateName<TStateSchema>;
    context: TContext,
    stateHash?: string;
}

export interface StateMachineAction<T> extends EventObject {
    data: Partial<T>
}

export type StateMachineStateName<T extends StateSchema> = keyof T['states'];

export type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;

export type Subtract<T, K> = Omit<T, keyof K>;

@Injectable({
    providedIn: 'root'
})
export class WithStateMachineService<TStateSchema extends StateSchema, TContext = DefaultContext, TEvent extends EventObject = EventObject> {

    private stateMachine: StateMachine<TContext, TStateSchema, TEvent>;
    private interpreter: Interpreter<TContext, TStateSchema, TEvent>;
    private currentStateName: StateValue;
    private currentContext: TContext | null = null;
    private state: StateMachineHOCState<TContext, TStateSchema>;
    private updateStream = new ReplaySubject<StateMachineHOCState<TContext, TStateSchema>>(1);

    public init(config: MachineConfig<TContext, TStateSchema, TEvent>, initialContext: TContext, configOptions: Partial<MachineOptions<TContext, TEvent>> = {}) {
        this.stateMachine = Machine(config, configOptions, initialContext);
        // this.stateMachine.withConfig(configOptions);
        this.state = { currentState: this.stateMachine.initialState.value as StateMachineStateName<TStateSchema>, context: this.stateMachine.context as TContext };
        this.initInterpreter();
        this.update();
    }

    public destroy() {
        this.stopInterpreter();
        this.currentContext = null;
    }

    private update() {
        this.updateStream.next(this.state);
    }

    public subscribe(callback: (state: StateMachineHOCState<TContext, TStateSchema>) => void): void {
        this.updateStream.subscribe(callback);
    }

    private initInterpreter() {
        if (!this.interpreter) {
            this.interpreter = interpret(this.stateMachine);
            this.interpreter
                .start();
            this.interpreter
                .onTransition((current) => {
                    this.handleTransition(current);
                });
            this.interpreter
                .onChange((context) => {
                    this.handleContext(context);
                });
        }
    }

    public stopInterpreter() {
        if (this.interpreter) {
            this.interpreter.stop();
        }
    }

    private handleTransition(newState: State<TContext, EventObject>) {
        const { changed, value } = newState;

        if (changed && value !== this.currentStateName) {
            this.currentStateName = value;
            const newStateName = value as StateMachineStateName<TStateSchema>;
            this.state = Object.assign(this.state, { currentState: newStateName, stateHash: v4() });
            this.update();
        }
    }

    private handleContext(context: TContext) {
        if (context !== this.currentContext) {
            this.state = Object.assign(this.state, { context, stateHash: v4() });
            this.currentContext = context;
            this.update();
        }
    }

    public dispatch = (action: TEvent) => {
        if (this.interpreter) {
            this.interpreter
                .send(action);
        }
    };
}
