import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Registeruser } from '../../services/register-services';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  service = inject(Registeruser);
  router = inject(Router);

  user = {
    name: '',
    email: '',
    password: '',
  };

  ngOnInit() {
    if (localStorage.getItem('token')) {
      this.router.navigate(['/home']);
    }
  }

  submitFrom = () => {
    console.log('Sending:', this.user);

    this.service.PostUser(this.user).subscribe({
      next: (res) => {
        console.log('SUCCESS');
        console.log(res);
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.log('ERROR OCCURRED');
        console.log('Status:', err.status);
        console.log('Status Text:', err.statusText);
        console.log('Error Body:', err.error);
        console.log(err);
      },
    });
  };
}