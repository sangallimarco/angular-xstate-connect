import { OnInit, OnDestroy, Input, EventEmitter } from '@angular/core';
import { StateMachineData, AngularXstateConnectService } from './angular-xstate-connect.service';
import { MachineConfig, EventObject, MachineOptions } from 'xstate';
import { Subscription } from 'rxjs';

export class AngularXstateBaseComponent<TContext, TStateSchema, TEvent extends EventObject = EventObject> implements OnInit, OnDestroy {
    @Input() stream: EventEmitter<TEvent>;

    public state: StateMachineData<TContext, TStateSchema>;
    private streamSub: Subscription | undefined;

    constructor(
        private stateMachine: AngularXstateConnectService<TStateSchema, TContext, TEvent>,
        private config: MachineConfig<TContext, TStateSchema, TEvent>,
        private initialContext: TContext
    ) {
    }

    init(
        configOptions?: Partial<MachineOptions<TContext, TEvent>>,
        stream?: EventEmitter<TEvent>
    ) {
        this.stateMachine.init(this.config, this.initialContext, configOptions);
        this.stateMachine.subscribe((state) => {
            this.state = state;
        });
        if (stream) {
            this.streamSub = stream.subscribe((event: TEvent) => {
                this.stateMachine.dispatch(event);
            });
        }
    }

    dispatch(action: TEvent) {
        this.stateMachine.dispatch(action);
    }

    subscribe(callback: (state: StateMachineData<TContext, TStateSchema>) => void): void {
        this.stateMachine.subscribe(callback);
    }

    ngOnInit(){
        this.init({});
    }

    ngOnDestroy() {
        if (this.streamSub) {
            this.streamSub.unsubscribe();
        }
        this.stateMachine.destroy();
    }
}
