import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../../services/login-service';
import { Router, RouterLink } from '@angular/router';
import { UiToastService } from '../../services/ui-toast.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  service = inject(LoginService);
  router = inject(Router)
  toast = inject(UiToastService);

  user = {
    email: '',
    password: ''
  };

  ngOnInit() {
    if (localStorage.getItem('token')) {
      this.toast.show('You are already logged in.', 'info');
      this.router.navigate(['/home']);
    }
  }

  private getUserIdFromToken(token: string): string | null {
    try {
      const payloadPart = token.split('.')[1];
      if (!payloadPart) {
        return null;
      }

      const payload = JSON.parse(atob(payloadPart.replace(/-/g, '+').replace(/_/g, '/')));
      return payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']
        ?? payload.nameid
        ?? payload.sub
        ?? null;
    } catch {
      return null;
    }
  }

  private getUserDetailsFromToken(token: string): { name: string; email: string } | null {
    try {
      const payloadPart = token.split('.')[1];
      if (!payloadPart) {
        return null;
      }

      const payload = JSON.parse(atob(payloadPart.replace(/-/g, '+').replace(/_/g, '/')));

      return {
        name: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name']
          ?? payload.unique_name
          ?? payload.name
          ?? 'User',
        email: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress']
          ?? payload.email
          ?? 'N/A',
      };
    } catch {
      return null;
    }
  }

  submitForm() {

    console.log(this.user);

    this.service.login(this.user).subscribe({
      next: (res: any) => {

        console.log("Login Success");
        console.log(res);

        localStorage.setItem('token', res.token);
        const userId = this.getUserIdFromToken(res.token);
        if (userId) {
          localStorage.setItem('userId', userId);
        }

        const userDetails = this.getUserDetailsFromToken(res.token);
        if (userDetails) {
          localStorage.setItem('userName', userDetails.name);
          localStorage.setItem('userEmail', userDetails.email);
        }

        this.toast.show('Logged in successfully.', 'success');

        this.router.navigate(['/home'])

      },

      error: (err) => {

        console.log("Login Failed");
        console.log(err.error);
        this.toast.show(err?.error ?? 'Login failed. Please check your credentials.', 'danger');

      }
    });

  }
}