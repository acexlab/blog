import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private Http=inject(HttpClient);
    baseUrl = 'http://localhost:5030/api/auth/login';
    login(input: any) {
    return this.Http.post(this.baseUrl, input);
    }
}
