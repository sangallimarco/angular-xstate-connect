import {TestBed} from '@angular/core/testing';

import {WithStateMachineService} from './with-state-machine.service';

describe('WithStateMachineService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service : WithStateMachineService = TestBed.get(WithStateMachineService);
    expect(service).toBeTruthy();
  });
});
