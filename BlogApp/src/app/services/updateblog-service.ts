import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UpdateblogService {
  private http = inject(HttpClient);

  baseUrl = 'http://localhost:5030/api/Blog';

  getBlog(id: string) {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  updateBlog(id: string, input: any) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put(`${this.baseUrl}/${id}`, input, { headers });
  }
}
