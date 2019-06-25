
import { AngularXstateConnectService, StateMachineData } from './angular-xstate-connect.service';
import { EventObject, StateSchema, DefaultContext, MachineConfig } from 'xstate';
import { Injector } from '@angular/core';


export interface AngularXstateConnectProps<TStateSchema, TContext, TEvent extends EventObject = EventObject> {
    state: StateMachineData<TContext, TStateSchema> | undefined;
    stateMachine: AngularXstateConnectService<TStateSchema, TContext, TEvent>,
}

export function AngularXstateConnect<TStateSchema extends StateSchema, TContext = DefaultContext, TEvent extends EventObject = EventObject>(
    config: {
        machine: MachineConfig<TContext, TStateSchema, TEvent>,
        initialContext: TContext
    }
): ClassDecorator {

    return function (constructor: any) {
        const { machine, initialContext } = config;
        let stateMachine: AngularXstateConnectService<TStateSchema, TContext, TEvent>;

        const ngOnInit = constructor.prototype.ngOnInit;
        constructor.prototype.ngOnInit = function (...args) {
            const injector = Injector.create({ providers: [{ provide: AngularXstateConnectService, deps: [] }] });
            stateMachine = injector.get(AngularXstateConnectService) as any;

            stateMachine.setConfig(machine, initialContext);
            stateMachine.subscribe((state) => {
                this.state = state;
            });

            this.stateMachine = stateMachine;

            ngOnInit && ngOnInit.apply(this, args);

            // configure if not set up
            stateMachine.init({});
        }

        const ngOnDestroy = constructor.prototype.ngOnDestroy;
        constructor.prototype.ngOnDestroy = function (...args) {
            constructor.stateMachine.destroy();
            ngOnDestroy && ngOnDestroy.apply(this, args);
        }

    }
}