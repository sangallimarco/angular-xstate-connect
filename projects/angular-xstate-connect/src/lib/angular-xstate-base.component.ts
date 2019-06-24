import { OnInit, OnDestroy, Input, EventEmitter } from '@angular/core';
import { StateMachineData, AngularXstateConnectService } from './angular-xstate-connect.service';
import { MachineConfig, EventObject, MachineOptions } from 'xstate';
import { Subscription } from 'rxjs';

export class AngularXstateBaseComponent<TContext, TStateSchema, TEvent extends EventObject = EventObject> implements OnInit, OnDestroy {

    public state: StateMachineData<TContext, TStateSchema>;
    private streamSub: Subscription | undefined;

    constructor(
        private stateMachine: AngularXstateConnectService<TStateSchema, TContext, TEvent>,
        config: MachineConfig<TContext, TStateSchema, TEvent>,
        initialContext: TContext
    ) {
        this.stateMachine.setConfig(config, initialContext);
    }

    init(
        configOptions?: Partial<MachineOptions<TContext, TEvent>>,
        stream?: EventEmitter<TEvent>
    ) {
        this.stateMachine.init(configOptions);
        this.stateMachine.subscribe((state) => {
            this.state = state;
        });
        if (stream) {
            this.streamSub = stream.subscribe((event: TEvent) => {
                this.stateMachine.dispatch(event);
            });
        }
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
        if (this.streamSub) {
            this.streamSub.unsubscribe();
        }
        this.stateMachine.destroy();
    }

}
