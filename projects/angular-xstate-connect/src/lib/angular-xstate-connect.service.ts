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

export interface StateMachineData<TContext, TStateSchema extends StateSchema> {
  currentState: StateMachineStateName<TStateSchema>;
  context: TContext,
  stateHash?: string;
}

export interface StateMachineAction<T> extends EventObject {
  data: Partial<T>
}

export type StateMachineStateName<T extends StateSchema> = keyof T['states'];


@Injectable({
  providedIn: 'root'
})
export class AngularXstateConnectService<TStateSchema extends StateSchema, TContext = DefaultContext, TEvent extends EventObject = EventObject> {

  private stateMachine: StateMachine<TContext, TStateSchema, TEvent>;
  private interpreter: Interpreter<TContext, TStateSchema, TEvent>;
  private currentStateName: StateValue;
  private currentContext: TContext | null = null;
  private state: StateMachineData<TContext, TStateSchema>;
  private updateStream = new ReplaySubject<StateMachineData<TContext, TStateSchema>>(1);

  private initInterpreter(): void {
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

  private handleContext(context: TContext): void {
    if (context !== this.currentContext) {
      this.state = Object.assign(this.state, { context, stateHash: v4() });
      this.currentContext = context;
      this.update();
    }
  }

  private handleTransition(newState: State<TContext, EventObject>): void {
    const { changed, value } = newState;

    if (changed && value !== this.currentStateName) {
      this.currentStateName = value;
      const newStateName = value as StateMachineStateName<TStateSchema>;
      this.state = Object.assign(this.state, { currentState: newStateName, stateHash: v4() });
      this.update();
    }
  }

  public init(config: MachineConfig<TContext, TStateSchema, TEvent>, initialContext: TContext, configOptions: Partial<MachineOptions<TContext, TEvent>> = {}): void {
    this.stateMachine = Machine(config, configOptions, initialContext);
    this.state = { currentState: this.stateMachine.initialState.value as StateMachineStateName<TStateSchema>, context: this.stateMachine.context as TContext };
    this.initInterpreter();
    this.update();
  }

  public destroy(): void {
    this.stopInterpreter();
    this.currentContext = null;
  }

  private update(): void {
    this.updateStream.next(this.state);
  }

  public subscribe(callback: (state: StateMachineData<TContext, TStateSchema>) => void): void {
    this.updateStream.subscribe(callback);
  }

  public stopInterpreter(): void {
    if (this.interpreter) {
      this.interpreter.stop();
    }
  }

  public dispatch = (action: TEvent): void => {
    if (this.interpreter) {
      this.interpreter
        .send(action);
    }
  };
}
