import { TestBed } from '@angular/core/testing';

import { AngularXstateConnectService } from './angular-xstate-connect.service';

describe('AngularXstateConnectService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [AngularXstateConnectService]
  }));

  it('should be created', () => {
    const service: AngularXstateConnectService<any, any, any> = TestBed.get(AngularXstateConnectService);
    expect(service).toBeTruthy();
  });
});
