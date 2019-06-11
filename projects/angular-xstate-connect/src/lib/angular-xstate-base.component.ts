import { OnInit, OnDestroy, Component, Injectable } from '@angular/core';
import { StateMachineData, AngularXstateConnectService } from './angular-xstate-connect.service';
import { MachineConfig, EventObject, MachineOptions } from 'xstate';

export interface AngularXstateBaseProps<TContext, TStateSchema> {
    state: StateMachineData<TContext, TStateSchema>
}

@Injectable()
export class AngularXstateBaseComponent<TContext, TStateSchema, TEvent extends EventObject = EventObject> implements OnInit, OnDestroy, AngularXstateBaseProps<TContext, TStateSchema> {

    public state: StateMachineData<TContext, TStateSchema>;
    // private stateMachine: AngularXstateConnectService<TStateSchema, TContext, TEvent>;

    constructor(
        private stateMachine: AngularXstateConnectService<TStateSchema, TContext, TEvent>
    ) {
        this.stateMachine = stateMachine;
    }

    init(config: MachineConfig<TContext, TStateSchema, TEvent>,
        initialContext: TContext, configOptions?: Partial<MachineOptions<TContext, TEvent>>) {
        this.stateMachine.init(config, initialContext, configOptions);
        this.stateMachine.subscribe((state) => {
            this.state = state;
        });
    }

    ngOnInit() {

    }

    dispatch(action: TEvent) {
        this.stateMachine.dispatch(action);

    }

    subscribe(callback: (state: StateMachineData<TContext, TStateSchema>) => void): void {
        this.stateMachine.subscribe(callback);
    }

    ngOnDestroy() {
        this.stateMachine.destroy();
    }

}
