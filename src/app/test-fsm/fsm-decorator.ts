
import { AngularXstateConnectService, StateMachineData } from 'angular-xstate-connect';
import { EventObject, StateSchema, DefaultContext } from 'xstate';

export interface componentFsmProps {
  
}

export function connectFSM<TStateSchema extends StateSchema, TContext = DefaultContext, TEvent extends EventObject = EventObject>(): ClassDecorator {

  return function (constructor: any) {
    // TODO: use an injector here ... AppModule.injector.get(AnalyticsService);
    const stateMachine = new AngularXstateConnectService<TStateSchema, TContext, TEvent>();

    const ngOnInit = constructor.prototype.ngOnInit;

    // create state variable
    constructor.prototype.state = undefined;
    constructor.prototype.stateMachine = stateMachine;

    constructor.prototype.ngOnInit = function (...args) {
      stateMachine.subscribe((state) => {
        constructor.state = state;
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