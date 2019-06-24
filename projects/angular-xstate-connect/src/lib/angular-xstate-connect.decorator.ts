
import { AngularXstateConnectService, StateMachineData } from './angular-xstate-connect.service';
import { EventObject, StateSchema, DefaultContext, MachineConfig, MachineOptions } from 'xstate';
import { Injector } from '@angular/core';


export interface AngularXstateConnectProps<TStateSchema, TContext, TEvent extends EventObject = EventObject> {
    state: StateMachineData<TContext, TStateSchema> | undefined;
    stateMachine: AngularXstateConnectService<TStateSchema, TContext, TEvent>
}

export function AngularXstateConnect<TStateSchema extends StateSchema, TContext = DefaultContext, TEvent extends EventObject = EventObject>(
    config: {
        machine: MachineConfig<TContext, TStateSchema, TEvent>,
        initialContext: TContext
    }
): ClassDecorator {

    type serviceType = AngularXstateConnectService<TStateSchema, TContext, TEvent>;

    return function (constructor: any) {
        const { machine, initialContext } = config;
        const injector = Injector.create({ providers: [{ provide: AngularXstateConnectService, deps: [] }] });
        const stateMachine: serviceType = injector.get(AngularXstateConnectService) as any;
        stateMachine.setConfig(machine, initialContext);

        // create state variable
        constructor.prototype.state = initialContext;
        constructor.prototype.stateMachine = stateMachine;

        const ngOnInit = constructor.prototype.ngOnInit;

        constructor.prototype.ngOnInit = function (...args) {
            stateMachine.subscribe((state) => {
                this.state = state;
            });
            ngOnInit && ngOnInit.apply(this, args);
            // configure if not set up
            stateMachine.init({});
        }

        const ngOnDestroy = constructor.prototype.ngOnDestroy;
        constructor.prototype.ngOnDestroy = function (...args) {
            stateMachine.destroy();
            ngOnDestroy && ngOnDestroy.apply(this, args);
        }

    }
}