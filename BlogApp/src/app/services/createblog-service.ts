import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CreateblogService {
  private Http=inject(HttpClient);
    baseUrl = 'http://localhost:5030/api/Blog';

    createblog(input: any) {

    const token = localStorage.getItem('token');
    const headers= new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.Http.post(this.baseUrl, input, { headers });
    }
}