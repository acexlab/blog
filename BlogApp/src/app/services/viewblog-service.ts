import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ViewblogService {

  private http = inject(HttpClient);

  baseUrl = 'http://localhost:5030/api/Blog';

  getBlogs() {
    return this.http.get(this.baseUrl);
  }
}