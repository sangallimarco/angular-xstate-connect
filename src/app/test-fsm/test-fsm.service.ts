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

  async getComments(): Promise<Partial<TestContext>> {
    const items = await this.http.get<ApiCommment[]>(this.URI).toPromise();
    return { items };
  }
}
