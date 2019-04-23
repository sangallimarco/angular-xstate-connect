import { TestBed } from '@angular/core/testing';

import { AngularXstateConnectService } from './angular-xstate-connect.service';

describe('AngularXstateConnectService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AngularXstateConnectService = TestBed.get(AngularXstateConnectService);
    expect(service).toBeTruthy();
  });
});
