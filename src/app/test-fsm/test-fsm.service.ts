import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TestContext } from './test-fms.config';

export interface ApiCommment {
  id: string;
  body: string;
  postId: string;
}

@Injectable({
  providedIn: 'root'
})
export class TestFsmService {

  private URI = 'https://my-json-server.typicode.com/typicode/demo/comments';

  constructor(private http: HttpClient) { }

  getComments(): Promise<Partial<TestContext>> {
    return this.http.get<ApiCommment[]>(this.URI).toPromise()
      .then(
        comments => {
          return { items: comments };
        }
      );
  }
}
