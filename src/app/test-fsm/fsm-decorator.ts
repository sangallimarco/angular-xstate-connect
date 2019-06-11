
import { AngularXstateConnectService, StateMachineData } from 'angular-xstate-connect';
import { EventObject, StateSchema, DefaultContext } from 'xstate';
import { Injector } from '@angular/core';


export interface ConnectFSMProps<TStateSchema, TContext, TEvent extends EventObject = EventObject> {
  stateMachine: AngularXstateConnectService<TStateSchema, TContext, TEvent>;
  state: TContext;
}

export function ConnectFSM<TStateSchema extends StateSchema, TContext = DefaultContext, TEvent extends EventObject = EventObject>(): ClassDecorator {

  type serviceType = AngularXstateConnectService<TStateSchema, TContext, TEvent>;

  return function (constructor: any) {
    const injector = Injector.create({ providers: [{ provide: AngularXstateConnectService,  deps: [] }] });
    const stateMachine = injector.get(AngularXstateConnectService) as serviceType;

    const ngOnInit = constructor.prototype.ngOnInit;

    // create state variable
    constructor.prototype.state = undefined;
    constructor.prototype.stateMachine = stateMachine;

    constructor.prototype.ngOnInit = function (...args) {
      stateMachine.subscribe((state) => {
        this.state = state;
      });
      ngOnInit && ngOnInit.apply(this, args);
    }

    const ngOnDestroy = constructor.prototype.ngOnDestroy;

    constructor.prototype.ngOnDestroy = function (...args) {
      stateMachine.destroy();
      ngOnDestroy && ngOnDestroy.apply(this, args);
    }

  }
}