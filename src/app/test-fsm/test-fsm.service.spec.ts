import { TestBed } from '@angular/core/testing';

import { TestFsmService } from './test-fsm.service';

describe('TestFsmService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TestFsmService = TestBed.get(TestFsmService);
    expect(service).toBeTruthy();
  });
});
