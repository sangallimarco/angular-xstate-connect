
import { AngularXstateConnectService } from './angular-xstate-connect.service';
import { EventObject, StateSchema, DefaultContext, MachineConfig, MachineOptions } from 'xstate';
import { Injector } from '@angular/core';


export interface AngularXstateConnectProps<TStateSchema, TContext, TEvent extends EventObject = EventObject> {
    state: TContext;
    init: (config: MachineConfig<TContext, TStateSchema, TEvent>,
        context: TContext,
        events: Partial<MachineOptions<TContext, TEvent>>) => void;
        dispatch: (event: TEvent) => void;
}

export function AngularXstateConnect<TStateSchema extends StateSchema, TContext = DefaultContext, TEvent extends EventObject = EventObject>(): ClassDecorator {

    type serviceType = AngularXstateConnectService<TStateSchema, TContext, TEvent>;

    return function (constructor: any) {
        const injector = Injector.create({ providers: [{ provide: AngularXstateConnectService, deps: [] }] });
        const stateMachine: serviceType = injector.get(AngularXstateConnectService) as any;

        // create state variable
        constructor.prototype.state = undefined;
        // constructor.prototype.stateMachine = stateMachine;

        const ngOnInit = constructor.prototype.ngOnInit;
        constructor.prototype.ngOnInit = function (...args) {
            ngOnInit && ngOnInit.apply(this, args);
        }

        constructor.prototype.init = function (
            config: MachineConfig<TContext, TStateSchema, TEvent>,
            context: TContext,
            events: Partial<MachineOptions<TContext, TEvent>>) {

            stateMachine.init(config, context, events);
            stateMachine.subscribe((state) => {
                this.state = state;
            });
        }

        constructor.prototype.dispatch = function (event: TEvent){
            stateMachine.dispatch(event);
        };

        const ngOnDestroy = constructor.prototype.ngOnDestroy;

        constructor.prototype.ngOnDestroy = function (...args) {
            stateMachine.destroy();
            ngOnDestroy && ngOnDestroy.apply(this, args);
        }

    }
}