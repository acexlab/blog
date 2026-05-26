import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CreateblogService } from '../../services/createblog-service';

@Component({
  selector: 'app-create-blog',
  imports: [FormsModule],
  templateUrl: './create-blog.html',
  styleUrl: './create-blog.css',
})
export class CreateBlog {

  service = inject(CreateblogService);
  router = inject(Router);

  blog = {
    title: '',
    content: ''
  };

  submitForm() {

    console.log(this.blog);

    this.service.createblog(this.blog).subscribe({
      next: (res) => {
        console.log('Blog Created Successfully');
        console.log(res);

        this.router.navigate(['/home']);
      },

      error: (err) => {
        console.log(err);
      }
    });
  }
}