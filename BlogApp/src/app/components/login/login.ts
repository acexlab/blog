import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../../services/login-service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  service = inject(LoginService);
  router = inject(Router)

  user = {
    email: '',
    password: ''
  };

  ngOnInit() {
    if (localStorage.getItem('token')) {
      this.router.navigate(['/home']);
    }
  }

  submitForm() {

    console.log(this.user);

    this.service.login(this.user).subscribe({
      next: (res: any) => {

        console.log("Login Success");
        console.log(res);

        localStorage.setItem('token', res.token);

        this.router.navigate(['/home'])

      },

      error: (err) => {

        console.log("Login Failed");
        console.log(err.error);

      }
    });

  }
}