import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { TestFsmService } from './test-fsm.service';

describe('TestFsmService', () => {
  let httpTestingController: HttpTestingController;
  let service: TestFsmService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    httpTestingController = TestBed.get(HttpTestingController);
    service =  TestBed.get(TestFsmService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    service.getComments();
    const req = httpTestingController.expectOne('https://my-json-server.typicode.com/typicode/demo/comments');
    expect(req.request.method).toEqual('GET');
  });
});
