import { OnInit, OnDestroy } from '@angular/core';
import { StateMachineData, AngularXstateConnectService } from './angular-xstate-connect.service';
import { MachineConfig, EventObject, MachineOptions } from 'xstate';

export class AngularXstateBaseComponent<TContext, TStateSchema, TEvent extends EventObject = EventObject> implements OnInit, OnDestroy {

    public state: StateMachineData<TContext, TStateSchema>;
    protected stateMachine: AngularXstateConnectService<TStateSchema, TContext, TEvent>;

    constructor(
        stateMachine: AngularXstateConnectService<TStateSchema, TContext, TEvent>
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
